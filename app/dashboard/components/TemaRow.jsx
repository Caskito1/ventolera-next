"use client";

import { useState } from "react";

function FavoriteButton({ partitura, favorites, animatingId, onToggleFavorite }) {
  const disabled = !partitura?.driveFileId;
  const isFav = favorites.includes(partitura?.id);

  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        onToggleFavorite(partitura.id, partitura.tema);
      }}
      disabled={disabled}
      title={isFav ? "Quitar de favoritas" : "Marcar como favorita"}
      className={`flex items-center justify-center w-7 h-7 rounded-full transition ${
        disabled
          ? "cursor-not-allowed opacity-50"
          : "cursor-pointer hover:bg-gray-100"
      }`}
    >
      <img
        src={isFav ? "/media/icons/star-yellow.webp" : "/media/icons/star.webp"}
        alt="Favorito"
        height={18}
        width={18}
        className={`transition-transform duration-200 ${
          animatingId === partitura?.id ? "scale-125" : "scale-100"
        }`}
      />
    </button>
  );
}

function DownloadButton({ partitura, downloadingId, onDownload }) {
  const downloading = downloadingId === partitura.driveFileId;

  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        onDownload(partitura.driveFileId, partitura.tema);
      }}
      disabled={downloading}
      title="Descargar PDF"
      aria-label={`Descargar ${partitura.tema} (${partitura.instrumento})`}
      className="flex items-center justify-center w-6 h-6 cursor-pointer"
    >
      {downloading ? (
        <span className="w-4 h-4 border-2 border-gray-400 border-t-orange-600 rounded-full animate-spin" />
      ) : (
        <img
          src="/media/icons/download.webp"
          alt=""
          height={20}
          width={20}
        />
      )}
    </button>
  );
}

function BlockIcon() {
  return (
    <div className="flex items-center gap-1 text-gray-400 cursor-not-allowed">
      <img src="/media/icons/block.webp" alt="Sin PDF" height={16} width={16} />
    </div>
  );
}

function PlayButton({ isPlaying, isLoading, onClick }) {
  const label = isPlaying ? "Pausar" : "Reproducir";

  return (
    <span onClick={(event) => event.stopPropagation()}>
      <button
        type="button"
        onClick={onClick}
        title={label}
        aria-label={label}
        className="flex items-center justify-center w-7 h-7 rounded-full bg-orange-500 text-white transition cursor-pointer hover:bg-orange-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400"
      >
        {isLoading ? (
          <span className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
        ) : (
          <img
            src={isPlaying ? "/media/icons/pausa.png" : "/media/icons/play.png"}
            alt=""
            width={12}
            height={12}
          />
        )}
      </button>
    </span>
  );
}

/**
 * Una fila por canción: play (solo si hay audio), acordeón de PDFs por
 * instrumento, favoritos y descarga de PDF.
 *
 * El click en la fila solo abre/cierra el acordeón cuando hay más de una
 * parte. La descarga de PDF se hace únicamente desde su ícono.
 */
export default function TemaRow({
  row,
  favorites,
  isPlaying,
  isLoading,
  isActive,
  onToggleAudio,
  onToggleFavorite,
  onDownload,
  downloadingId,
  animatingId,
}) {
  const [open, setOpen] = useState(false);

  const partituras = row?.partituras ?? [];
  const multiple = partituras.length > 1;
  const single = partituras.length === 1 ? partituras[0] : null;
  const hasAudio = Boolean(row?.audio?.storagePath);

  const handleRowClick = () => {
    if (multiple) setOpen((prev) => !prev);
  };

  return (
    <li
      className={`border rounded transition ${
        isActive
          ? "border-orange-400 bg-orange-50"
          : multiple
          ? "hover:bg-gray-50"
          : ""
      }`}
    >
      <div
        className={`flex justify-between items-center gap-2 p-3 ${
          multiple ? "cursor-pointer" : "cursor-default"
        }`}
        onClick={handleRowClick}
      >
        <div className="flex gap-2 items-center min-w-0">
          {single && (
            <FavoriteButton
              partitura={single}
              favorites={favorites}
              animatingId={animatingId}
              onToggleFavorite={onToggleFavorite}
            />
          )}

          <span className="truncate">{row?.tema}</span>

          {multiple && (
            <span className="text-xs text-gray-400 shrink-0">
              {partituras.length} partes
            </span>
          )}
        </div>

        <div className="flex gap-2 items-center shrink-0">
          {hasAudio && (
            <PlayButton
              isPlaying={isPlaying}
              isLoading={isLoading}
              onClick={() => onToggleAudio(row)}
            />
          )}

          {single &&
            (single.driveFileId ? (
              <DownloadButton
                partitura={single}
                downloadingId={downloadingId}
                onDownload={onDownload}
              />
            ) : (
              <BlockIcon />
            ))}

          {partituras.length === 0 && (
            <span className="text-xs text-gray-400">
              Sin partituras para tu instrumento
            </span>
          )}

          {multiple && (
            <button
              type="button"
              aria-expanded={open}
              aria-label={open ? "Ocultar partes" : "Mostrar partes"}
              className="w-7 h-7 flex items-center justify-center cursor-pointer text-gray-500"
              onClick={(e) => {
                e.stopPropagation();
                setOpen((prev) => !prev);
              }}
            >
              <span
                className={`transition-transform duration-300 ${
                  open ? "rotate-270" : "rotate-180"
                }`}
              >
                <img src="/media/icons/arrow-left-black.webp" alt="" width={20} />
              </span>
            </button>
          )}
        </div>
      </div>

      {multiple && (
        <div
          className={`grid transition-all duration-300 ${
            open
              ? "grid-rows-[1fr] opacity-100"
              : "grid-rows-[0fr] opacity-0"
          }`}
        >
          <div className="overflow-hidden min-h-0">
            <ul className="border-t px-3 py-2 space-y-2">
              {partituras.map((partitura, index) => (
                <li
                  key={partitura.id}
                  className={`flex justify-between items-center gap-2 rounded-lg px-2 py-1.5 ${
                    index % 2 === 0 ? "bg-white" : "bg-gray-100"
                  }`}
                >
                  <div className="flex gap-2 items-center min-w-0">
                    <FavoriteButton
                      partitura={partitura}
                      favorites={favorites}
                      animatingId={animatingId}
                      onToggleFavorite={onToggleFavorite}
                    />
                    <span className="text-sm truncate">
                      {partitura.instrumento}
                    </span>
                    {!partitura.driveFileId && (
                      <span className="text-xs text-gray-400">sin PDF</span>
                    )}
                  </div>

                  {partitura.driveFileId ? (
                    <DownloadButton
                      partitura={partitura}
                      downloadingId={downloadingId}
                      onDownload={onDownload}
                    />
                  ) : (
                    <BlockIcon />
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </li>
  );
}
