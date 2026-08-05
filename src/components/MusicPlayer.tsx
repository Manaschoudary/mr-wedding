"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export function MusicPlayer() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);

  const playMusic = useCallback(async (): Promise<boolean> => {
    const audio = audioRef.current;
    if (!audio) return false;

    try {
      await audio.play();
      return true;
    } catch {
      return false;
    }
  }, []);

  useEffect(() => {
    let cleanedUp = false;

    function removeRetryListeners() {
      window.removeEventListener("pointerdown", retryPlay);
      window.removeEventListener("keydown", retryPlay);
    }

    function retryPlay() {
      void playMusic().then((started) => {
        if (started) {
          removeRetryListeners();
        }
      });
    }

    void playMusic().then((started) => {
      if (started || cleanedUp) return;

      window.addEventListener("pointerdown", retryPlay, { once: true });
      window.addEventListener("keydown", retryPlay, { once: true });
    });

    return () => {
      cleanedUp = true;
      removeRetryListeners();
    };
  }, [playMusic]);

  function toggle() {
    const audio = audioRef.current;
    if (!audio) return;

    if (playing) {
      audio.pause();
      setPlaying(false);
    } else {
      void playMusic();
    }
  }

  return (
    <>
      <audio
        ref={audioRef}
        src="/wedding-song.mp3"
        loop
        preload="auto"
        autoPlay
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
      />
      <button
        type="button"
        onClick={toggle}
        aria-label={playing ? "Pause music" : "Play music"}
        className="fixed bottom-4 right-4 z-50 flex h-11 w-11 items-center justify-center rounded-full border border-linen/30 bg-burgundy-deep/90 text-linen shadow-lg backdrop-blur-sm transition hover:bg-burgundy-deep"
      >
        {playing ? (
          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
            <rect x="6" y="4" width="4" height="16" rx="1" />
            <rect x="14" y="4" width="4" height="16" rx="1" />
          </svg>
        ) : (
          <svg className="h-5 w-5 ml-0.5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M8 5v14l11-7z" />
          </svg>
        )}
      </button>
    </>
  );
}
