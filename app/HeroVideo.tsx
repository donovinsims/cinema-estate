"use client";

import { useEffect, useRef, useState } from "react";
import { track } from "./analytics";

type HeroVideoProps = {
  src: string;
  poster: string;
};

export function HeroVideo({ src, poster }: HeroVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    // CSS hides the film under prefers-reduced-motion, but a muted autoplaying
    // video keeps playing without an explicit pause; stop it here. If autoplay
    // hasn't started yet, onPlay below re-checks and pauses it the moment it does.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      video.pause();
      return;
    }
    setPlaying(!video.paused);
  }, []);

  function toggle() {
    const video = videoRef.current;
    if (!video) return;
    if (playing) {
      video.pause();
      track("hero_video_toggled", { action: "paused" });
    } else {
      void video
        .play()
        .then(() => track("hero_video_toggled", { action: "played" }))
        .catch(() => undefined);
    }
  }

  return (
    <>
      <video
        ref={videoRef}
        className="hero-film"
        src={src}
        poster={poster}
        muted
        autoPlay
        loop
        playsInline
        preload="metadata"
        onPlay={() => {
          if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
            videoRef.current?.pause();
            return;
          }
          setPlaying(true);
        }}
        onPause={() => setPlaying(false)}
      />
      <button type="button" className="hero-media-toggle" onClick={toggle} aria-pressed={!playing}>
        {playing ? "Pause background video" : "Play background video"}
      </button>
    </>
  );
}
