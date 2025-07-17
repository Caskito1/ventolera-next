import dynamic from 'next/dynamic';
import GallerySlider from './GallerySlider';


// const GallerySlider = dynamic(() => import('./GallerySlider'), { ssr: false });

export const Gallery = () =>  {
  return (
    <section className='bg-white md:p-16 p-2'>
     
      <GallerySlider />
    </section>
  );
}

  export default Gallery;
