"use client";

import { useEffect, useRef, useState } from "react";

type Clip = {
  key: string;
  title: string;
  note: string;
  video: string;
  poster: string;
};

const clips: Clip[] = [
  {
    key: "final-film",
    title: "Final film",
    note: "The complete narrated Villa Siena campaign film.",
    video: "/media/villa-siena/00-WATCH-THIS-FINAL-FILM.mp4",
    poster: "/media/villa-siena/01-Night-Aerial-Exterior.jpg",
  },
  {
    key: "night-arrival",
    title: "Night arrival",
    note: "Aerial approach to the property.",
    video: "/media/villa-siena/01-Night-Arrival.mp4",
    poster: "/media/villa-siena/01-Night-Aerial-Exterior.jpg",
  },
  {
    key: "living-with-nature",
    title: "Living with nature",
    note: "The great room opening to the garden.",
    video: "/media/villa-siena/02-Living-With-Nature.mp4",
    poster: "/media/villa-siena/02-Great-Room-and-Garden.jpg",
  },
  {
    key: "floating-stair",
    title: "Floating stair",
    note: "The bronze-finished staircase.",
    video: "/media/villa-siena/03-Floating-Stair.mp4",
    poster: "/media/villa-siena/03-Floating-Stair-and-Bronze-Wall.jpg",
  },
  {
    key: "fire-and-water",
    title: "Fire and water",
    note: "The reflecting pool and stair.",
    video: "/media/villa-siena/04-Fire-and-Water.mp4",
    poster: "/media/villa-siena/04-Fire-Water-and-Stair.jpg",
  },
];

export function ProofReel() {
  const [activeKey, setActiveKey] = useState(clips[0].key);
  const active = clips.find((clip) => clip.key === activeKey) ?? clips[0];
  const videoRef = useRef<HTMLVideoElement>(null);

  // Swap src/poster via the element directly instead of remounting via key,
  // so the player stays stable and avoids a flash.
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    // Only touch the element when the active clip changes — not on first render,
    // since the initial src/poster are already set via JSX.
    // Compare pathnames (not full URLs) so the guard works regardless of origin.
    try {
      if (new URL(video.src).pathname === active.video) return;
    } catch {
      // Fallback for environments where video.src is a bare path.
      if (video.src === active.video || video.src.endsWith(active.video)) return;
    }
    video.pause();
    video.src = active.video;
    video.poster = active.poster;
    video.load();
  }, [active.video, active.poster]);

  return (
    <div className="proof-reel" id="proof-reel">
      <video
        ref={videoRef}
        className="proof-reel-player"
        src={active.video}
        poster={active.poster}
        controls
        playsInline
        preload="metadata"
      />
      <p className="proof-reel-caption">{active.note}</p>
      <div className="proof-reel-strip" role="group" aria-label="Choose a scene from Villa Siena">
        {clips.map((clip) => (
          <button
            type="button"
            key={clip.key}
            className={clip.key === activeKey ? "proof-reel-thumb is-active" : "proof-reel-thumb"}
            onClick={() => setActiveKey(clip.key)}
            aria-pressed={clip.key === activeKey}
          >
            {/* eslint-disable-next-line @next/next/no-img-element -- small thumbnail rail, not a page hero image */}
            <img src={clip.poster} alt="" aria-hidden="true" />
            <span>{clip.title}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
