type QueuedRecord = Record<string, unknown>;

const RSVP_STORAGE_KEY = "rsvps";
const ANALYTICS_OUTBOX_KEY = "analyticsOutbox";
const MAX_ANALYTICS_EVENTS = 300;

let rsvpFlushPromise: Promise<{
  synced: QueuedRecord[];
  emailBackedUp: QueuedRecord[];
  syncedCount: number;
  pendingCount: number;
}> | null = null;
let analyticsFlushPromise: Promise<{ syncedCount: number; pendingCount: number }> | null = null;

function canUseStorage(): boolean {
  return typeof window !== "undefined" && Boolean(window.localStorage);
}

function readStoredArray<T extends QueuedRecord>(key: string): T[] {
  if (!canUseStorage()) return [];

  try {
    const value = JSON.parse(localStorage.getItem(key) || "[]") as unknown;
    return Array.isArray(value) ? value as T[] : [];
  } catch {
    return [];
  }
}

function writeStoredArray(key: string, value: readonly QueuedRecord[]) {
  if (!canUseStorage()) return;

  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Storage can be full or blocked. Keep the guest/admin flow moving.
  }
}

export function createQueueId(prefix: string): string {
  const randomPart = globalThis.crypto?.randomUUID?.() || Math.random().toString(36).slice(2, 11);
  return `${prefix}_${randomPart}`;
}

function getRsvpQueueKey(rsvp: QueuedRecord): string {
  if (typeof rsvp.clientSubmissionId === "string") return rsvp.clientSubmissionId;
  const primaryGuest = rsvp.primaryGuest as { firstName?: string; lastName?: string } | undefined;

  return [
    primaryGuest?.firstName || "",
    primaryGuest?.lastName || "",
    typeof rsvp.submittedAt === "string" ? rsvp.submittedAt : "",
    typeof rsvp.invitationMode === "string" ? rsvp.invitationMode : "",
  ].join("|").toLowerCase();
}

function getSyncErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  if (typeof error === "object" && error !== null && "message" in error) {
    return String((error as { message?: unknown }).message || "Server save failed");
  }
  return "Server save failed";
}

export function getQueuedLocalRsvps(): QueuedRecord[] {
  return readStoredArray<QueuedRecord>(RSVP_STORAGE_KEY).filter((rsvp) => (
    rsvp.storage === "local" ||
    rsvp.syncStatus === "pending_sync" ||
    rsvp.syncStatus === "local_only"
  ));
}

export function getLocalRsvps(): QueuedRecord[] {
  return readStoredArray<QueuedRecord>(RSVP_STORAGE_KEY);
}

export function hasStoredLocalRsvp(clientSubmissionId: string): boolean {
  return readStoredArray<QueuedRecord>(RSVP_STORAGE_KEY).some((rsvp) => (
    rsvp.clientSubmissionId === clientSubmissionId
  ));
}

export function saveLocalRsvp(payload: QueuedRecord, error: unknown): QueuedRecord {
  const clientSubmissionId = typeof payload.clientSubmissionId === "string"
    ? payload.clientSubmissionId
    : createQueueId("rsvp");
  const localRecord: QueuedRecord = {
    ...payload,
    clientSubmissionId,
    id: typeof payload.id === "string" ? payload.id : `local_${clientSubmissionId}`,
    storage: "local",
    syncStatus: "pending_sync",
    serverError: getSyncErrorMessage(error),
    syncAttempts: Number(payload.syncAttempts) || 0,
    lastSyncAttemptAt: payload.lastSyncAttemptAt || null,
    emailFallbackSent: Boolean(payload.emailFallbackSent),
    queuedAt: payload.queuedAt || new Date().toISOString(),
  };
  const stored = readStoredArray<QueuedRecord>(RSVP_STORAGE_KEY);
  const queueKey = getRsvpQueueKey(localRecord);
  const existingIndex = stored.findIndex((rsvp) => getRsvpQueueKey(rsvp) === queueKey);

  if (existingIndex >= 0 && stored[existingIndex]?.emailFallbackSent) {
    localRecord.emailFallbackSent = true;
  }

  if (existingIndex >= 0) {
    stored[existingIndex] = { ...stored[existingIndex], ...localRecord };
  } else {
    stored.push(localRecord);
  }

  writeStoredArray(RSVP_STORAGE_KEY, stored);
  return localRecord;
}

function toServerPayload(record: QueuedRecord): QueuedRecord {
  const clean = { ...record };
  delete clean.id;
  delete clean.storage;
  delete clean.syncStatus;
  delete clean.serverError;
  delete clean.syncAttempts;
  delete clean.lastSyncAttemptAt;
  delete clean.emailFallbackSent;
  delete clean.queuedAt;
  delete clean.localOnly;
  return clean;
}

async function postJson(url: string, payload: QueuedRecord, options: { headers?: HeadersInit } = {}) {
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...(options.headers || {}) },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    let message = `HTTP ${response.status}`;
    try {
      const data = await response.json() as { error?: string };
      message = data.error || message;
    } catch {
      // Keep generic status.
    }

    const error = new Error(message) as Error & { status?: number };
    error.status = response.status;
    throw error;
  }

  return response.json().catch(() => ({})) as Promise<Record<string, unknown>>;
}

export function flushLocalRsvps({ onSynced }: { onSynced?: (rsvp: QueuedRecord) => void } = {}) {
  if (rsvpFlushPromise) return rsvpFlushPromise;

  rsvpFlushPromise = (async () => {
    let stored = readStoredArray<QueuedRecord>(RSVP_STORAGE_KEY);
    const queued = getQueuedLocalRsvps();
    const synced: QueuedRecord[] = [];
    const emailBackedUp: QueuedRecord[] = [];

    for (const rsvp of queued) {
      try {
        const responseData = await postJson("/api/rsvp", toServerPayload(rsvp), {
          headers: rsvp.emailFallbackSent ? { "X-RSVP-Skip-Email-Fallback": "1" } : {},
        });
        const queueKey = getRsvpQueueKey(rsvp);

        if (responseData.storage === "email_fallback") {
          stored = stored.map((item) => {
            if (getRsvpQueueKey(item) !== queueKey) return item;
            return {
              ...item,
              emailFallbackSent: true,
              syncStatus: "pending_sync",
              syncAttempts: (Number(item.syncAttempts) || 0) + 1,
              lastSyncAttemptAt: new Date().toISOString(),
              serverError: responseData.warning || "Database save failed after email backup",
            };
          });
          emailBackedUp.push(rsvp);
          break;
        }

        stored = stored.filter((item) => getRsvpQueueKey(item) !== queueKey);
        synced.push(rsvp);
        onSynced?.(rsvp);
      } catch (error) {
        const status = (error as { status?: number }).status;
        const queueKey = getRsvpQueueKey(rsvp);
        stored = stored.map((item) => {
          if (getRsvpQueueKey(item) !== queueKey) return item;
          return {
            ...item,
            syncStatus: status && status >= 400 && status < 500 ? "sync_failed" : "pending_sync",
            syncAttempts: (Number(item.syncAttempts) || 0) + 1,
            lastSyncAttemptAt: new Date().toISOString(),
            serverError: error instanceof Error ? error.message : "Server save failed",
          };
        });

        if (!status || status >= 500) break;
      }
    }

    writeStoredArray(RSVP_STORAGE_KEY, stored);
    return {
      synced,
      emailBackedUp,
      syncedCount: synced.length,
      pendingCount: getQueuedLocalRsvps().length,
    };
  })().finally(() => {
    rsvpFlushPromise = null;
  });

  return rsvpFlushPromise;
}

export function enqueueAnalyticsEvent(payload: QueuedRecord) {
  if (!payload.eventType || !payload.sessionId) return;

  const clientEventId = typeof payload.clientEventId === "string" ? payload.clientEventId : createQueueId("analytics");
  const queuedEvent = {
    ...payload,
    clientEventId,
    queuedAt: payload.queuedAt || new Date().toISOString(),
    syncAttempts: Number(payload.syncAttempts) || 0,
  };
  const stored = readStoredArray<QueuedRecord>(ANALYTICS_OUTBOX_KEY);
  const existingIndex = stored.findIndex((event) => event.clientEventId === clientEventId);

  if (existingIndex >= 0) {
    stored[existingIndex] = { ...stored[existingIndex], ...queuedEvent };
  } else {
    stored.push(queuedEvent);
  }

  writeStoredArray(ANALYTICS_OUTBOX_KEY, stored.slice(-MAX_ANALYTICS_EVENTS));
}

export function flushAnalyticsOutbox({ limit = 25 } = {}) {
  if (analyticsFlushPromise) return analyticsFlushPromise;

  analyticsFlushPromise = (async () => {
    let stored = readStoredArray<QueuedRecord>(ANALYTICS_OUTBOX_KEY);
    const queued = stored.slice(0, limit);
    let syncedCount = 0;

    for (const event of queued) {
      try {
        await postJson("/api/analytics", toServerPayload(event));
        stored = stored.filter((item) => item.clientEventId !== event.clientEventId);
        syncedCount += 1;
      } catch (error) {
        stored = stored.map((item) => {
          if (item.clientEventId !== event.clientEventId) return item;
          return {
            ...item,
            syncAttempts: (Number(item.syncAttempts) || 0) + 1,
            lastSyncAttemptAt: new Date().toISOString(),
            serverError: error instanceof Error ? error.message : "Analytics save failed",
          };
        });
        break;
      }
    }

    writeStoredArray(ANALYTICS_OUTBOX_KEY, stored);
    return {
      syncedCount,
      pendingCount: readStoredArray<QueuedRecord>(ANALYTICS_OUTBOX_KEY).length,
    };
  })().finally(() => {
    analyticsFlushPromise = null;
  });

  return analyticsFlushPromise;
}
