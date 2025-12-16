import { useEffect, useState } from 'react';
import album1 from '@/assets/album-1.png';
import album2 from '@/assets/album-2.png';
import album3 from '@/assets/album-3.png';
import album4 from '@/assets/album-4.png';
import album5 from '@/assets/album-5.png';

const albumCovers = [album1, album2, album3, album4, album5];

interface FloatingCover {
  id: number;
  src: string;
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
  rotation: number;
}

export default function FloatingAlbumCovers() {
  const [covers, setCovers] = useState<FloatingCover[]>([]);

  useEffect(() => {
    const generateCovers = () => {
      const newCovers: FloatingCover[] = [];
      for (let i = 0; i < 20; i++) {
        newCovers.push({
          id: i,
          src: albumCovers[i % albumCovers.length],
          x: Math.random() * 100,
          y: Math.random() * 100,
          size: 60 + Math.random() * 80,
          duration: 15 + Math.random() * 20,
          delay: Math.random() * -20,
          rotation: Math.random() * 360,
        });
      }
      setCovers(newCovers);
    };
    generateCovers();
  }, []);

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {covers.map((cover) => (
        <div
          key={cover.id}
          className="absolute opacity-20 rounded-lg shadow-2xl"
          style={{
            left: `${cover.x}%`,
            top: `${cover.y}%`,
            width: `${cover.size}px`,
            height: `${cover.size}px`,
            transform: `rotate(${cover.rotation}deg)`,
            animation: `floatCover ${cover.duration}s ease-in-out ${cover.delay}s infinite`,
          }}
        >
          <img
            src={cover.src}
            alt=""
            className="w-full h-full object-cover rounded-lg"
          />
        </div>
      ))}
      <style>{`
        @keyframes floatCover {
          0%, 100% {
            transform: translateY(0px) rotate(0deg) scale(1);
          }
          25% {
            transform: translateY(-30px) rotate(5deg) scale(1.05);
          }
          50% {
            transform: translateY(-15px) rotate(-3deg) scale(0.98);
          }
          75% {
            transform: translateY(-40px) rotate(3deg) scale(1.02);
          }
        }
      `}</style>
    </div>
  );
}
