'use client';
import Image from 'next/image';
import instagramIcon from '@/public/media/icons/instagram.webp';
import facebookIcon from '@/public/media/icons/facebook.webp';
import youtubeIcon from '@/public/media/icons/youtube.webp';
import spotifyIcon from '@/public/media/icons/spotify.webp';
import phoneIcon from '@/public/media/icons/phone.webp';
import mailIcon from '@/public/media/icons/mail.webp';

const items = [
    { href: 'mailto:laventoleracandombe@gmail.com', icon: mailIcon, alt: 'Email' },
  { href: 'tel:+59899178570', icon: phoneIcon, alt: 'Teléfono' },
  { href: 'https://www.facebook.com/laventoleracandombe', icon: facebookIcon, alt: 'Facebook' },
  { href: 'https://open.spotify.com/intl-es/artist/5hgeze6GTe8ckpSfdx3A5l?si=Ek-UhQZATOekLZiRwOnMUw', icon: spotifyIcon, alt: 'Spotify' },
  { href: 'https://www.youtube.com/@LaVentoleraCandombe', icon: youtubeIcon, alt: 'YouTube' },
  { href: 'https://www.instagram.com/laventoleracandombe/', icon: instagramIcon, alt: 'Instagram' },
];

export const SocialBar = () => {
  return (
    <>
      {/* Desktop vertical bar */}
      <div className="hidden md:flex fixed top-1/2 right-0 transform -translate-y-1/2 flex-col items-center space-y-8 p-10 z-50">
        {items.map(({ href, icon, alt }) => (
          <a key={alt} href={href} target="_blank" rel="noopener noreferrer">
            <Image
              src={icon}
              alt={alt}
              width={28}
              height={28}
              className="hover:scale-110 transition-transform"
            />
          </a>
        ))}
      </div>

      {/* Mobile horizontal bar */}
      <div className="md:hidden fixed bottom-0 left-1/2 -translate-x-1/2 flex justify-center items-center gap-6 py-6 w-full z-50">
        {items.map(({ href, icon, alt }) => (
          <a key={alt} href={href} target="_blank" rel="noopener noreferrer">
            <Image
              src={icon}
              alt={alt}
              width={30}
              height={30}
              className="hover:scale-110 transition-transform"
            />
          </a>
        ))}
      </div>
    </>
  );
};
