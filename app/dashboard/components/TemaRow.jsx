"use client";

import { useState } from "react";
import AudioPlayer from "./AudioPlayer";

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
      className={disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer"}
    >
      <img
        src={isFav ? "/media/icons/star-yellow.webp" : "/media/icons/star.webp"}
        alt="Favorito"
        height={16}
        width={16}
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

/**
 * Una fila por canción: reproductor, acordeón de PDFs por instrumento,
 * favoritos y descarga.
 */
export default function TemaRow({
  row,
  favorites,
  isPlaying,
  isLoading,
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
    if (multiple) {
      setOpen((prev) => !prev);
    } else if (single?.driveFileId) {
      onDownload(single.driveFileId, single.tema);
    }
  };

  return (
    <li className="border rounded transition hover:bg-gray-50">
      <div
        className="flex justify-between items-center gap-2 p-3 cursor-pointer"
        onClick={handleRowClick}
      >
        <div className="flex gap-2 items-center min-w-0">
          <span onClick={(e) => e.stopPropagation()}>
            <AudioPlayer
              isPlaying={isPlaying}
              isLoading={isLoading}
              hasAudio={hasAudio}
              onClick={() => onToggleAudio(row)}
            />
          </span>

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
              className="w-6 h-6 flex items-center justify-center cursor-pointer text-gray-500"
              onClick={(e) => {
                e.stopPropagation();
                setOpen((prev) => !prev);
              }}
            >
              {open ? "▾" : "▸"}
            </button>
          )}
        </div>
      </div>

      {multiple && open && (
        <ul className="border-t px-3 py-2 space-y-1">
          {partituras.map((partitura) => (
            <li
              key={partitura.id}
              className="flex justify-between items-center gap-2"
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
      )}
    </li>
  );
}
