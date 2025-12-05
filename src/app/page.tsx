"use client";

import { useState, useEffect, Suspense } from "react";
import { Loader2, MoveRight, Database } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

// Tipe data
interface SearchResult {
  id: number | string;
  type: string;
  label: string;
  score: number;
  details: {
    artist_name_raw?: string;
    url?: string;
    bio?: string;
    nationality?: string;
    title?: string;
    years?: string;
  };
}

function SearchContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [query, setQuery] = useState(searchParams.get("q") || "");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const performSearch = async (searchTerm: string) => {
    if (!searchTerm.trim()) return;

    setLoading(true);
    setHasSearched(true);
    setResults([]);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/search?q=${searchTerm}`);
      const data = await res.json();
      setResults(data.results || []);
    } catch (error) {
      console.error("Connection Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const urlQuery = searchParams.get("q");
    if (urlQuery) {
      setQuery(urlQuery); 
      performSearch(urlQuery);
    } else {
      setHasSearched(false);
      setResults([]);
      setQuery("");
    }
  }, [searchParams]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/?q=${encodeURIComponent(query)}`);
    }
  };

  return (
    <div className="flex flex-col items-center w-full relative">
      
      {/* --- ADMIN LINK (Top Right) --- */}
      <div className="absolute top-0 right-0 w-full flex justify-end">
        <Link 
          href="/run-cypher" 
          className="flex items-center gap-2 text-stone-400 hover:text-stone-800 transition-colors opacity-60 hover:opacity-100 p-2"
          title="Run Custom Cypher Queries"
        >
          <span className="text-[10px] font-sans uppercase tracking-widest hidden sm:block">Console</span>
          <Database className="w-4 h-4" />
        </Link>
      </div>

      {/* --- HERO SECTION --- */}
      <div className={`transition-all duration-700 ease-in-out flex flex-col items-center w-full max-w-4xl ${hasSearched ? "mt-0 mb-12" : "mt-[25vh]"}`}>
        
        <h1 className="font-serif text-6xl md:text-8xl font-medium tracking-tighter mb-2 text-stone-900">
          Curator<span className="text-stone-400">.</span>
        </h1>
        
        <p className={`font-cormorant text-2xl text-stone-500 mb-10 text-center font-light italic transition-opacity duration-500 ${hasSearched ? "opacity-0 h-0 overflow-hidden" : "opacity-100"}`}>
          "Every canvas is a journey through time."
        </p>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="relative w-full max-w-xl group">
          <input
            type="text"
            placeholder="Search artists, movements, or artworks..."
            className="w-full bg-transparent border-b-2 border-stone-300 py-3 text-2xl font-serif placeholder:text-stone-300 text-stone-800 focus:outline-none focus:border-stone-800 transition-colors"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button 
            type="submit"
            className="absolute right-0 top-3 text-stone-400 group-hover:text-stone-800 transition-colors"
            disabled={loading}
          >
            {loading ? <Loader2 className="animate-spin w-6 h-6" /> : <MoveRight className="w-6 h-6" />}
          </button>
        </form>

        {/* Tags */}
        {!hasSearched && (
           <div className="mt-6 flex gap-3 text-sm text-stone-400 font-sans">
             <span>Try:</span>
             <button onClick={() => router.push("/?q=Monet")} className="hover:text-stone-800 hover:underline">Monet</button>
             <button onClick={() => router.push("/?q=Portrait")} className="hover:text-stone-800 hover:underline">Portrait</button>
             <button onClick={() => router.push("/?q=Renaissance")} className="hover:text-stone-800 hover:underline">Renaissance</button>
           </div>
        )}
      </div>

      {/* --- GALLERY GRID --- */}
      <div className="w-full max-w-[1600px] animate-in fade-in slide-in-from-bottom-10 duration-1000">
        
        {hasSearched && !loading && results.length === 0 && (
          <div className="text-center py-20 border-t border-stone-200">
            <p className="font-serif text-3xl text-stone-300 italic">No artifacts found.</p>
            <p className="font-sans text-stone-400 mt-2">Try searching for "Picasso" or "Landscape"</p>
          </div>
        )}

        <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-8 space-y-8">
          {results.map((item, index) => (
            <div 
              key={`${item.id}-${index}`} 
              onClick={() => router.push(`/${item.type.toLowerCase()}/${encodeURIComponent(item.id.toString())}`)}
              className="break-inside-avoid bg-white p-5 rounded-sm shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-500 border border-[#E5E0D8] group cursor-pointer"
            >
              {item.type === "Artwork" && item.details.url && (
                <div className="relative overflow-hidden bg-stone-100 mb-4 aspect-auto">
                   <img 
                      src={item.details.url} 
                      alt={item.label}
                      className="w-full h-auto object-cover filter sepia-[0.2] group-hover:sepia-0 transition-all duration-700"
                      loading="lazy"
                      onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                   />
                </div>
              )}

              <div className="flex flex-col gap-1">
                <span className="text-[10px] uppercase tracking-[0.2em] text-stone-400 font-sans">
                  {item.type === 'Artist' ? 'Artist Profile' : 'Artwork'}
                </span>
                <h3 className="font-serif text-xl font-medium text-stone-900 leading-tight group-hover:underline decoration-1 underline-offset-4">
                  {item.label}
                </h3>
                <p className="font-cormorant text-lg text-stone-500 italic">
                   {item.type === "Artwork" ? item.details.artist_name_raw : item.details.nationality}
                </p>
                {item.type === "Artist" && item.details.bio && (
                  <p className="mt-4 text-xs font-sans text-stone-500 leading-relaxed line-clamp-4 border-l border-stone-300 pl-3">
                    {item.details.bio}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center px-6 py-12 md:py-20 bg-stone-50 text-stone-900">
      <Suspense fallback={<div className="text-center pt-20">Loading Curator...</div>}>
        <SearchContent />
      </Suspense>
    </main>
  );
}