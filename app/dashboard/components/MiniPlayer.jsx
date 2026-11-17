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
      className="fixed z-40 bottom-0 left-0 right-0 border-t border-orange-800/50 bg-orange-700 text-white shadow-2xl lg:bottom-4 lg:left-80 lg:right-6 lg:rounded-xl lg:border"
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
          <span className="w-9 text-right text-[11px] tabular-nums text-white/90">
            {formatTime(currentTime)}
          </span>
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
            className="flex-1 h-1.5 cursor-pointer accent-white disabled:cursor-not-allowed"
          />
          <span className="w-9 text-[11px] tabular-nums text-white/90">
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
