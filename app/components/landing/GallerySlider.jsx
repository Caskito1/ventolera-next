import GalleryMosaic from './GalleryMosaic';

const images = [
  '/media/gallery/vento19.webp',
  '/media/gallery/vento11.webp',
  '/media/gallery/vento21.webp',
  '/media/gallery/vento13.webp',
  '/media/gallery/vento14.webp',
  '/media/gallery/vento16.webp',
  '/media/gallery/vento17.webp',
  '/media/gallery/vento18.webp',
  // '/media/gallery/vento09.jpg',

];

export const Gallery = () => {
  return (
    <>
      <GalleryMosaic images={images} />
    </>
  );
};

export default Gallery;
