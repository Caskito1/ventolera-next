import { useEffect, useRef } from "react";

const AlbumPlayer = ({ isPlaying, onToggle }) => {
   const audioRef = useRef(null);

  // 🎵 Sincroniza el audio real con el estado global
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.play().catch(() => {});
    } else {
      audio.pause();
    }
  }, [isPlaying]);

  // Cuando termina el tema, avisamos hacia arriba
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleEnded = () => {
      onToggle(); // vuelve a null el activePlayer
    };

    audio.addEventListener("ended", handleEnded);
    return () => {
      audio.removeEventListener("ended", handleEnded);
    };
  }, [onToggle]);

  return (
    <>
      <audio  
        ref={audioRef}
        src="/media/audio/se-pica-web.mp3"
        preload="metadata"
      />

      <button
        onClick={onToggle}
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
        {isPlaying && (
          <div className="absolute inset-0 rounded-full bg-white/10 blur-xl animate-pulse" />
        )}

        {isPlaying ? (
          <img src="/media/icons/pausa.png" alt="pausa-icon" width={24} />
        ) : (
          <img src="/media/icons/play.png" alt="play-icon" width={24} />
        )}
      </button>
    </>
  );
};

export default AlbumPlayer;
