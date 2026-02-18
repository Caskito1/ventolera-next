import { useEffect, useRef } from "react";

const AlbumPlayer = ({ isPlaying, setIsPlaying }) => {
  const audioRef = useRef(null);

  const togglePlay = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

    useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleEnded = () => {
      setIsPlaying(false);
    };

    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("ended", handleEnded);
    };
  }, [setIsPlaying]);

  return (
    <>
      <audio
        ref={audioRef}
        src="/media/audio/se-pica-web.mp3"
        preload="metadata"
      />

      <button
        onClick={togglePlay}
        className={`
          relative w-20 h-20 rounded-full
          flex items-center justify-center
          backdrop-blur-md
          bg-black/50
          border border-white/20
          transition-all duration-300
          hover:scale-110
          shadow-2xl
          overflow-hidden
          ${isPlaying ? "animate-vibrate" : ""}
        `}
      >
        {/* Glow */}
        {isPlaying && (
          <div className="absolute inset-0 rounded-full bg-white/10 blur-xl animate-pulse" />
        )}

        {/* Luz cónica */}
        {isPlaying && (
          <div
            className="
              absolute top-[-40%] left-[35%]
              w-[20%] h-[200%]
              bg-gradient-to-b
              from-white/60 via-white/30 to-transparent
              blur-sm
              animate-spotlight
              pointer-events-none
            "
          />
        )}

        {isPlaying ? (
          <span className="relative z-10 text-white text-2xl drop-shadow-lg">
            ❚❚
          </span>
        ) : (
          <span className="relative z-10 text-white text-3xl drop-shadow-lg">
            ▶
          </span>
        )}
      </button>
    </>
  );
};

export default AlbumPlayer;
