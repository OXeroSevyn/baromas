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
  etv: "https://www.etvbharat.com/bengali/west-bengal/rss",
  bartaman: "https://bartamanpatrika.com/rss/feed.php",
  sangbadpratidin: "https://www.sangbadpratidin.in/feed/",
  oneindia: "https://bengali.oneindia.com/rss/bengali-news-fb.xml"
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

const PROXIES = [
  "https://api.allorigins.win/get?url=",
  "https://corsproxy.io/?",
];

const isBengali = (text: string): boolean => {
  const bengaliRegex = /[\u0980-\u09FF]/;
  return bengaliRegex.test(text);
};

async function fetchWithFallback(url: string): Promise<string | null> {
  // Try each proxy in order for this specific URL
  for (const proxyBase of PROXIES) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 6000); // Shorter timeout for faster feedback
      
      const targetUrl = proxyBase.includes("allorigins") 
        ? `${proxyBase}${encodeURIComponent(url)}`
        : `${proxyBase}${url}`;
        
      const response = await fetch(targetUrl, { signal: controller.signal });
      clearTimeout(timeoutId);
      
      if (!response.ok) continue;
      
      if (proxyBase.includes("allorigins")) {
        const json = await response.json();
        return json.contents || null;
      } else {
        return await response.text();
      }
    } catch (e) {
      console.warn(`Proxy ${proxyBase} failed for ${url}:`, e.message);
      continue;
    }
  }
  return null;
}

export async function fetchBengaliNewsRSS(category: string = "top"): Promise<RSSItem[]> {
  const feedsToTry = category === "top" 
    ? [
        BENGALI_FEEDS.abp, 
        BENGALI_FEEDS.news18, 
        BENGALI_FEEDS.zeenews, 
        BENGALI_FEEDS.bartaman,
        BENGALI_FEEDS.sangbadpratidin,
        BENGALI_FEEDS.google,
        BENGALI_FEEDS.oneindia
      ] 
    : [BENGALI_FEEDS[category as keyof typeof BENGALI_FEEDS] || BENGALI_FEEDS.abp];
  
  // Fetch all feeds in PARALLEL
  const fetchPromises = feedsToTry.map(async (feedUrl) => {
    const xmlText = await fetchWithFallback(feedUrl);
    if (!xmlText) return [];

    try {
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(xmlText, "text/xml");
      const items = xmlDoc.querySelectorAll("item");
      
      return Array.from(items).map((item, idx) => {
        const title = item.querySelector("title")?.textContent || "";
        const descriptionRaw = item.querySelector("description")?.textContent || "";
        const description = descriptionRaw.replace(/<[^>]*>?/gm, '').trim();
        
        if (!isBengali(title)) return null;

        const link = item.querySelector("link")?.textContent || "#";
        const pubDate = item.querySelector("pubDate")?.textContent || new Date().toISOString();
        
        let source = "সংবাদ";
        if (feedUrl.includes("abplive")) source = "ABP Ananda";
        else if (feedUrl.includes("news18")) source = "News18 Bengali";
        else if (feedUrl.includes("zeenews")) source = "Zee 24 Ghanta";
        else if (feedUrl.includes("google")) source = "Google News";
        else if (feedUrl.includes("bartaman")) source = "Bartaman";
        else if (feedUrl.includes("sangbadpratidin")) source = "Sangbad Pratidin";
        else if (feedUrl.includes("oneindia")) source = "OneIndia Bengali";
        
        let image = "";
        const mediaElements = item.getElementsByTagNameNS("*", "content");
        if (mediaElements.length > 0) image = mediaElements[0].getAttribute("url") || "";
        
        if (!image) {
          const enclosure = item.querySelector("enclosure");
          if (enclosure) image = enclosure.getAttribute("url") || "";
        }

        if (!image) {
          const thumb = item.getElementsByTagNameNS("*", "thumbnail")[0];
          if (thumb) image = thumb.getAttribute("url") || "";
        }
        
        if (!image) {
          const imgMatch = descriptionRaw.match(/<img[^>]+src="([^">]+)"/);
          if (imgMatch) image = imgMatch[1];
        }
        
        if (!image) {
          const fallbacks = [
            "https://images.unsplash.com/photo-1558431382-27e39cbef4bc?q=80&w=1000&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?q=80&w=1000&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1540611025311-01df3cef54b5?q=80&w=1000&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1582103287241-2762adba6c36?q=80&w=1000&auto=format&fit=crop"
          ];
          image = fallbacks[idx % fallbacks.length];
        }

        return {
          id: `rss-${Math.random().toString(36).substr(2, 9)}`,
          title,
          description: description.substring(0, 160) + (description.length > 160 ? "..." : ""),
          link,
          image,
          source,
          time: pubDate,
          category
        };
      }).filter(Boolean) as RSSItem[];
    } catch (e) {
      return [];
    }
  });

  const resultsArray = await Promise.all(fetchPromises);
  const combinedResults = resultsArray.flat();
  
  // Sort by date (descending)
  return combinedResults
    .sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())
    .slice(0, 40);
}
