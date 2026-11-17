"use client";

/**
 * Control de reproducción de un tema. El elemento `<audio>` es único y vive
 * en `PartiturasTab`; este componente solo dibuja el botón de la fila.
 */
export default function AudioPlayer({
  isPlaying = false,
  isLoading = false,
  hasAudio = false,
  onClick,
}) {
  const disabled = !hasAudio;
  const label = disabled
    ? "Sin audio cargado"
    : isPlaying
    ? "Pausar"
    : "Reproducir";

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled || isLoading}
      title={label}
      aria-label={label}
      className={`flex items-center justify-center w-8 h-8 rounded-full transition shrink-0 ${
        disabled
          ? "bg-gray-100 cursor-not-allowed"
          : "cursor-pointer hover:bg-orange-100"
      }`}
    >
      {isLoading ? (
        <span className="w-4 h-4 border-2 border-gray-400 border-t-orange-600 rounded-full animate-spin" />
      ) : (
        <img
          src={isPlaying ? "/media/icons/pausa.png" : "/media/icons/play.png"}
          alt=""
          width={16}
          height={16}
          className={disabled ? "brightness-0 opacity-40" : ""}
        />
      )}
    </button>
  );
}
