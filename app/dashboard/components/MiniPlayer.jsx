"use client";

/**
 * Barra de reproducción anclada al pie del contenido.
 *
 * Única superficie de transporte del tab: play/pausa, título, seek con
 * tiempos, descarga del audio y cerrar. La fila solo conserva su botón de
 * reproducción (patrón de Spotify/Apple Music).
 */
function formatTime(value) {
  if (!Number.isFinite(value) || value < 0) return "--:--";

  const total = Math.floor(value);
  const minutes = Math.floor(total / 60);
  const seconds = total % 60;
  return `${minutes}:${String(seconds).padStart(2, "0")}`;
}

function IconButton({ label, onClick, disabled, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={label}
      aria-label={label}
      className="flex items-center justify-center w-9 h-9 rounded-full text-white transition cursor-pointer hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
    >
      {children}
    </button>
  );
}

export default function MiniPlayer({
  title,
  subtitle,
  isPlaying,
  isLoading,
  hasError,
  currentTime,
  duration,
  downloading,
  onToggle,
  onSeek,
  onDownload,
  onClose,
}) {
  const playLabel = isPlaying ? "Pausar" : "Reproducir";
  const progress =
    duration > 0 ? Math.min(100, (currentTime / duration) * 100) : 0;

  const playButton = (
    <button
      type="button"
      onClick={onToggle}
      title={playLabel}
      aria-label={playLabel}
      className="flex items-center justify-center w-11 h-11 rounded-full border border-white/40 bg-white/10 transition cursor-pointer shrink-0 hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
    >
      {isLoading ? (
        <span className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
      ) : (
        <img
          src={isPlaying ? "/media/icons/pausa.png" : "/media/icons/play.png"}
          alt=""
          width={18}
          height={18}
        />
      )}
    </button>
  );

  const downloadButton = (
    <IconButton
      label={downloading ? "Descargando audio" : "Descargar audio"}
      onClick={onDownload}
      disabled={downloading}
    >
      {downloading ? (
        <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
      ) : (
        <img
          src="/media/icons/download.webp"
          alt=""
          width={18}
          height={18}
          className="brightness-0 invert"
        />
      )}
    </IconButton>
  );

  const closeButton = (
    <IconButton label="Cerrar reproductor" onClick={onClose}>
      <img
        src="/media/icons/close.webp"
        alt=""
        width={14}
        height={14}
        className="brightness-0 invert"
      />
    </IconButton>
  );

  return (
    <div
      className="fixed z-40 bottom-0 left-0 right-0 border-t border-orange-600/40 bg-orange-500/80 text-white shadow-2xl backdrop-blur-md lg:bottom-4 lg:left-[21rem] lg:right-10 lg:rounded-xl lg:border"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <div className="flex flex-col gap-2 px-3 py-2 lg:flex-row lg:items-center lg:gap-4 lg:px-4 lg:py-2.5">
        <div className="flex items-center gap-3 lg:w-64 lg:flex-none">
          {playButton}

          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold">{title}</p>
            {(hasError || subtitle) && (
              <p
                className={`truncate text-[11px] ${
                  hasError ? "text-white" : "text-white/80"
                }`}
              >
                {hasError ? "No se pudo reproducir" : subtitle}
              </p>
            )}
          </div>

          <div className="flex items-center gap-0.5 lg:hidden">
            {downloadButton}
            {closeButton}
          </div>
        </div>

        <div className="flex items-center gap-2 lg:flex-1">
          <span className="w-9 text-right text-[11px] font-medium tabular-nums text-white/90">
            {formatTime(currentTime)}
          </span>

          <div className="relative flex h-4 flex-1 items-center">
            <div className="pointer-events-none absolute inset-x-0 top-1/2 h-1.5 -translate-y-1/2 rounded-full bg-white/40 ring-1 ring-inset ring-white/70" />
            <div
              className="pointer-events-none absolute left-0 top-1/2 h-1.5 -translate-y-1/2 rounded-full bg-white"
              style={{ width: `${progress}%` }}
            />
            <input
              type="range"
              min={0}
              max={duration || 0}
              step={0.1}
              value={Math.min(currentTime, duration || 0)}
              onChange={(event) => onSeek(Number(event.target.value))}
              disabled={!duration}
              aria-label="Progreso del audio"
              aria-valuetext={`${formatTime(currentTime)} de ${formatTime(duration)}`}
              className="relative z-10 h-4 w-full cursor-pointer appearance-none bg-transparent disabled:cursor-not-allowed [&::-moz-range-thumb]:h-3.5 [&::-moz-range-thumb]:w-3.5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-white [&::-moz-range-thumb]:bg-orange-500 [&::-moz-range-track]:h-4 [&::-moz-range-track]:bg-transparent [&::-webkit-slider-runnable-track]:h-4 [&::-webkit-slider-runnable-track]:bg-transparent [&::-webkit-slider-thumb]:h-3.5 [&::-webkit-slider-thumb]:w-3.5 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:bg-orange-500"
            />
          </div>

          <span className="w-9 text-[11px] font-medium tabular-nums text-white/90">
            {formatTime(duration)}
          </span>
        </div>

        <div className="hidden items-center gap-0.5 lg:flex">
          {downloadButton}
          {closeButton}
        </div>
      </div>
    </div>
  );
}
