"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Loader2, MapPin, User } from "lucide-react";

// Sesuaikan interface dengan response backend baru
interface ArtworkPageResponse {
  artwork: {
    id: number;
    title: string;
    url: string;
    location: string;
    form: string;
  };
  artist: {
    id: string; // ID Artist sekarang String (Namanya)
    name: string;
    nationality: string;
    bio: string;
  } | null;
}

export default function ArtworkPage() {
  const { id } = useParams();
  const router = useRouter();
  const [data, setData] = useState<ArtworkPageResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    fetch(`http://localhost:8000/artwork/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Gagal mengambil data");
        return res.json();
      })
      .then((data) => {
        setData(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setData(null);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-[#F2F0E9]"><Loader2 className="animate-spin" /></div>;
  if (!data) return <div className="min-h-screen flex items-center justify-center">Artwork not found</div>;

  return (
    <main className="min-h-screen bg-[#F2F0E9] text-[#2A2826] font-sans flex flex-col lg:flex-row">
      <button onClick={() => router.back()} className="fixed top-6 left-6 z-50 p-3 bg-white/80 backdrop-blur rounded-full shadow-md hover:bg-white transition-all">
        <ArrowLeft className="w-6 h-6" />
      </button>

      {/* LEFT: IMAGE */}
      <div className="w-full lg:w-3/5 min-h-[50vh] lg:h-screen bg-[#1a1918] flex items-center justify-center relative p-10">
        <img 
          src={data.artwork.url} 
          alt={data.artwork.title}
          className="max-h-full max-w-full object-contain shadow-2xl drop-shadow-2xl"
          onError={(e) => (e.target as HTMLImageElement).style.display = 'none'} 
        />
      </div>

      {/* RIGHT: INFO */}
      <div className="w-full lg:w-2/5 p-10 lg:p-16 flex flex-col justify-center bg-[#F2F0E9] overflow-y-auto h-screen">
        <div className="mb-8">
            <span className="text-[#C6A87C] tracking-[0.2em] text-xs font-bold uppercase mb-2 block">
                {data.artwork.form}
            </span>
            <h1 className="font-serif text-5xl md:text-6xl font-bold mb-6 text-[#2A2826] leading-tight">
                {data.artwork.title}
            </h1>
            <div className="flex items-center gap-2 text-stone-500 mb-6">
                <MapPin className="w-4 h-4" />
                <span className="italic">{data.artwork.location}</span>
            </div>
        </div>

        {/* ARTIST CARD */}
        {data.artist && (
            <div 
                // FIX: Gunakan encodeURIComponent untuk nama artist
                onClick={() => router.push(`/artist/${encodeURIComponent(data.artist!.name)}`)}
                className="group border-t border-b border-[#C6A87C]/30 py-8 cursor-pointer hover:bg-white/50 transition-colors -mx-4 px-4 rounded-lg"
            >
                <div className="flex items-center gap-2 text-stone-400 mb-2 text-sm uppercase tracking-wider">
                    <User className="w-4 h-4" /> Created By
                </div>
                <h2 className="font-serif text-3xl group-hover:text-[#C6A87C] transition-colors">
                    {data.artist.name}
                </h2>
                <p className="text-stone-500 italic mt-1">{data.artist.nationality}</p>
                <div className="mt-4 text-xs font-bold text-[#C6A87C] opacity-0 group-hover:opacity-100 transition-opacity">
                    View Artist Profile →
                </div>
            </div>
        )}
      </div>
    </main>
  );
}