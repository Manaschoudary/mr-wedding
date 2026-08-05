"use client";

import { Fragment, useCallback, useEffect, useState, type FormEvent, type ReactNode } from "react";
import {
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  Download,
  Eye,
  Mail,
  MapPin,
  MessageSquare,
  Minus,
  Pencil,
  Phone,
  Plus,
  RefreshCw,
  Save,
  Search,
  Smartphone,
  Trash2,
  Users,
  X,
  XCircle,
} from "lucide-react";
import {
  FULL_EVENT_DETAILS,
  WEDDING,
  WEDDING_EVENT_ID,
  getAttendanceText,
  normalizeEventAttendance,
  type RSVPEventAttendance,
  type RSVPGuestResponse,
  type RSVPRecordLike,
  type WeddingEvent,
} from "@/lib/data";
import { getLocalRsvps as readLocalRsvps } from "@/lib/offlineOutbox";

const VISITOR_PAGE_SIZE = 50;

interface PrimaryGuest {
  readonly firstName?: string;
  readonly lastName?: string;
  readonly attending?: "yes" | "no" | "";
  readonly phone?: string;
  readonly email?: string;
  readonly notes?: string;
}

interface RSVPRecord extends RSVPRecordLike {
  readonly _id?: string;
  readonly id?: string;
  readonly localOnly?: boolean;
  readonly invitationMode?: string;
  readonly submittedAt?: string;
  readonly createdAt?: string;
  readonly primaryGuest?: PrimaryGuest;
  readonly additionalGuests?: readonly RSVPGuestResponse[];
}

interface VisitorAction {
  readonly id?: string;
  readonly eventType?: string;
  readonly actionName?: string;
  readonly actionLabel?: string;
  readonly timestamp?: string;
  readonly metadata?: Record<string, unknown>;
}

interface VisitorLog {
  readonly id?: string;
  readonly sessionId?: string;
  readonly visitId?: string;
  readonly ipAddress?: string;
  readonly location?: string;
  readonly deviceInfo?: string;
  readonly pagePath?: string;
  readonly metadata?: { invitationLabel?: string } & Record<string, unknown>;
  readonly durationSeconds?: number;
  readonly visitedAt?: string;
  readonly actions?: readonly VisitorAction[];
}

interface VisitorPagination {
  readonly page: number;
  readonly pageSize: number;
  readonly totalVisitors: number;
  readonly totalPages: number;
}

function StatCard({ label, value, sub, color = "linen" }: { readonly label: string; readonly value: number; readonly sub?: string; readonly color?: "linen" | "olive" | "gold" | "red" }) {
  const colors = {
    linen: "border-ink/10 bg-linen-soft text-ink",
    olive: "border-olive/25 bg-[#eef1e4] text-olive",
    gold: "border-gold-dark/30 bg-[#fbf2de] text-[#75572f]",
    red: "border-[#b9786f]/30 bg-[#fff0ed] text-[#8b372f]",
  };
  return (
    <div className={`rounded-xl border p-5 ${colors[color]}`}>
      <p className="mb-1 font-josefin text-xs uppercase tracking-[0.22em] opacity-70">{label}</p>
      <p className="font-cormorant text-4xl font-light italic">{value}</p>
      {sub ? <p className="mt-1 font-josefin text-xs opacity-60">{sub}</p> : null}
    </div>
  );
}

function formatDuration(seconds: unknown): string {
  const total = Number(seconds) || 0;
  if (total < 60) return `${total}s`;

  const minutes = Math.floor(total / 60);
  const remainingSeconds = total % 60;
  if (minutes < 60) return remainingSeconds ? `${minutes}m ${remainingSeconds}s` : `${minutes}m`;

  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return remainingMinutes ? `${hours}h ${remainingMinutes}m` : `${hours}h`;
}

function formatActionName(action: VisitorAction): string {
  if (action.actionLabel) return action.actionLabel;
  if (action.actionName) return action.actionName.replace(/_/g, " ");
  return (action.eventType || "action").replace(/_/g, " ");
}

function formatInvitationMode(mode: string | undefined): string {
  if (mode === "full") return "Full invite";
  if (mode === "wedding-only") return "Wedding only";
  return "Legacy RSVP";
}

function getLocalRsvps(): RSVPRecord[] {
  return readLocalRsvps().map((rsvp, index) => ({
    ...rsvp,
    id: typeof rsvp.id === "string" ? rsvp.id : `local_${String(rsvp.submittedAt || index)}`,
    localOnly: true,
  })) as RSVPRecord[];
}

function getRsvpId(rsvp: RSVPRecord): string {
  return rsvp._id || rsvp.id || "";
}

function getRsvpMergeKey(rsvp: RSVPRecord): string {
  if (rsvp._id) return `server:${rsvp._id}`;

  const guest = rsvp.primaryGuest || {};
  return [
    guest.firstName || "",
    guest.lastName || "",
    rsvp.submittedAt || "",
    rsvp.invitationMode || "",
  ].join("|").toLowerCase();
}

function mergeServerAndLocalRsvps(serverRsvps: readonly RSVPRecord[], localRsvps: readonly RSVPRecord[]): RSVPRecord[] {
  const serverKeys = new Set(serverRsvps.map(getRsvpMergeKey));
  const localOnly = localRsvps.filter((rsvp) => !serverKeys.has(getRsvpMergeKey(rsvp)));
  return [...localOnly, ...serverRsvps];
}

function stripLocalOnlyFlag(rsvp: RSVPRecord): RSVPRecord {
  const cleanRsvp = { ...rsvp };
  delete cleanRsvp.localOnly;
  return cleanRsvp;
}

function getWeddingAttendance(rsvp: RSVPRecord): string {
  const weddingEvent = normalizeEventAttendance(rsvp).find((event) => event.id === WEDDING_EVENT_ID);
  return weddingEvent?.attending || rsvp.primaryGuest?.attending || "";
}

function getEventGuestCount(rsvp: RSVPRecord, eventId: string): number {
  const event = normalizeEventAttendance(rsvp).find((item) => item.id === eventId);
  return Number(event?.guestCount) || 0;
}

function getEventGuestNames(rsvp: RSVPRecord, event: RSVPEventAttendance): string[] {
  const primaryGuestName = event.primaryGuest?.name ||
    `${rsvp.primaryGuest?.firstName || ""} ${rsvp.primaryGuest?.lastName || ""}`.trim();
  const primary = event.attending === "yes" && primaryGuestName ? [primaryGuestName] : [];
  const additional = (event.guestResponses || [])
    .filter((guest) => guest.attending === "yes")
    .map((guest) => guest.name || `${guest.firstName || ""} ${guest.lastName || ""}`.trim())
    .filter(Boolean);

  return [...primary, ...additional];
}

function AdminAccessPrompt({
  status,
  code,
  error,
  submitting,
  onCodeChange,
  onSubmit,
}: {
  readonly status: string;
  readonly code: string;
  readonly error: string;
  readonly submitting: boolean;
  readonly onCodeChange: (value: string) => void;
  readonly onSubmit: (event: FormEvent<HTMLFormElement>) => void;
}) {
  return (
    <div className="min-h-screen bg-linen-soft px-4 py-12 text-ink">
      <section className="mx-auto mt-24 w-full max-w-sm rounded-xl border border-ink/10 bg-white p-6 text-center shadow-xl">
        <p className="mb-3 font-josefin text-xs uppercase tracking-[0.24em] text-ink/45">{WEDDING.couple.short}</p>
        <h1 className="mb-3 font-cormorant text-3xl italic text-ink">Admin Access</h1>
        <p className="mb-6 font-josefin text-sm text-ink/58">Enter the owner code to view RSVPs and visit logs.</p>

        {status === "checking" ? (
          <p className="font-josefin text-sm text-ink/58">Checking owner access...</p>
        ) : (
          <form onSubmit={onSubmit} className="space-y-3 text-left">
            <label className="form-label" htmlFor="owner-code">Owner Access</label>
            <input
              id="owner-code"
              type="password"
              className="form-input"
              value={code}
              onChange={(event) => onCodeChange(event.target.value)}
              placeholder="Enter owner code"
              autoComplete="current-password"
            />
            {error ? <p className="text-center font-josefin text-xs text-[#a14232]">{error}</p> : null}
            <button
              type="submit"
              disabled={submitting || !code.trim()}
              className={`w-full rounded-xl bg-olive px-5 py-3 font-josefin text-xs uppercase tracking-[0.22em] text-linen ${submitting || !code.trim() ? "cursor-not-allowed opacity-50" : ""}`}
            >
              {submitting ? "Checking..." : "Unlock Admin"}
            </button>
          </form>
        )}
      </section>
    </div>
  );
}

function EditModal({ rsvp, onSave, onClose }: { readonly rsvp: RSVPRecord; readonly onSave: (id: string, updates: Record<string, unknown>) => Promise<void>; readonly onClose: () => void }) {
  const primaryGuest = rsvp.primaryGuest || {};
  const normalizedEvents = normalizeEventAttendance(rsvp);
  const savedEventsById = new Map(normalizedEvents.map((event) => [event.id, event]));
  const editsFullInvite = rsvp.invitationMode === "full" || normalizedEvents.length > 1;
  const editableEvents = editsFullInvite ? FULL_EVENT_DETAILS : normalizedEvents.map((event) => FULL_EVENT_DETAILS.find((item) => item.id === event.id)).filter(Boolean) as readonly WeddingEvent[];
  const originalAdditionals = rsvp.additionalGuests || [];
  const createInitialEventResponses = () => (
    Object.fromEntries(editableEvents.map((event) => {
      const savedEvent = savedEventsById.get(event.id);
      const savedGuestResponses = Array.isArray(savedEvent?.guestResponses) ? savedEvent.guestResponses : [];
      const fallbackPrimary = event.id === WEDDING_EVENT_ID
        ? (savedEvent?.attending || primaryGuest.attending || "no")
        : (savedEvent?.attending || "no");

      return [event.id, {
        primary: fallbackPrimary,
        guests: originalAdditionals.map((_, index) => (
          savedGuestResponses[index]?.attending || (editsFullInvite ? "no" : fallbackPrimary)
        )),
      }];
    }))
  );
  const [form, setForm] = useState({
    firstName: primaryGuest.firstName || "",
    lastName: primaryGuest.lastName || "",
    attending: getWeddingAttendance(rsvp) || primaryGuest.attending || "yes",
    phone: primaryGuest.phone || "",
    email: primaryGuest.email || "",
    notes: primaryGuest.notes || "",
  });
  const [additionals, setAdditionals] = useState(originalAdditionals.map((guest) => ({ ...guest })));
  const [eventResponses, setEventResponses] = useState<Record<string, { primary: string; guests: string[] }>>(createInitialEventResponses);
  const [saving, setSaving] = useState(false);

  const updateAdditional = (index: number, field: "firstName" | "lastName", value: string) => {
    setAdditionals((current) => current.map((guest, currentIndex) => (
      currentIndex === index ? { ...guest, [field]: value } : guest
    )));
  };

  const addGuest = () => {
    setAdditionals((current) => [...current, { firstName: "", lastName: "" }]);
    setEventResponses((current) => (
      Object.fromEntries(Object.entries(current).map(([eventId, response]) => [
        eventId,
        { ...response, guests: [...(response.guests || []), "no"] },
      ]))
    ));
  };

  const removeGuest = (index: number) => {
    setAdditionals((current) => current.filter((_, currentIndex) => currentIndex !== index));
    setEventResponses((current) => (
      Object.fromEntries(Object.entries(current).map(([eventId, response]) => [
        eventId,
        { ...response, guests: (response.guests || []).filter((_, currentIndex) => currentIndex !== index) },
      ]))
    ));
  };

  const updateEventResponse = (eventId: string, guestIndex: number, value: string) => {
    if (guestIndex === -1 && eventId === WEDDING_EVENT_ID) {
      setForm((current) => ({ ...current, attending: value }));
    }

    setEventResponses((current) => {
      const existing = current[eventId] || { primary: "no", guests: additionals.map(() => "no") };

      if (guestIndex === -1) {
        return { ...current, [eventId]: { ...existing, primary: value } };
      }

      const guests = [...(existing.guests || [])];
      guests[guestIndex] = value;
      return { ...current, [eventId]: { ...existing, guests } };
    });
  };

  const guestDisplayName = (guest: RSVPGuestResponse, index: number) => (
    `${guest.firstName || ""} ${guest.lastName || ""}`.trim() || `Guest ${index + 1}`
  );

  const handleSave = async () => {
    setSaving(true);
    const filteredAdditionalEntries = additionals
      .map((guest, index) => ({ guest, index }))
      .filter(({ guest }) => guest.firstName.trim());
    const filteredAdditionals = filteredAdditionalEntries.map(({ guest }) => ({
      ...guest,
      firstName: guest.firstName.trim(),
      lastName: (guest.lastName || "").trim(),
    }));
    const eventAttendance = editableEvents.map((event) => {
      const savedEvent = savedEventsById.get(event.id);
      const response = eventResponses[event.id]?.primary || "no";
      const savedGuestResponses = Array.isArray(savedEvent?.guestResponses) ? savedEvent.guestResponses : [];
      const guestResponses = filteredAdditionalEntries.map(({ guest, index }) => {
        const existing = savedGuestResponses[index] || {};
        const firstName = guest.firstName.trim();
        const lastName = (guest.lastName || "").trim();
        return {
          ...existing,
          firstName,
          lastName,
          name: `${firstName} ${lastName}`.trim(),
          attending: eventResponses[event.id]?.guests?.[index] || "no",
        };
      });

      return {
        ...savedEvent,
        id: event.id,
        name: event.name,
        dateLabel: event.dateLabel,
        timeLabel: event.timeLabel,
        venue: event.venue,
        attending: response,
        primaryGuest: {
          firstName: form.firstName.trim(),
          lastName: form.lastName.trim(),
          name: `${form.firstName.trim()} ${form.lastName.trim()}`.trim(),
          attending: response,
        },
        guestResponses,
        guestCount: (response === "yes" ? 1 : 0) +
          guestResponses.filter((guest) => guest.attending === "yes").length,
      };
    });
    const updated = {
      primaryGuest: {
        ...primaryGuest,
        ...form,
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        attending: eventResponses[WEDDING_EVENT_ID]?.primary || form.attending,
      },
      additionalGuests: filteredAdditionals,
      eventAttendance,
    };
    await onSave(getRsvpId(rsvp), updated);
    setSaving(false);
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/45 p-4 backdrop-blur-sm">
      <div className="max-h-[90vh] w-full max-w-5xl overflow-y-auto rounded-2xl bg-white text-ink shadow-2xl">
        <div className="flex items-center justify-between border-b border-ink/10 px-6 py-4">
          <h2 className="font-cormorant text-2xl italic text-ink">Edit RSVP</h2>
          <button type="button" onClick={onClose} className="text-ink/50 transition hover:text-ink" aria-label="Close edit modal">
            <XCircle className="h-6 w-6" />
          </button>
        </div>

        <div className="space-y-5 px-6 py-5">
          <div>
            <p className="mb-3 font-josefin text-xs uppercase tracking-[0.22em] text-ink/45">Primary Guest</p>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="form-label">First Name</label>
                <input className="form-input" value={form.firstName} onChange={(event) => setForm((current) => ({ ...current, firstName: event.target.value }))} />
              </div>
              <div>
                <label className="form-label">Last Name</label>
                <input className="form-input" value={form.lastName} onChange={(event) => setForm((current) => ({ ...current, lastName: event.target.value }))} />
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <p className="font-josefin text-xs uppercase tracking-[0.22em] text-ink/45">Contact</p>
            <input className="form-input" type="tel" value={form.phone} onChange={(event) => setForm((current) => ({ ...current, phone: event.target.value }))} placeholder="Phone" />
            <input className="form-input" type="email" value={form.email} onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))} placeholder="Email" />
            <textarea className="form-input min-h-20 resize-none" value={form.notes} onChange={(event) => setForm((current) => ({ ...current, notes: event.target.value }))} placeholder="Optional note" />
          </div>

          <div>
            <div className="mb-3 flex items-center justify-between">
              <p className="font-josefin text-xs uppercase tracking-[0.22em] text-ink/45">Additional Guests</p>
              <button type="button" onClick={addGuest} className="inline-flex items-center gap-1 rounded border border-ink/15 px-2 py-1 font-josefin text-xs text-ink/70 transition hover:border-olive">
                <Plus className="h-3 w-3" />
                Add Guest
              </button>
            </div>
            {additionals.length === 0 ? <p className="font-josefin text-xs italic text-ink/35">No additional guests</p> : null}
            {additionals.map((guest, index) => (
              <div key={index} className="mb-2 grid grid-cols-2 gap-2">
                <input className="form-input text-sm" placeholder="First name" value={guest.firstName} onChange={(event) => updateAdditional(index, "firstName", event.target.value)} />
                <div className="flex gap-2">
                  <input className="form-input flex-1 text-sm" placeholder="Last name" value={guest.lastName || ""} onChange={(event) => updateAdditional(index, "lastName", event.target.value)} />
                  <button type="button" onClick={() => removeGuest(index)} className="flex-shrink-0 text-[#a14232] transition hover:text-[#7f2d25]" aria-label={`Remove ${guestDisplayName(guest, index)}`}>
                    <Minus className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div>
            <p className="mb-3 font-josefin text-xs uppercase tracking-[0.22em] text-ink/45">Event RSVPs</p>
            <div className="overflow-x-auto rounded-lg border border-ink/10">
              <table className="w-full min-w-[720px] text-sm">
                <thead>
                  <tr className="bg-linen-soft">
                    <th className="px-3 py-2 text-left font-josefin text-xs uppercase tracking-[0.18em] text-ink/45">Guest</th>
                    {editableEvents.map((event) => (
                      <th key={event.id} className="px-3 py-2 text-left font-josefin text-xs uppercase tracking-[0.18em] text-ink/45">
                        {event.shortName || event.name}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-t border-ink/10">
                    <td className="px-3 py-2 font-josefin text-ink">
                      {[form.firstName, form.lastName].filter(Boolean).join(" ") || "Primary guest"}
                    </td>
                    {editableEvents.map((event) => (
                      <td key={event.id} className="px-3 py-2">
                        <select className="form-input min-w-[118px] py-1.5 text-xs" value={eventResponses[event.id]?.primary || "no"} onChange={(changeEvent) => updateEventResponse(event.id, -1, changeEvent.target.value)}>
                          <option value="yes">Attending</option>
                          <option value="no">Not attending</option>
                        </select>
                      </td>
                    ))}
                  </tr>
                  {additionals.map((guest, guestIndex) => (
                    <tr key={guestIndex} className="border-t border-ink/10">
                      <td className="px-3 py-2 font-josefin text-ink">{guestDisplayName(guest, guestIndex)}</td>
                      {editableEvents.map((event) => (
                        <td key={event.id} className="px-3 py-2">
                          <select className="form-input min-w-[118px] py-1.5 text-xs" value={eventResponses[event.id]?.guests?.[guestIndex] || "no"} onChange={(changeEvent) => updateEventResponse(event.id, guestIndex, changeEvent.target.value)}>
                            <option value="yes">Attending</option>
                            <option value="no">Not attending</option>
                          </select>
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="flex gap-3 border-t border-ink/10 px-6 py-4">
          <button type="button" onClick={onClose} className="flex-1 rounded-xl border border-ink/15 px-5 py-2.5 font-josefin text-xs uppercase tracking-[0.2em] text-ink">
            Cancel
          </button>
          <button
            type="button"
            onClick={() => void handleSave()}
            disabled={saving || !form.firstName.trim() || !form.lastName.trim()}
            className={`flex flex-1 items-center justify-center gap-2 rounded-xl bg-olive px-5 py-2.5 font-josefin text-xs uppercase tracking-[0.2em] text-linen ${saving || !form.firstName.trim() ? "cursor-not-allowed opacity-50" : ""}`}
          >
            {saving ? "Saving..." : <><Save className="h-4 w-4" /> Save Changes</>}
          </button>
        </div>
      </div>
    </div>
  );
}

function GuestRow({ rsvp, onDelete, onEdit }: { readonly rsvp: RSVPRecord; readonly onDelete: (id: string) => void; readonly onEdit: (rsvp: RSVPRecord) => void }) {
  const [open, setOpen] = useState(false);
  const guest = rsvp.primaryGuest || {};
  const extras = rsvp.additionalGuests || [];
  const eventAttendance = normalizeEventAttendance(rsvp);
  const attending = getWeddingAttendance(rsvp) === "yes";
  const invitationLabel = formatInvitationMode(rsvp.invitationMode);

  return (
    <>
      <tr className="cursor-pointer border-b border-ink/10 transition hover:bg-linen-soft/70" onClick={() => setOpen((current) => !current)}>
        <td className="whitespace-nowrap px-4 py-3 font-josefin text-sm font-semibold text-ink">
          <span className="inline-flex items-center gap-2">
            {guest.firstName} {guest.lastName}
            {rsvp.localOnly ? <span className="rounded-full bg-[#fbf2de] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#75572f]">Local</span> : null}
          </span>
        </td>
        <td className="px-4 py-3">
          <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ${attending ? "bg-olive/15 text-olive" : "bg-[#fff0ed] text-[#8b372f]"}`}>
            {attending ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}
            {attending ? "Attending" : "Not Attending"}
          </span>
        </td>
        <td className="hidden px-4 py-3 font-josefin text-sm text-ink/55 md:table-cell">{extras.length > 0 ? `+${extras.length} guest${extras.length > 1 ? "s" : ""}` : "-"}</td>
        <td className="hidden px-4 py-3 font-josefin text-xs text-ink/55 lg:table-cell">{invitationLabel}</td>
        <td className="hidden px-4 py-3 font-josefin text-xs text-ink/45 xl:table-cell">
          {rsvp.submittedAt ? new Date(rsvp.submittedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "-"}
        </td>
        <td className="px-4 py-3 text-right text-ink/45">{open ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}</td>
      </tr>

      {open ? (
        <tr className="bg-linen-soft/80">
          <td colSpan={6} className="px-6 py-4">
            <div className="grid grid-cols-1 gap-4 text-sm sm:grid-cols-2 md:grid-cols-3">
              <div className="space-y-1">
                <p className="mb-2 font-josefin text-xs uppercase tracking-[0.2em] text-ink/45">Contact</p>
                {guest.email ? <p className="flex items-center gap-2 text-ink/70"><Mail className="h-3.5 w-3.5 text-ink/35" /><a href={`mailto:${guest.email}`} className="hover:underline">{guest.email}</a></p> : null}
                {guest.phone ? <p className="flex items-center gap-2 text-ink/70"><Phone className="h-3.5 w-3.5 text-ink/35" />{guest.phone}</p> : null}
                {!guest.email && !guest.phone ? <p className="text-ink/35 italic">No contact info</p> : null}
              </div>
              <div className="space-y-1">
                <p className="mb-2 font-josefin text-xs uppercase tracking-[0.2em] text-ink/45">Notes</p>
                {guest.notes ? <p className="flex items-start gap-2 text-ink/70"><MessageSquare className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-ink/35" />{guest.notes}</p> : <p className="text-ink/35 italic">None</p>}
              </div>
              {extras.length > 0 ? (
                <div className="space-y-1">
                  <p className="mb-2 font-josefin text-xs uppercase tracking-[0.2em] text-ink/45">Additional Guests</p>
                  {extras.map((extra, index) => <p key={index} className="text-ink/70">{extra.firstName} {extra.lastName}</p>)}
                </div>
              ) : null}
            </div>

            <div className="mt-5">
              <p className="mb-3 font-josefin text-xs uppercase tracking-[0.2em] text-ink/45">Event RSVPs</p>
              <div className="grid gap-3 md:grid-cols-2">
                {eventAttendance.map((event) => {
                  const guestNames = getEventGuestNames(rsvp, event);
                  const guestCount = Number(event.guestCount) || guestNames.length;
                  return (
                    <div key={event.id} className="rounded-lg border border-ink/10 bg-white p-3">
                      <span className="block font-josefin text-xs uppercase tracking-[0.16em] text-ink/45">{event.name}</span>
                      <strong className={guestCount > 0 ? "text-olive" : "text-[#8b372f]"}>{guestCount} attending</strong>
                      {guestNames.length > 0 ? <em className="mt-1 block font-josefin text-xs not-italic text-ink/55">{guestNames.join(", ")}</em> : null}
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="mt-4 flex items-center justify-end gap-2">
              <button type="button" onClick={(event) => { event.stopPropagation(); onEdit(rsvp); }} disabled={rsvp.localOnly} className="inline-flex items-center gap-1.5 rounded border border-ink/15 px-3 py-1.5 font-josefin text-xs text-ink/65 transition hover:border-olive disabled:cursor-not-allowed disabled:opacity-40">
                <Pencil className="h-3.5 w-3.5" /> Edit entry
              </button>
              <button type="button" onClick={(event) => { event.stopPropagation(); onDelete(getRsvpId(rsvp)); }} className="inline-flex items-center gap-1.5 rounded border border-[#d7aaa4] px-3 py-1.5 font-josefin text-xs text-[#8b372f] transition hover:border-[#8b372f]">
                <Trash2 className="h-3.5 w-3.5" /> Delete entry
              </button>
            </div>
          </td>
        </tr>
      ) : null}
    </>
  );
}

function exportCSV(rsvps: readonly RSVPRecord[]) {
  const rows = [
    ["First Name", "Last Name", "Wedding Attendance", "Invitation Type", "Event RSVPs", "Email", "Phone", "Additional Guests", "Notes", "Submitted"],
  ];
  rsvps.forEach((rsvp) => {
    const guest = rsvp.primaryGuest || {};
    const extras = (rsvp.additionalGuests || []).map((extra) => `${extra.firstName} ${extra.lastName || ""}`.trim()).join("; ");
    const eventSummary = normalizeEventAttendance(rsvp)
      .map((event) => `${event.name}: ${Number(event.guestCount) || 0} attending`)
      .join("; ");
    rows.push([
      guest.firstName || "",
      guest.lastName || "",
      getWeddingAttendance(rsvp) === "yes" ? "Yes" : "No",
      formatInvitationMode(rsvp.invitationMode),
      eventSummary,
      guest.email || "",
      guest.phone || "",
      extras,
      guest.notes || "",
      rsvp.submittedAt ? new Date(rsvp.submittedAt).toLocaleDateString() : "",
    ]);
  });
  const csv = rows.map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = `mr-wedding-rsvps-${new Date().toISOString().slice(0, 10)}.csv`;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  URL.revokeObjectURL(url);
}

export function AdminClient() {
  const [accessStatus, setAccessStatus] = useState("checking");
  const [accessCode, setAccessCode] = useState("");
  const [accessError, setAccessError] = useState("");
  const [accessSubmitting, setAccessSubmitting] = useState(false);
  const [rsvps, setRsvps] = useState<readonly RSVPRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [rsvpNotice, setRsvpNotice] = useState("");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [sortBy, setSortBy] = useState("date_desc");
  const [editingRsvp, setEditingRsvp] = useState<RSVPRecord | null>(null);
  const [analytics, setAnalytics] = useState({ totalPageViews: 0, uniqueVisitors: 0 });
  const [analyticsError, setAnalyticsError] = useState("");
  const [visitors, setVisitors] = useState<readonly VisitorLog[]>([]);
  const [visitorError, setVisitorError] = useState("");
  const [activeTab, setActiveTab] = useState<"rsvp" | "visitors">("rsvp");
  const [timeFilter, setTimeFilter] = useState("all");
  const [visitorIpInput, setVisitorIpInput] = useState("");
  const [visitorLocationInput, setVisitorLocationInput] = useState("");
  const [visitorIpFilter, setVisitorIpFilter] = useState("");
  const [visitorLocationFilter, setVisitorLocationFilter] = useState("");
  const [expandedVisits, setExpandedVisits] = useState<Record<string, boolean>>({});
  const [visitorPage, setVisitorPage] = useState(1);
  const [visitorPagination, setVisitorPagination] = useState<VisitorPagination>({
    page: 1,
    pageSize: VISITOR_PAGE_SIZE,
    totalVisitors: 0,
    totalPages: 1,
  });

  useEffect(() => {
    let cancelled = false;
    fetch("/api/access", { credentials: "same-origin" })
      .then((response) => response.ok ? response.json() : { authenticated: false })
      .then((data: { authenticated?: boolean }) => {
        if (!cancelled) setAccessStatus(data.authenticated ? "unlocked" : "locked");
      })
      .catch(() => {
        if (!cancelled) setAccessStatus("locked");
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const handleAccessSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setAccessSubmitting(true);
    setAccessError("");

    try {
      const response = await fetch("/api/access", {
        method: "POST",
        credentials: "same-origin",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: accessCode }),
      });

      if (!response.ok) {
        setAccessError("Invalid owner code.");
        return;
      }

      setAccessStatus("unlocked");
      setAccessCode("");
    } catch {
      setAccessError("Unable to verify access. Please try again.");
    } finally {
      setAccessSubmitting(false);
    }
  };

  const fetchRsvps = useCallback(async () => {
    setLoading(true);
    setError("");
    setRsvpNotice("");
    try {
      const response = await fetch("/api/guests", { credentials: "same-origin" });
      if (!response.ok) {
        const data = await response.json().catch(() => ({})) as { error?: string };
        throw new Error(data.error || "Unable to load RSVPs from the server.");
      }
      const data = await response.json() as { rsvps?: RSVPRecord[] };
      const serverRsvps = data.rsvps || [];
      const localRsvps = getLocalRsvps();
      const mergedRsvps = mergeServerAndLocalRsvps(serverRsvps, localRsvps);
      const localOnlyCount = mergedRsvps.filter((rsvp) => rsvp.localOnly).length;

      setRsvps(mergedRsvps);
      if (localOnlyCount > 0) {
        setRsvpNotice(`${localOnlyCount} RSVP ${localOnlyCount === 1 ? "is" : "are"} only saved in this browser.`);
      }
    } catch (caught) {
      const localRsvps = getLocalRsvps();
      setRsvps(localRsvps);
      if (localRsvps.length > 0) {
        setRsvpNotice("Unable to load server RSVPs. Showing only local backup RSVPs saved in this browser.");
      } else {
        setError(caught instanceof Error ? caught.message : "Unable to load RSVPs from the server.");
      }
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchAnalytics = useCallback(async () => {
    setAnalyticsError("");
    try {
      const query = timeFilter === "all" ? "" : `?timeFilter=${encodeURIComponent(timeFilter)}`;
      const response = await fetch(`/api/analytics${query}`, { credentials: "same-origin" });
      if (!response.ok) {
        const data = await response.json().catch(() => ({})) as { error?: string };
        throw new Error(data.error || "Unable to load analytics summary.");
      }
      const data = await response.json() as { totalPageViews?: number; uniqueVisitors?: number };
      setAnalytics({
        totalPageViews: data.totalPageViews || 0,
        uniqueVisitors: data.uniqueVisitors || 0,
      });
    } catch (caught) {
      setAnalyticsError(caught instanceof Error ? caught.message : "Unable to load analytics summary.");
    }
  }, [timeFilter]);

  const fetchVisitors = useCallback(async () => {
    setVisitorError("");
    try {
      const params = new URLSearchParams({
        details: "true",
        page: String(visitorPage),
        pageSize: String(VISITOR_PAGE_SIZE),
      });
      if (timeFilter !== "all") params.set("timeFilter", timeFilter);
      if (visitorIpFilter) params.set("ip", visitorIpFilter);
      if (visitorLocationFilter) params.set("location", visitorLocationFilter);

      const response = await fetch(`/api/analytics?${params.toString()}`, { credentials: "same-origin" });
      if (!response.ok) {
        const data = await response.json().catch(() => ({})) as { error?: string };
        throw new Error(data.error || "Unable to load visitor logs.");
      }
      const data = await response.json() as { visitors?: VisitorLog[]; pagination?: VisitorPagination };
      setVisitors(data.visitors || []);
      setVisitorPagination(data.pagination || {
        page: 1,
        pageSize: VISITOR_PAGE_SIZE,
        totalVisitors: data.visitors?.length || 0,
        totalPages: 1,
      });
      if (data.pagination?.page && data.pagination.page !== visitorPage) {
        setVisitorPage(data.pagination.page);
      }
    } catch (caught) {
      setVisitorError(caught instanceof Error ? caught.message : "Unable to load visitor logs.");
      setVisitors([]);
    }
  }, [timeFilter, visitorPage, visitorIpFilter, visitorLocationFilter]);

  useEffect(() => {
    if (accessStatus !== "unlocked") return;
    const timer = window.setTimeout(() => void fetchRsvps(), 0);
    return () => window.clearTimeout(timer);
  }, [accessStatus, fetchRsvps]);

  useEffect(() => {
    if (accessStatus !== "unlocked") return;
    const timer = window.setTimeout(() => void fetchAnalytics(), 0);
    return () => window.clearTimeout(timer);
  }, [accessStatus, fetchAnalytics]);

  useEffect(() => {
    if (accessStatus !== "unlocked") return;
    const timer = window.setTimeout(() => void fetchVisitors(), 0);
    return () => window.clearTimeout(timer);
  }, [accessStatus, fetchVisitors]);

  const handleDelete = async (id: string) => {
    if (!window.confirm("Delete this RSVP entry?")) return;
    const target = rsvps.find((rsvp) => getRsvpId(rsvp) === id);

    if (target?.localOnly) {
      const remainingLocal = getLocalRsvps().filter((rsvp) => rsvp.id !== id);
      localStorage.setItem("rsvps", JSON.stringify(remainingLocal.map(stripLocalOnlyFlag)));
      setRsvps((current) => current.filter((rsvp) => getRsvpId(rsvp) !== id));
      setRsvpNotice(remainingLocal.length > 0 ? `${remainingLocal.length} local backup RSVP${remainingLocal.length === 1 ? "" : "s"} remain in this browser.` : "");
      return;
    }

    try {
      const response = await fetch(`/api/guests?id=${encodeURIComponent(id)}`, {
        method: "DELETE",
        credentials: "same-origin",
      });
      if (!response.ok) throw new Error("Delete failed");
      setRsvps((current) => current.filter((rsvp) => getRsvpId(rsvp) !== id));
    } catch {
      alert("Failed to delete entry. Please try again.");
    }
  };

  const handleSave = async (id: string, updatedData: Record<string, unknown>) => {
    try {
      const response = await fetch(`/api/guests?id=${encodeURIComponent(id)}`, {
        method: "PATCH",
        credentials: "same-origin",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedData),
      });
      if (!response.ok) throw new Error("Save failed");
    } catch {
      alert("Failed to save changes. Please try again.");
      return;
    }
    setRsvps((current) => current.map((rsvp) => (
      getRsvpId(rsvp) === id ? { ...rsvp, ...updatedData } : rsvp
    )));
    setEditingRsvp(null);
  };

  const totalPrimary = rsvps.length;
  const attending = rsvps.filter((rsvp) => getWeddingAttendance(rsvp) === "yes");
  const declined = rsvps.filter((rsvp) => getWeddingAttendance(rsvp) === "no");
  const eventStats = FULL_EVENT_DETAILS.map((event) => ({
    ...event,
    guestCount: rsvps.reduce((acc, rsvp) => acc + getEventGuestCount(rsvp, event.id), 0),
  }));

  const filtered = rsvps
    .filter((rsvp) => {
      const guest = rsvp.primaryGuest;
      if (!guest) return false;
      if (filter === "attending") return getWeddingAttendance(rsvp) === "yes";
      if (filter === "declined") return getWeddingAttendance(rsvp) === "no";
      return true;
    })
    .filter((rsvp) => {
      if (!search) return true;
      const query = search.toLowerCase();
      const guest = rsvp.primaryGuest || {};
      const eventText = normalizeEventAttendance(rsvp)
        .map((event) => `${event.name} ${getAttendanceText(event.attending)}`)
        .join(" ")
        .toLowerCase();
      return (
        `${guest.firstName} ${guest.lastName}`.toLowerCase().includes(query) ||
        (guest.email || "").toLowerCase().includes(query) ||
        (guest.phone || "").includes(query) ||
        formatInvitationMode(rsvp.invitationMode).toLowerCase().includes(query) ||
        eventText.includes(query)
      );
    })
    .sort((a, b) => {
      if (sortBy === "date_desc") return new Date(b.submittedAt || 0).getTime() - new Date(a.submittedAt || 0).getTime();
      if (sortBy === "date_asc") return new Date(a.submittedAt || 0).getTime() - new Date(b.submittedAt || 0).getTime();
      if (sortBy === "name_asc") return (a.primaryGuest?.lastName || "").localeCompare(b.primaryGuest?.lastName || "");
      if (sortBy === "name_desc") return (b.primaryGuest?.lastName || "").localeCompare(a.primaryGuest?.lastName || "");
      return 0;
    });

  const toggleVisitExpanded = (id: string) => {
    setExpandedVisits((current) => ({ ...current, [id]: !current[id] }));
  };
  const applyVisitorFilters = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setVisitorIpFilter(visitorIpInput.trim());
    setVisitorLocationFilter(visitorLocationInput.trim());
    setVisitorPage(1);
    setExpandedVisits({});
  };
  const clearVisitorFilters = () => {
    setVisitorIpInput("");
    setVisitorLocationInput("");
    setVisitorIpFilter("");
    setVisitorLocationFilter("");
    setVisitorPage(1);
    setExpandedVisits({});
  };
  const hasVisitorFilters = Boolean(visitorIpFilter || visitorLocationFilter);

  if (accessStatus !== "unlocked") {
    return (
      <AdminAccessPrompt
        status={accessStatus}
        code={accessCode}
        error={accessError}
        submitting={accessSubmitting}
        onCodeChange={setAccessCode}
        onSubmit={handleAccessSubmit}
      />
    );
  }

  return (
    <div className="min-h-screen bg-linen-soft text-ink">
      {editingRsvp ? <EditModal rsvp={editingRsvp} onSave={handleSave} onClose={() => setEditingRsvp(null)} /> : null}

      <div className="mx-auto max-w-6xl px-4 py-6 md:py-8">
        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="font-cormorant text-3xl italic text-ink md:text-4xl">Admin Dashboard</h1>
            <p className="mt-1 font-josefin text-sm text-ink/45">{WEDDING.couple.short} - Wedding · September 5, 2026</p>
          </div>
          <div className="flex items-center gap-3">
            <button type="button" onClick={() => { void fetchRsvps(); void fetchAnalytics(); void fetchVisitors(); }} className="inline-flex items-center gap-1.5 rounded-xl border border-ink/15 px-4 py-2 font-josefin text-xs uppercase tracking-[0.16em] text-ink">
              <RefreshCw className="h-3.5 w-3.5" /> Refresh
            </button>
            <button type="button" onClick={() => exportCSV(rsvps)} disabled={rsvps.length === 0} className="inline-flex items-center gap-1.5 rounded-xl bg-olive px-4 py-2 font-josefin text-xs uppercase tracking-[0.16em] text-linen disabled:opacity-40">
              <Download className="h-3.5 w-3.5" /> Export CSV
            </button>
          </div>
        </div>

        <div className="mb-8 flex w-fit overflow-hidden rounded-lg border border-ink/15">
          <button type="button" onClick={() => setActiveTab("rsvp")} className={`px-6 py-3 font-josefin text-sm font-medium transition ${activeTab === "rsvp" ? "bg-olive text-linen" : "bg-white text-ink/70 hover:bg-linen-soft"}`}>
            RSVPs ({totalPrimary})
          </button>
          <button type="button" onClick={() => setActiveTab("visitors")} className={`px-6 py-3 font-josefin text-sm font-medium transition ${activeTab === "visitors" ? "bg-olive text-linen" : "bg-white text-ink/70 hover:bg-linen-soft"}`}>
            Visit Logs ({visitorPagination.totalVisitors})
          </button>
        </div>

        {activeTab === "visitors" ? (
          <form onSubmit={applyVisitorFilters} className="mb-6 grid grid-cols-1 items-end gap-3 sm:grid-cols-2 lg:grid-cols-[180px_1fr_1fr_auto]">
            <div>
              <label className="form-label" htmlFor="visitor-time-filter">Time range</label>
              <select id="visitor-time-filter" value={timeFilter} onChange={(event) => { setTimeFilter(event.target.value); setVisitorPage(1); setExpandedVisits({}); }} className="form-input py-2 text-sm">
                <option value="15m">Past 15 minutes</option>
                <option value="30m">Past 30 minutes</option>
                <option value="1h">Past 1 hour</option>
                <option value="6h">Past 6 hours</option>
                <option value="1d">Past 1 day</option>
                <option value="all">All time</option>
              </select>
            </div>
            <div>
              <label className="form-label" htmlFor="visitor-ip-filter">IP address</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/30" />
                <input id="visitor-ip-filter" type="search" value={visitorIpInput} onChange={(event) => setVisitorIpInput(event.target.value)} className="form-input py-2 pl-9 text-sm" placeholder="e.g. 24.27.98" />
              </div>
            </div>
            <div>
              <label className="form-label" htmlFor="visitor-location-filter">Location</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/30" />
                <input id="visitor-location-filter" type="search" value={visitorLocationInput} onChange={(event) => setVisitorLocationInput(event.target.value)} className="form-input py-2 pl-9 text-sm" placeholder="City, state, or country" />
              </div>
            </div>
            <div className="flex gap-2 sm:col-span-2 lg:col-span-1">
              <button type="submit" className="flex-1 rounded-xl bg-olive px-4 py-2.5 font-josefin text-xs uppercase tracking-[0.18em] text-linen lg:flex-none">Apply</button>
              <button type="button" onClick={clearVisitorFilters} disabled={!hasVisitorFilters && !visitorIpInput && !visitorLocationInput} className="flex-1 rounded-xl border border-ink/15 px-4 py-2.5 font-josefin text-xs uppercase tracking-[0.18em] text-ink disabled:cursor-not-allowed disabled:opacity-40 lg:flex-none">Clear</button>
            </div>
          </form>
        ) : null}

        {activeTab === "rsvp" ? (
          <div>
            {rsvpNotice ? <Notice tone="gold">{rsvpNotice}</Notice> : null}
            <div className="mb-8 grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-6">
              {eventStats.map((event, index) => (
                <StatCard key={event.id} label={event.shortName} value={event.guestCount} color={event.id === WEDDING_EVENT_ID ? "olive" : index % 2 === 0 ? "linen" : "gold"} sub="guests attending" />
              ))}
            </div>

            <div className="overflow-hidden rounded-xl border border-ink/10 bg-white">
              <div className="flex flex-col gap-3 border-b border-ink/10 p-4 sm:flex-row">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/30" />
                  <input className="form-input py-2 pl-9 text-sm" placeholder="Search by name, email, or phone..." value={search} onChange={(event) => setSearch(event.target.value)} />
                </div>
                <div className="flex overflow-hidden rounded-lg border border-ink/15">
                  {[
                    { val: "all", label: `All (${totalPrimary})` },
                    { val: "attending", label: `Going (${attending.length})` },
                    { val: "declined", label: `No (${declined.length})` },
                  ].map(({ val, label }) => (
                    <button key={val} type="button" onClick={() => setFilter(val)} className={`px-3 py-2 font-josefin text-xs transition ${filter === val ? "bg-olive text-linen" : "text-ink/65 hover:bg-linen-soft"}`}>{label}</button>
                  ))}
                </div>
                <select value={sortBy} onChange={(event) => setSortBy(event.target.value)} className="form-input w-auto py-2 text-xs">
                  <option value="date_desc">Newest first</option>
                  <option value="date_asc">Oldest first</option>
                  <option value="name_asc">Name A-Z</option>
                  <option value="name_desc">Name Z-A</option>
                </select>
              </div>

              {loading ? (
                <EmptyState label="Loading RSVPs..." icon={<RefreshCw className="h-10 w-10 animate-spin text-ink/20" />} />
              ) : error ? (
                <EmptyState label={error} icon={<XCircle className="h-10 w-10 text-[#8b372f]" />} />
              ) : filtered.length === 0 ? (
                <EmptyState label={search || filter !== "all" ? "No results match your filters." : "No RSVPs received yet."} icon={<Users className="h-10 w-10 text-ink/20" />} />
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[680px]">
                    <thead>
                      <tr className="border-b border-ink/10 bg-linen-soft">
                        <th className="px-4 py-3 text-left font-josefin text-xs uppercase tracking-[0.2em] text-ink/45">Name</th>
                        <th className="px-4 py-3 text-left font-josefin text-xs uppercase tracking-[0.2em] text-ink/45">Status</th>
                        <th className="hidden px-4 py-3 text-left font-josefin text-xs uppercase tracking-[0.2em] text-ink/45 md:table-cell">+Guests</th>
                        <th className="hidden px-4 py-3 text-left font-josefin text-xs uppercase tracking-[0.2em] text-ink/45 lg:table-cell">Invite</th>
                        <th className="hidden px-4 py-3 text-left font-josefin text-xs uppercase tracking-[0.2em] text-ink/45 xl:table-cell">Submitted</th>
                        <th className="px-4 py-3" />
                      </tr>
                    </thead>
                    <tbody>
                      {filtered.map((rsvp, index) => (
                        <GuestRow key={getRsvpId(rsvp) || index} rsvp={rsvp} onDelete={handleDelete} onEdit={setEditingRsvp} />
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {!loading && filtered.length > 0 ? (
                <div className="border-t border-ink/10 bg-linen-soft/60 px-4 py-3">
                  <p className="font-josefin text-xs text-ink/45">Showing {filtered.length} of {totalPrimary} RSVP{totalPrimary !== 1 ? "s" : ""}</p>
                </div>
              ) : null}
            </div>
          </div>
        ) : null}

        {activeTab === "visitors" ? (
          <div>
            <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <StatCard label="Website Visits" value={analytics.totalPageViews} color="linen" />
              <StatCard label="Unique Visitors" value={analytics.uniqueVisitors} color="olive" />
            </div>

            {analyticsError || visitorError ? <Notice tone="red">{visitorError || analyticsError}</Notice> : null}

            <div className="overflow-hidden rounded-xl border border-ink/10 bg-white">
              {visitors.length === 0 ? (
                <EmptyState label={hasVisitorFilters ? "No visit logs match these filters." : timeFilter === "all" ? "No visit logs yet." : "No visit logs in this time range."} icon={<Eye className="h-10 w-10 text-ink/20" />} />
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[980px]">
                    <thead>
                      <tr className="border-b border-ink/10 bg-linen-soft">
                        <th className="w-12 px-4 py-3" />
                        <th className="px-4 py-3 text-left font-josefin text-xs uppercase tracking-[0.2em] text-ink/45">Visit Time</th>
                        <th className="px-4 py-3 text-left font-josefin text-xs uppercase tracking-[0.2em] text-ink/45">IP Address</th>
                        <th className="px-4 py-3 text-left font-josefin text-xs uppercase tracking-[0.2em] text-ink/45">Location</th>
                        <th className="px-4 py-3 text-left font-josefin text-xs uppercase tracking-[0.2em] text-ink/45">Device</th>
                        <th className="px-4 py-3 text-left font-josefin text-xs uppercase tracking-[0.2em] text-ink/45">Time Spent</th>
                      </tr>
                    </thead>
                    <tbody>
                      {visitors.map((visitor, index) => {
                        const rowId = visitor.id || `${visitor.sessionId}-${visitor.visitedAt}-${index}`;
                        const expanded = Boolean(expandedVisits[rowId]);
                        return (
                          <Fragment key={rowId}>
                            <tr className="border-b border-ink/10 transition hover:bg-linen-soft/70">
                              <td className="px-4 py-3">
                                <button type="button" onClick={() => toggleVisitExpanded(rowId)} className="flex h-7 w-7 items-center justify-center rounded-full border border-ink/15 text-ink/55 transition hover:bg-linen-soft" aria-label={expanded ? "Hide visit actions" : "Show visit actions"}>
                                  {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                                </button>
                              </td>
                              <td className="px-4 py-3 font-josefin text-sm text-ink/70">{visitor.visitedAt ? new Date(visitor.visitedAt).toLocaleString() : "-"}</td>
                              <td className="px-4 py-3 font-josefin text-sm text-ink/62">{visitor.ipAddress || "Unknown"}</td>
                              <td className="px-4 py-3 font-josefin text-sm text-ink/62">{visitor.location ? <span className="inline-flex items-center gap-1.5"><MapPin className="h-3 w-3 text-ink/35" />{visitor.location}</span> : <span className="italic text-ink/30">Unknown</span>}</td>
                              <td className="px-4 py-3 font-josefin text-sm text-ink/62">{visitor.deviceInfo ? <span className="inline-flex items-center gap-1.5"><Smartphone className="h-3 w-3 text-ink/35" />{visitor.deviceInfo}</span> : <span className="italic text-ink/30">Unknown</span>}</td>
                              <td className="px-4 py-3 font-josefin text-sm text-ink/62">{formatDuration(visitor.durationSeconds)}</td>
                            </tr>
                            {expanded ? (
                              <tr className="border-b border-ink/10 bg-linen-soft/60">
                                <td colSpan={6} className="px-6 py-4">
                                  <div className="font-josefin text-sm text-ink/62">
                                    <div className="mb-3 flex flex-wrap items-center gap-x-5 gap-y-1">
                                      <span className="font-semibold text-ink">Time spent: {formatDuration(visitor.durationSeconds)}</span>
                                      {visitor.pagePath ? <span>Page: {visitor.pagePath}</span> : null}
                                      {visitor.metadata?.invitationLabel ? <span>Invite: {visitor.metadata.invitationLabel}</span> : null}
                                    </div>
                                    {visitor.actions?.length ? (
                                      <ul className="space-y-2">
                                        {visitor.actions.map((action) => (
                                          <li key={action.id} className="flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-3">
                                            <span className="font-mono text-xs text-ink/35 sm:w-28">{action.timestamp ? new Date(action.timestamp).toLocaleTimeString() : "-"}</span>
                                            <span className="text-ink/70">{formatActionName(action)}</span>
                                          </li>
                                        ))}
                                      </ul>
                                    ) : <p className="italic text-ink/35">No actions logged for this visit.</p>}
                                  </div>
                                </td>
                              </tr>
                            ) : null}
                          </Fragment>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}

              {visitors.length > 0 ? (
                <div className="flex flex-col gap-3 border-t border-ink/10 bg-linen-soft/60 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
                  <p className="font-josefin text-xs text-ink/45">
                    Showing {((visitorPagination.page - 1) * visitorPagination.pageSize) + 1}-
                    {Math.min(visitorPagination.page * visitorPagination.pageSize, visitorPagination.totalVisitors)} of {visitorPagination.totalVisitors} visit logs
                  </p>
                  <div className="flex items-center gap-2">
                    <button type="button" onClick={() => { setVisitorPage((page) => Math.max(1, page - 1)); setExpandedVisits({}); }} disabled={visitorPagination.page <= 1} className="inline-flex items-center gap-1 border border-ink/15 px-3 py-1.5 font-josefin text-xs text-ink/62 transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-40">
                      <ChevronLeft className="h-3.5 w-3.5" /> Previous
                    </button>
                    <span className="min-w-20 text-center font-josefin text-xs text-ink/55">Page {visitorPagination.page} of {visitorPagination.totalPages}</span>
                    <button type="button" onClick={() => { setVisitorPage((page) => Math.min(visitorPagination.totalPages, page + 1)); setExpandedVisits({}); }} disabled={visitorPagination.page >= visitorPagination.totalPages} className="inline-flex items-center gap-1 border border-ink/15 px-3 py-1.5 font-josefin text-xs text-ink/62 transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-40">
                      Next <ChevronRight className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}

function Notice({ children, tone }: { readonly children: ReactNode; readonly tone: "gold" | "red" }) {
  const className = tone === "gold"
    ? "border-gold-dark/30 bg-[#fbf2de] text-[#75572f]"
    : "border-[#d7aaa4] bg-[#fff0ed] text-[#8b372f]";
  return (
    <div className={`mb-6 rounded-lg border px-4 py-3 ${className}`}>
      <p className="font-josefin text-sm font-medium">{children}</p>
    </div>
  );
}

function EmptyState({ label, icon }: { readonly label: string; readonly icon: ReactNode }) {
  return (
    <div className="py-20 text-center">
      <div className="mx-auto mb-3 flex justify-center">{icon}</div>
      <p className="font-josefin text-sm text-ink/45">{label}</p>
    </div>
  );
}
