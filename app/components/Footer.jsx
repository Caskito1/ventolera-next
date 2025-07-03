
import Image from 'next/image';
import logo from '@/public/media/LogoVentolera.png';
import instagramIcon from '@/public/media/icons/instagram.webp';
import facebookIcon from '@/public/media/icons/facebook.webp';
import youtubeIcon from '@/public/media/icons/youtube.webp';
import spotifyIcon from '@/public/media/icons/spotify.webp';
import phoneNumber from '@/public/media/icons/phone.webp'
import email from '@/public/media/icons/mail.webp'


const contacLinks = [ 
  {href: '+59899178570', icon: phoneNumber, alt:'Phone', text:'+598 99 178 570'},
  {href: 'mailto:laventoleracandombe@gmail.com', icon: email, alt:'Email', text:'laventoleracandombe@gmail.com'}
]
const socialLinks = [
  { href: 'https://www.instagram.com/laventoleracandombe/', icon: instagramIcon, alt: 'Instagram' },
  { href: 'https://www.facebook.com/laventoleracandombe', icon: facebookIcon, alt: 'Facebook' },
  { href: 'https://open.spotify.com/intl-es/artist/...', icon: spotifyIcon, alt: 'Spotify' },
  { href: 'https://www.youtube.com/@LaVentoleraCandombe', icon: youtubeIcon, alt: 'YouTube' },
];

export const Footer = () => {
  return (
    <footer className="bg-[rgb(42,42,42)] text-white relative py-10">
      <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-8">
        {/* Logo y contacto */}
        <div className="flex flex-col items-center md:items-start">
          <Image src={logo} alt="Logo Ventolera" width={200} height={100} className="mb-4" />
          <div className="flex flex-col items-center md:items-start text-sm">
              <div className="flex flex-col  mb-1 ">
            {contacLinks.map(({href, icon, alt, text}) => (
                <a  key={alt} href={href} target="_blank" rel="noopener noreferrer"  className='flex items-center hover:scale-110 transition-transform'>
             <Image src={icon} 
             alt={alt}
             width={32}
             height={32}
             className=" m-2"
                />
              <span>{text}</span>
              </a>
            ))}
            </div>

          </div>
        </div>


    {/* Redes sociales */}
        <div className="flex space-x-4">
          {socialLinks.map(({ href, icon, alt }) => (
            <a key={alt} href={href} target="_blank" rel="noopener noreferrer">
              <Image
                src= {icon}
                alt={alt}
                width={32}
                height={32}
                className="hover:scale-110 transition-transform"
              />
            </a>
          ))}
        </div>
         </div>

      {/* Copyright */}
      <div className="text-center text-xs mt-6">
        &copy; {new Date().getFullYear()} La Ventolera candombe. Todos los derechos reservados.
      </div>
     
    </footer>
  );
};
