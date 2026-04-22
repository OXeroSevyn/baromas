export interface Recipe {
  ritu: string;
  name: string;
  description: string;
  image?: string;
}

export const RECIPES: Recipe[] = [
  { ritu: "গ্রীষ্ম", name: "আম পান্না", description: "কাঁচা আমের ঠাণ্ডা পানীয় — গরমে স্বস্তি।", image: "/branding/recipes/aam-panna.png" },
  { ritu: "গ্রীষ্ম", name: "পান্তা ভাত", description: "নববর্ষের ঐতিহ্য — পান্তা, ইলিশ ও কাঁচা মরিচ।", image: "/branding/recipes/panta-bhat.png" },
  { ritu: "বর্ষা", name: "খিচুড়ি ও ইলিশ ভাজা", description: "বর্ষার দিনে গরম খিচুড়ির স্বাদ।", image: "/branding/recipes/khichuri.png" },
  { ritu: "বর্ষা", name: "মুড়ি-চানাচুর", description: "বৃষ্টির বিকেলে মুচমুচে নাশতা।", image: "/branding/recipes/muri.png" },
  { ritu: "শরৎ", name: "শিউলি ফুলের চাটনি", description: "শারদীয় গন্ধে ভরা মিষ্টি-টক চাটনি।", image: "/branding/recipes/shiuli-chatni.png" },
  { ritu: "শরৎ", name: "নারকেল নাড়ু", description: "পুজোর প্রসাদ — নারকেল ও গুড়।", image: "/branding/recipes/narkel-naru.png" },
  { ritu: "হেমন্ত", name: "নবান্ন পায়েস", description: "নতুন চালের পায়েস, হেমন্তের উৎসব।", image: "/branding/recipes/payesh.png" },
  { ritu: "হেমন্ত", name: "চিতই পিঠা", description: "নতুন চালের পিঠা গুড়ের সাথে।", image: "/branding/recipes/chitoi.png" },
  { ritu: "শীত", name: "ভাপা পিঠা", description: "শীতের সকালে গরম ভাপা পিঠা।", image: "/branding/recipes/bhapa.png" },
  { ritu: "শীত", name: "নলেন গুড়ের সন্দেশ", description: "শীতের খেজুর গুড়ের মিষ্টি।", image: "/branding/recipes/sondesh.png" },
  { ritu: "বসন্ত", name: "বাসন্তী পোলাও", description: "বসন্তের রঙিন মিষ্টি পোলাও।", image: "/branding/recipes/polao.png" },
  { ritu: "বসন্ত", name: "মালপোয়া", description: "দোলযাত্রার মিষ্টি।", image: "/branding/recipes/malpua.png" },
];

export function recipeForRitu(ritu: string): Recipe {
  const list = RECIPES.filter((r) => r.ritu === ritu);
  if (!list.length) return RECIPES[0];
  const seed = Math.floor(Date.now() / 86400000);
  return list[seed % list.length];
}
