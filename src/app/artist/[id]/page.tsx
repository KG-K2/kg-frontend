"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Loader2, Palette, Hourglass, Landmark, Brush, Globe, MapPin } from "lucide-react";

interface ArtistDetail {
  id: string | number;
  name: string;
  bio: string;
  nationality: string;
  base?: string; // Field baru
  birth_year?: number;
  death_year?: number;
  period?: string;
  school?: string;
  type: string;
  artworks: {
    id: number;
    title: string;
    url: string;
    year?: string;
    medium?: string;
  }[];
}

export default function ArtistPage() {
  const { id } = useParams();
  const router = useRouter();
  const [artist, setArtist] = useState<ArtistDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    const artistName = decodeURIComponent(id as string);
    fetch(`http://localhost:8000/artist/${encodeURIComponent(artistName)}`)
      .then((res) => {
         if(!res.ok) throw new Error("Artist not found");
         return res.json();
      })
      .then((data) => {
        setArtist(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-[#F2F0E9]"><Loader2 className="animate-spin" /></div>;
  if (!artist) return <div className="min-h-screen flex items-center justify-center">Artist not found</div>;

  return (
    <main className="min-h-screen bg-[#F2F0E9] text-[#2A2826] font-sans pb-20">
      <button onClick={() => router.back()} className="fixed top-6 left-6 z-50 p-3 bg-white/80 backdrop-blur rounded-full shadow-md hover:bg-white transition-all">
        <ArrowLeft className="w-6 h-6" />
      </button>

      {/* HEADER */}
      <div className="relative pt-32 pb-16 px-6 md:px-20 max-w-6xl mx-auto">
        <span className="text-[#C6A87C] font-bold tracking-widest uppercase text-sm mb-4 block">Artist Profile</span>
        <h1 className="font-serif text-6xl md:text-8xl font-bold mb-6 leading-none">{artist.name}</h1>
        
        {/* INFO BADGES */}
        <div className="flex flex-wrap gap-4 mb-8">
            {/* Nationality: German, Italian */}
            {artist.nationality && (
                <span className="px-3 py-1 bg-[#E5E0D8] rounded-full text-sm font-medium flex items-center gap-2">
                    <Globe className="w-4 h-4 text-stone-500" />
                    {artist.nationality}
                </span>
            )}
            
            {/* Base: Germany, Rome, Paris */}
            {artist.base && (
                <span className="px-3 py-1 bg-[#E5E0D8] rounded-full text-sm font-medium flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-stone-500" />
                    {artist.base}
                </span>
            )}

            {/* Years */}
            {(artist.birth_year || artist.death_year) && (
                <span className="px-3 py-1 bg-[#E5E0D8] rounded-full text-sm font-medium flex items-center gap-2">
                    <Hourglass className="w-4 h-4 text-stone-500" />
                    {artist.birth_year || '?'} — {artist.death_year || '?'}
                </span>
            )}

            {/* Period */}
            {artist.period && (
                <span className="px-3 py-1 bg-[#E5E0D8] rounded-full text-sm font-medium flex items-center gap-2">
                    <Brush className="w-4 h-4 text-stone-500" />
                    {artist.period}
                </span>
            )}

            {/* School */}
            {artist.school && (
                <span className="px-3 py-1 bg-[#E5E0D8] rounded-full text-sm font-medium flex items-center gap-2">
                    <Landmark className="w-4 h-4 text-stone-500" />
                    {artist.school}
                </span>
            )}
        </div>

        <div className="border-t border-[#C6A87C]/30 pt-10">
            <p className="text-lg leading-relaxed text-stone-700 font-serif border-l-4 border-[#C6A87C] pl-6">
              {artist.bio || "No biography available."}
            </p>
        </div>
      </div>

      {/* GALLERY (Sama seperti sebelumnya) */}
      <div className="px-6 md:px-20 max-w-[1800px] mx-auto">
        <h2 className="font-serif text-4xl mb-10 flex items-center gap-4">
          <Palette className="w-8 h-8 text-[#C6A87C]" />
          Known Works <span className="text-lg text-stone-400 font-sans font-normal">({artist.artworks.length})</span>
        </h2>
        {/* ... (Gallery code sama) ... */}
        <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6">
          {artist.artworks.map((work) => (
            <div 
              key={work.id}
              onClick={() => router.push(`/artwork/${work.id}`)}
              className="break-inside-avoid group cursor-pointer"
            >
              <div className="relative overflow-hidden rounded-sm bg-stone-200 mb-3">
                <img 
                  src={work.url} 
                  alt={work.title}
                  className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105 filter sepia-[0.2] group-hover:sepia-0"
                  loading="lazy"
                  onError={(e) => (e.target as HTMLImageElement).style.display = 'none'}
                />
              </div>
              <h3 className="font-serif text-xl leading-tight group-hover:underline decoration-[#C6A87C] underline-offset-4">{work.title}</h3>
              <p className="text-sm text-stone-500 mt-1 capitalize">{work.medium || "Artwork"}</p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}