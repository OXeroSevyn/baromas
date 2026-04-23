/**
 * RSS Fetcher Utility
 * Fetches and parses RSS feeds using a CORS proxy.
 * This is an "open-source" alternative to commercial news APIs.
 */

const CORS_PROXY = "https://api.allorigins.win/get?url=";

const BENGALI_FEEDS = {
  abp: "https://bengali.abplive.com/home/feed",
  news18: "https://bengali.news18.com/rss/state.xml",
  news18_kolkata: "https://bengali.news18.com/rss/kolkata.xml",
  google: "https://news.google.com/rss/search?q=West+Bengal&hl=bn&gl=IN&ceid=IN:bn",
  zeenews: "https://zeenews.india.com/bengali/rss/west-bengal-news.xml",
  etv: "https://www.etvbharat.com/bengali/west-bengal/rss"
};

export interface RSSItem {
  id: string;
  title: string;
  description: string;
  link: string;
  image: string;
  source: string;
  time: string;
  category: string;
}

const isBengali = (text: string): boolean => {
  const bengaliRegex = /[\u0980-\u09FF]/;
  return bengaliRegex.test(text);
};

export async function fetchBengaliNewsRSS(category: string = "top"): Promise<RSSItem[]> {
  const feedsToTry = category === "top" 
    ? [BENGALI_FEEDS.abp, BENGALI_FEEDS.news18, BENGALI_FEEDS.zeenews, BENGALI_FEEDS.google] 
    : [BENGALI_FEEDS[category as keyof typeof BENGALI_FEEDS] || BENGALI_FEEDS.abp];
  
  let allResults: RSSItem[] = [];

  for (const feedUrl of feedsToTry) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);
      
      const response = await fetch(`${CORS_PROXY}${encodeURIComponent(feedUrl)}`, { signal: controller.signal });
      clearTimeout(timeoutId);
      
      if (!response.ok) continue;
      
      const json = await response.json();
      const xmlText = json.contents;
      
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(xmlText, "text/xml");
      const items = xmlDoc.querySelectorAll("item");
      
      const results: RSSItem[] = Array.from(items).map((item, idx) => {
        const title = item.querySelector("title")?.textContent || "";
        const descriptionRaw = item.querySelector("description")?.textContent || "";
        const description = descriptionRaw.replace(/<[^>]*>?/gm, '');
        
        if (!isBengali(title)) return null;

        const link = item.querySelector("link")?.textContent || "#";
        const pubDate = item.querySelector("pubDate")?.textContent || new Date().toISOString();
        
        let source = "সংবাদ";
        if (feedUrl.includes("abplive")) source = "ABP Ananda";
        else if (feedUrl.includes("news18")) source = "News18 Bengali";
        else if (feedUrl.includes("zeenews")) source = "Zee 24 Ghanta";
        else if (feedUrl.includes("google")) source = "Google News";
        
        // --- IMPROVED IMAGE EXTRACTION ---
        let image = "";
        
        // 1. Check media:content (Namespaced or not)
        const mediaElements = item.getElementsByTagNameNS("*", "content");
        if (mediaElements.length > 0) {
           image = mediaElements[0].getAttribute("url") || "";
        }
        
        // 2. Check enclosure
        if (!image) {
          const enclosure = item.querySelector("enclosure");
          if (enclosure) image = enclosure.getAttribute("url") || "";
        }

        // 3. Check media:thumbnail
        if (!image) {
          const thumb = item.getElementsByTagNameNS("*", "thumbnail")[0];
          if (thumb) image = thumb.getAttribute("url") || "";
        }
        
        // 4. Regex from description HTML
        if (!image) {
          const imgMatch = descriptionRaw.match(/<img[^>]+src="([^">]+)"/);
          if (imgMatch) image = imgMatch[1];
        }
        
        // 5. Check content:encoded if available
        if (!image) {
          const contentEncoded = item.getElementsByTagNameNS("*", "encoded")[0]?.textContent || "";
          const imgMatch = contentEncoded.match(/<img[^>]+src="([^">]+)"/);
          if (imgMatch) image = imgMatch[1];
        }

        // --- FALLBACK IMAGES (Bengali / West Bengal themed) ---
        if (!image || image.includes("spacer.gif")) {
          const fallbacks = [
            "https://images.unsplash.com/photo-1558431382-27e39cbef4bc?q=80&w=2070&auto=format&fit=crop", // Victoria Memorial
            "https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?q=80&w=2070&auto=format&fit=crop", // Howrah Bridge
            "https://images.unsplash.com/photo-1540611025311-01df3cef54b5?q=80&w=2070&auto=format&fit=crop", // Bengali Food
            "https://images.unsplash.com/photo-1582103287241-2762adba6c36?q=80&w=2070&auto=format&fit=crop", // Kolkata Street
            "https://images.unsplash.com/photo-1626014303757-6ec6a385594d?q=80&w=2070&auto=format&fit=crop"  // Darjeeling
          ];
          image = fallbacks[idx % fallbacks.length];
        }

        return {
          id: `rss-${idx}-${Math.random().toString(36).substr(2, 5)}`,
          title,
          description: description.substring(0, 160) + "...",
          link,
          image,
          source,
          time: pubDate,
          category
        };
      }).filter(Boolean) as RSSItem[];

      allResults = [...allResults, ...results];
      if (allResults.length >= 40) break;
    } catch (error) {
      console.error(`RSS Fetch Error for ${feedUrl}:`, error);
    }
  }

  return allResults.sort(() => 0.5 - Math.random()).slice(0, 25);
}
