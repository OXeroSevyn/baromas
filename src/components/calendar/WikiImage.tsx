import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";

interface WikiImageProps {
  query: string;
  fallbackEmoji?: string;
  className?: string;
}

export function WikiImage({ query, fallbackEmoji = "🎉", className = "" }: WikiImageProps) {
  const [imgUrl, setImgUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let isMounted = true;
    
    // Clean query: take the primary name before any dashes, parentheses or commas
    const cleanQuery = query.split(/[—\-\(\,]/)[0].trim();

    const fetchImage = async () => {
      try {
        // Try to get from cache first
        const cacheKey = `wiki_img:${cleanQuery}`;
        const cached = localStorage.getItem(cacheKey);
        if (cached) {
          setImgUrl(cached);
          setLoading(false);
          return;
        }

        const response = await fetch(
          `https://bn.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(cleanQuery.replace(/\s+/g, "_"))}`
        );
        
        if (response.ok) {
          const data = await response.json();
          const url = data.thumbnail?.source || data.originalimage?.source;
          if (url && isMounted) {
            setImgUrl(url);
            localStorage.setItem(cacheKey, url);
          } else {
            setError(true);
          }
        } else {
          // Try English Wikipedia as fallback for image
          const enResponse = await fetch(
            `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(query.replace(/\s+/g, "_"))}`
          );
          if (enResponse.ok) {
            const enData = await enResponse.json();
            const url = enData.thumbnail?.source || enData.originalimage?.source;
            if (url && isMounted) {
              setImgUrl(url);
              localStorage.setItem(cacheKey, url);
            } else {
              setError(true);
            }
          } else {
            setError(true);
          }
        }
      } catch (err) {
        if (isMounted) setError(true);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchImage();
    return () => { isMounted = false; };
  }, [query]);

  if (loading) {
    return (
      <div className={`flex items-center justify-center bg-secondary/20 ${className}`}>
        <Loader2 className="h-4 w-4 animate-spin text-primary/40" />
      </div>
    );
  }

  if (error || !imgUrl) {
    return (
      <div className={`flex items-center justify-center bg-gradient-to-br from-primary/5 to-accent/5 ${className}`}>
        <span className="text-3xl drop-shadow-sm">{fallbackEmoji}</span>
      </div>
    );
  }

  return (
    <img 
      src={imgUrl} 
      alt={query} 
      className={`h-full w-full object-cover transition-opacity duration-300 ${className}`} 
      onLoad={(e) => (e.currentTarget.style.opacity = "1")}
      style={{ opacity: 0 }}
    />
  );
}
