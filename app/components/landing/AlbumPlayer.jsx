import { useRef, useState } from "react";

const AlbumPlayer = () => {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);

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
          w-20 h-20 rounded-full
          flex items-center justify-center
          backdrop-blur-md
          bg-black/40
          border border-white/20
          transition-all duration-300
          hover:scale-110
          shadow-2xl
        `}
      >
        {isPlaying ? (
          <span className="text-white text-2xl drop-shadow-lg">❚❚</span>
        ) : (
          <span className="text-white text-3xl drop-shadow-lg">▶</span>
        )}
      </button>
    </>
  );
};

export default AlbumPlayer;
