import "dotenv/config";
import { db } from "./index";
import { articles, articleTranslations } from "./schema";
import { slugify } from "@/lib/slug";
import type { JSONContent } from "@tiptap/core";

function doc(paragraphs: string[]): JSONContent {
  return {
    type: "doc",
    content: paragraphs.map((text) => ({
      type: "paragraph",
      content: [{ type: "text", text }],
    })),
  };
}

type LocaleContent = { title: string; excerpt: string; paragraphs: string[] };

type SeedArticle = {
  category: string; // canonical slug — see src/lib/category-labels.ts
  author: string;
  publishedDate: string; // YYYY-MM-DD
  en: LocaleContent;
  bn: LocaleContent;
};

const seedArticles: SeedArticle[] = [
  {
    category: "national",
    author: "M. Okonkwo",
    publishedDate: "2023-01-14",
    en: {
      title: "Harbor District Rezoning Clears Final Council Vote",
      excerpt: "After eighteen months of hearings, the city council approved mixed-use zoning for the old harbor warehouses.",
      paragraphs: [
        "The city council voted 6-3 late Tuesday to rezone eleven blocks of the harbor district, clearing the way for a mix of housing, retail, and light industrial use in buildings that have sat mostly vacant since the shipping terminal relocated a decade ago.",
        "Supporters called it overdue; opponents warned of displacement in the adjacent rowhouse blocks. The ordinance takes effect in sixty days.",
      ],
    },
    bn: {
      title: "হারবার এলাকার পুনর্বিন্যাস পরিকল্পনায় কাউন্সিলের চূড়ান্ত অনুমোদন",
      excerpt: "আঠারো মাসের শুনানি শেষে সিটি কাউন্সিল পুরনো হারবার গুদামগুলোর জন্য মিশ্র ব্যবহারের অনুমোদন দিয়েছে।",
      paragraphs: [
        "মঙ্গলবার রাতে সিটি কাউন্সিল ৬-৩ ভোটে হারবার এলাকার এগারোটি ব্লক পুনর্বিন্যাসের পক্ষে ভোট দিয়েছে, যার ফলে দশ বছর আগে শিপিং টার্মিনাল সরে যাওয়ার পর থেকে প্রায় ফাঁকা পড়ে থাকা ভবনগুলোতে আবাসন, খুচরা ব্যবসা ও হালকা শিল্প স্থাপনের পথ খুলল।",
        "সমর্থকরা এটিকে বহুল প্রতীক্ষিত বলে অভিহিত করেছেন; বিরোধীরা পার্শ্ববর্তী আবাসিক এলাকায় উচ্ছেদের আশঙ্কা প্রকাশ করেছেন। অধ্যাদেশটি ষাট দিনের মধ্যে কার্যকর হবে।",
      ],
    },
  },
  {
    category: "economy",
    author: "T. Reyes",
    publishedDate: "2023-03-03",
    en: {
      title: "Regional Wheat Yields Beat Forecasts Despite Dry Spring",
      excerpt: "Grain elevators report the strongest harvest in six years, crediting new drought-resistant seed varieties.",
      paragraphs: [
        "Despite one of the driest springs on record, wheat yields across the tri-county area came in nearly nine percent above the five-year average, according to figures released by the regional grain cooperative.",
        "Agronomists point to newer drought-tolerant cultivars adopted widely last planting season, though some farmers credit little more than luck with late-season rain.",
      ],
    },
    bn: {
      title: "শুষ্ক মৌসুম সত্ত্বেও পূর্বাভাসের চেয়ে বেশি গম উৎপাদন",
      excerpt: "টানা ছয় বছরের মধ্যে সবচেয়ে ভালো ফলনের কথা জানিয়েছে শস্য গুদামগুলো, কৃতিত্ব দিচ্ছে নতুন খরা-সহিষ্ণু বীজের।",
      paragraphs: [
        "রেকর্ড অনুযায়ী সবচেয়ে শুষ্ক বসন্তগুলোর একটি হওয়া সত্ত্বেও, ত্রি-কাউন্টি এলাকায় গমের ফলন গত পাঁচ বছরের গড়ের তুলনায় প্রায় নয় শতাংশ বেশি হয়েছে বলে আঞ্চলিক শস্য সমবায়ের প্রকাশিত তথ্যে জানা গেছে।",
        "কৃষিবিদরা এর কৃতিত্ব দিচ্ছেন গত রোপণ মৌসুমে ব্যাপকভাবে গৃহীত নতুন খরা-সহিষ্ণু জাতগুলোকে, যদিও কিছু কৃষক এর পেছনে মৌসুমের শেষ দিকের বৃষ্টিকে সৌভাগ্য হিসেবে দেখছেন।",
      ],
    },
  },
  {
    category: "national",
    author: "J. Park",
    publishedDate: "2023-06-21",
    en: {
      title: "City Pool Reopens After Two-Year Filtration Overhaul",
      excerpt: "The municipal pool's long-delayed renovation is finally complete, just in time for the solstice.",
      paragraphs: [
        "Lines formed before dawn Wednesday as the municipal pool reopened after a filtration system overhaul that ran nearly a year past its original schedule.",
        "Parks officials apologized for the delay, attributing it to supply shortages for the specialized piping the new system required.",
      ],
    },
    bn: {
      title: "দুই বছরের সংস্কার শেষে খুলল পৌর সুইমিং পুল",
      excerpt: "দীর্ঘ বিলম্বিত সংস্কার অবশেষে শেষ হলো, ঠিক গ্রীষ্মের শুরুতেই।",
      paragraphs: [
        "বুধবার ভোর হওয়ার আগেই পৌর সুইমিং পুলের সামনে দীর্ঘ লাইন পড়ে যায়, যখন এটি একটি পরিস্রাবণ ব্যবস্থা সংস্কারের পর পুনরায় চালু হয় — যা নির্ধারিত সময়ের প্রায় এক বছর পরে সম্পন্ন হলো।",
        "পার্ক কর্তৃপক্ষ বিলম্বের জন্য ক্ষমা প্রার্থনা করেছে, এর কারণ হিসেবে নতুন ব্যবস্থার জন্য প্রয়োজনীয় বিশেষায়িত পাইপের সরবরাহ সংকটকে দায়ী করেছে।",
      ],
    },
  },
  {
    category: "technology",
    author: "A. Feldman",
    publishedDate: "2023-09-09",
    en: {
      title: "Startup's Battery Recycling Process Wins State Innovation Grant",
      excerpt: "A three-person team says its low-heat extraction method recovers 92 percent of lithium from spent cells.",
      paragraphs: [
        "A small startup working out of a converted machine shop was awarded the state's annual clean-technology grant this week for a battery recycling process that operates at far lower temperatures than industry-standard smelting.",
        "The company says the method recovers over ninety percent of usable lithium and expects to begin pilot production next year.",
      ],
    },
    bn: {
      title: "রাজ্যের উদ্ভাবন অনুদান জিতল ব্যাটারি রিসাইক্লিং স্টার্টআপ",
      excerpt: "তিন সদস্যের একটি দল বলছে তাদের স্বল্প-তাপ পদ্ধতিতে ব্যবহৃত ব্যাটারি থেকে ৯২ শতাংশ লিথিয়াম পুনরুদ্ধার সম্ভব।",
      paragraphs: [
        "একটি রূপান্তরিত কারখানা থেকে কাজ করা ছোট স্টার্টআপ এই সপ্তাহে রাজ্যের বার্ষিক ক্লিন-টেকনোলজি অনুদান জিতেছে, তাদের ব্যাটারি রিসাইক্লিং পদ্ধতির জন্য, যা শিল্প-মানের গলানোর প্রক্রিয়ার চেয়ে অনেক কম তাপমাত্রায় কাজ করে।",
        "কোম্পানিটি জানিয়েছে এই পদ্ধতিতে ব্যবহারযোগ্য লিথিয়ামের নব্বই শতাংশের বেশি পুনরুদ্ধার সম্ভব এবং আগামী বছর থেকে পাইলট উৎপাদন শুরু হবে।",
      ],
    },
  },
  {
    category: "entertainment",
    author: "R. Alvarez",
    publishedDate: "2023-11-30",
    en: {
      title: "Symphony Announces Search for New Music Director",
      excerpt: "The orchestra begins its search after its longtime director's retirement was announced this fall.",
      paragraphs: [
        "The philharmonic board has opened a formal search for a new music director following the retirement announcement of its conductor of nineteen years.",
        "A search committee of musicians, board members, and community representatives will review candidates through the coming concert season.",
      ],
    },
    bn: {
      title: "নতুন সংগীত পরিচালক খুঁজছে সিম্ফনি অর্কেস্ট্রা",
      excerpt: "দীর্ঘদিনের পরিচালকের অবসরের ঘোষণার পর নতুন পরিচালক খোঁজা শুরু করেছে অর্কেস্ট্রাটি।",
      paragraphs: [
        "ফিলহারমোনিক বোর্ড আনুষ্ঠানিকভাবে নতুন সংগীত পরিচালক খোঁজা শুরু করেছে, উনিশ বছর ধরে দায়িত্ব পালনকারী পরিচালকের অবসরের ঘোষণার পর।",
        "সংগীতশিল্পী, বোর্ড সদস্য ও কমিউনিটি প্রতিনিধিদের নিয়ে গঠিত একটি অনুসন্ধান কমিটি আসন্ন কনসার্ট মৌসুম জুড়ে প্রার্থীদের যাচাই করবে।",
      ],
    },
  },
  {
    category: "national",
    author: "M. Okonkwo",
    publishedDate: "2024-02-05",
    en: {
      title: "New Ferry Route Cuts Commute Times Across the Bay",
      excerpt: "The first weekday sailing carried commuters in just under twenty-two minutes, roughly half the bridge drive.",
      paragraphs: [
        "The transit authority's newest ferry route began weekday service Monday, cutting the crossing to just under twenty-two minutes — about half the time of the equivalent bridge commute during rush hour.",
        "Officials say ridership projections will determine whether a second vessel is added to the route by year's end.",
      ],
    },
    bn: {
      title: "নতুন ফেরি রুটে কমলো উপসাগর পারাপারের সময়",
      excerpt: "সপ্তাহের প্রথম যাত্রায় যাত্রীরা মাত্র বাইশ মিনিটে পৌঁছেছেন, যা সেতু দিয়ে যাতায়াতের প্রায় অর্ধেক সময়।",
      paragraphs: [
        "পরিবহন কর্তৃপক্ষের নতুন ফেরি রুট সোমবার থেকে সপ্তাহের কর্মদিবসগুলোতে চালু হয়েছে, যাতে পারাপারের সময় নেমে এসেছে বাইশ মিনিটের নিচে — যা ব্যস্ত সময়ে সেতু দিয়ে সমতুল্য যাত্রার প্রায় অর্ধেক।",
        "কর্মকর্তারা বলছেন, যাত্রী সংখ্যার পূর্বাভাসের ওপর নির্ভর করবে বছরের শেষ নাগাদ দ্বিতীয় নৌযান যুক্ত হবে কিনা।",
      ],
    },
  },
  {
    category: "technology",
    author: "Dr. L. Chen",
    publishedDate: "2024-04-18",
    en: {
      title: "Researchers Sequence Genome of Rare Cave-Dwelling Beetle",
      excerpt: "The species, found in only one limestone system, may hold clues to metabolic adaptation in low-oxygen environments.",
      paragraphs: [
        "A university research team has completed the first full genome sequencing of a beetle species found exclusively in a single limestone cave system, more than four hundred meters below the surface.",
        "Early analysis points to unusual metabolic pathways that may help explain how the species survives in near-total darkness and low oxygen.",
      ],
    },
    bn: {
      title: "বিরল গুহাবাসী পোকার জিনোম সিকোয়েন্স করলেন গবেষকরা",
      excerpt: "একটি মাত্র চুনাপাথরের গুহা ব্যবস্থায় পাওয়া এই প্রজাতিটি স্বল্প-অক্সিজেন পরিবেশে বিপাকীয় অভিযোজনের সূত্র দিতে পারে।",
      paragraphs: [
        "একটি বিশ্ববিদ্যালয়ের গবেষক দল একটি পোকা প্রজাতির সম্পূর্ণ জিনোম সিকোয়েন্সিং সম্পন্ন করেছে, যা কেবল একটি চুনাপাথরের গুহা ব্যবস্থায়, ভূপৃষ্ঠের চারশো মিটারেরও বেশি নিচে পাওয়া যায়।",
        "প্রাথমিক বিশ্লেষণ থেকে জানা যাচ্ছে, প্রজাতিটির অস্বাভাবিক বিপাকীয় পথগুলো ব্যাখ্যা করতে সাহায্য করতে পারে কীভাবে এটি প্রায় সম্পূর্ণ অন্ধকার ও স্বল্প অক্সিজেনে টিকে থাকে।",
      ],
    },
  },
  {
    category: "national",
    author: "J. Park",
    publishedDate: "2024-07-04",
    en: {
      title: "Downtown Fireworks Return After Three-Year Budget Hiatus",
      excerpt: "The display was funded this year through a mix of city funds and private sponsorship after years of cancellations.",
      paragraphs: [
        "The waterfront fireworks display returned Thursday night after a three-year absence caused by budget shortfalls, drawing what police estimated as the largest crowd since before the hiatus began.",
        "This year's show was funded through a combination of city funds and sponsorships from four local businesses.",
      ],
    },
    bn: {
      title: "তিন বছর পর ফিরল ডাউনটাউনের আতশবাজি উৎসব",
      excerpt: "বাজেট সংকটে বছরের পর বছর বাতিল হওয়ার পর এবার শহরের তহবিল ও বেসরকারি পৃষ্ঠপোষকতার মাধ্যমে অর্থায়ন করা হয়েছে।",
      paragraphs: [
        "বাজেট সংকটের কারণে তিন বছর বন্ধ থাকার পর বৃহস্পতিবার রাতে ফিরে এলো ওয়াটারফ্রন্ট আতশবাজি প্রদর্শনী, পুলিশের হিসাবে যা বন্ধ হওয়ার আগের সময়ের পর সবচেয়ে বড় জনসমাগম টেনেছে।",
        "এ বছরের অনুষ্ঠানটি শহরের তহবিল ও চারটি স্থানীয় ব্যবসা প্রতিষ্ঠানের পৃষ্ঠপোষকতার সমন্বয়ে অর্থায়ন করা হয়েছে।",
      ],
    },
  },
  {
    category: "economy",
    author: "T. Reyes",
    publishedDate: "2024-08-22",
    en: {
      title: "Semiconductor Plant Breaks Ground on Second Phase",
      excerpt: "The expansion is expected to add nearly 1,200 jobs over the next three years, company officials say.",
      paragraphs: [
        "Construction began this week on the second phase of the semiconductor fabrication plant east of the county line, an expansion company officials say will add roughly twelve hundred jobs over three years.",
        "The project received a package of state tax incentives approved last legislative session.",
      ],
    },
    bn: {
      title: "দ্বিতীয় ধাপের নির্মাণ শুরু হলো সেমিকন্ডাক্টর কারখানায়",
      excerpt: "এই সম্প্রসারণে আগামী তিন বছরে প্রায় ১,২০০ নতুন কর্মসংস্থান তৈরি হবে বলে জানিয়েছেন কোম্পানির কর্মকর্তারা।",
      paragraphs: [
        "কাউন্টি সীমান্তের পূর্বে সেমিকন্ডাক্টর ফ্যাব্রিকেশন কারখানার দ্বিতীয় ধাপের নির্মাণকাজ এই সপ্তাহে শুরু হয়েছে, যার মাধ্যমে কোম্পানির কর্মকর্তাদের মতে আগামী তিন বছরে প্রায় ১,২০০ কর্মসংস্থান তৈরি হবে।",
        "গত আইনসভা অধিবেশনে অনুমোদিত রাজ্যের কর প্রণোদনার একটি প্যাকেজ প্রকল্পটি পেয়েছে।",
      ],
    },
  },
  {
    category: "entertainment",
    author: "R. Alvarez",
    publishedDate: "2024-10-31",
    en: {
      title: "Local Theater's Restoration Reveals Original 1920s Murals",
      excerpt: "Workers found the painted ceiling panels beneath decades of drop-ceiling tile during asbestos remediation.",
      paragraphs: [
        "Crews restoring the century-old Regal Theater discovered a set of painted ceiling murals thought lost since a 1962 renovation, hidden for decades above a drop-ceiling installed during asbestos remediation work.",
        "Preservationists are now working to determine whether the murals can be stabilized and displayed once the restoration is complete.",
      ],
    },
    bn: {
      title: "থিয়েটার সংস্কারে বেরিয়ে এলো ১৯২০ দশকের মূল দেয়ালচিত্র",
      excerpt: "অ্যাসবেস্টস অপসারণের কাজ চলাকালে সিলিং টাইলের নিচে পাওয়া গেছে রঙিন প্যানেলগুলো।",
      paragraphs: [
        "শতবর্ষী রিগ্যাল থিয়েটার সংস্কারকারী কর্মীরা এমন কিছু দেয়ালচিত্র খুঁজে পেয়েছেন যা ১৯৬২ সালের সংস্কারের পর থেকে হারিয়ে গেছে বলে ধারণা করা হতো, যা অ্যাসবেস্টস অপসারণ কাজের সময় বসানো ড্রপ-সিলিংয়ের ওপরে দশকের পর দশক লুকানো ছিল।",
        "সংরক্ষণবিদরা এখন নির্ধারণের চেষ্টা করছেন যে সংস্কার সম্পূর্ণ হলে দেয়ালচিত্রগুলো স্থিতিশীল করে প্রদর্শন করা সম্ভব কিনা।",
      ],
    },
  },
  {
    category: "national",
    author: "M. Okonkwo",
    publishedDate: "2024-12-12",
    en: {
      title: "County Library System Expands Weekend Hours Citywide",
      excerpt: "All twelve branches will now open Saturdays and Sundays following a pilot program's strong turnout.",
      paragraphs: [
        "Every branch of the county library system will open on weekends starting next month, following a year-long pilot at four locations that officials say saw turnout exceed projections by nearly forty percent.",
        "The expansion was funded through a reallocation of the system's existing budget rather than new appropriations.",
      ],
    },
    bn: {
      title: "শহরজুড়ে গ্রন্থাগারের সাপ্তাহিক ছুটির দিনের সময় বাড়ল",
      excerpt: "পাইলট কর্মসূচির সাফল্যের পর এখন থেকে বারোটি শাখাই শনি ও রবিবার খোলা থাকবে।",
      paragraphs: [
        "কাউন্টি গ্রন্থাগার ব্যবস্থার প্রতিটি শাখা আগামী মাস থেকে সপ্তাহান্তে খোলা থাকবে, চারটি স্থানে এক বছরব্যাপী চালানো পাইলট কর্মসূচির পর, যেখানে কর্মকর্তাদের মতে উপস্থিতি প্রত্যাশার চেয়ে প্রায় চল্লিশ শতাংশ বেশি ছিল।",
        "নতুন বরাদ্দ ছাড়াই বিদ্যমান বাজেট পুনর্বণ্টনের মাধ্যমে এই সম্প্রসারণের অর্থায়ন করা হয়েছে।",
      ],
    },
  },
  {
    category: "technology",
    author: "Dr. L. Chen",
    publishedDate: "2026-01-09",
    en: {
      title: "Longitudinal Study Links Neighborhood Green Space to Lower Blood Pressure",
      excerpt: "Researchers tracked over 4,000 residents across a decade, controlling for income and pre-existing conditions.",
      paragraphs: [
        "A decade-long study following more than four thousand residents has found a consistent association between proximity to neighborhood green space and lower average blood pressure, even after controlling for income and pre-existing conditions.",
        "The authors caution the study shows correlation, not causation, but say the effect size was large enough to warrant further controlled research.",
      ],
    },
    bn: {
      title: "সবুজ এলাকার সান্নিধ্যে কমে রক্তচাপ, বলছে দীর্ঘমেয়াদি গবেষণা",
      excerpt: "আয় ও পূর্ববর্তী স্বাস্থ্য অবস্থা নিয়ন্ত্রণ করেও চার হাজারের বেশি বাসিন্দার ওপর এক দশক ধরে চালানো হয়েছে গবেষণাটি।",
      paragraphs: [
        "চার হাজারেরও বেশি বাসিন্দার ওপর এক দশক ধরে চালানো একটি গবেষণায় দেখা গেছে, পাড়ার সবুজ এলাকার নৈকট্য ও গড় রক্তচাপ কমে যাওয়ার মধ্যে একটি সামঞ্জস্যপূর্ণ সম্পর্ক রয়েছে, এমনকি আয় ও পূর্ববর্তী স্বাস্থ্য অবস্থা নিয়ন্ত্রণ করার পরও।",
        "গবেষকরা সতর্ক করেছেন যে গবেষণাটি সহসম্পর্ক দেখায়, কার্যকারণ নয়, তবে এর প্রভাবের মাত্রা আরও নিয়ন্ত্রিত গবেষণার প্রয়োজনীয়তা তুলে ধরার মতো যথেষ্ট বড়।",
      ],
    },
  },
  {
    category: "national",
    author: "J. Park",
    publishedDate: "2026-03-15",
    en: {
      title: "Transit Authority Pilots Fare-Free Month for Frequent Riders",
      excerpt: "The program targets commuters who already ride at least sixteen days a month, aiming to measure retention.",
      paragraphs: [
        "The regional transit authority launched a fare-free pilot this week for riders who logged at least sixteen trips in the prior month, part of an effort to study whether removing cost barriers improves long-term retention among already-frequent commuters.",
        "Results from the pilot are expected to inform a broader fare policy review next year.",
      ],
    },
    bn: {
      title: "নিয়মিত যাত্রীদের জন্য ভাড়ামুক্ত মাসের পাইলট চালু করলো পরিবহন কর্তৃপক্ষ",
      excerpt: "যেসব যাত্রী মাসে অন্তত ষোলো দিন যাতায়াত করেন তাদের ধরে রাখার হার পরিমাপ করাই এই কর্মসূচির লক্ষ্য।",
      paragraphs: [
        "আঞ্চলিক পরিবহন কর্তৃপক্ষ এই সপ্তাহে একটি ভাড়ামুক্ত পাইলট কর্মসূচি চালু করেছে, যারা আগের মাসে অন্তত ষোলোবার যাতায়াত করেছেন তাদের জন্য, যার লক্ষ্য হলো খরচের বাধা দূর করলে ইতিমধ্যে নিয়মিত যাত্রীদের দীর্ঘমেয়াদি ধরে রাখার হার বাড়ে কিনা তা যাচাই করা।",
        "পাইলট কর্মসূচির ফলাফল আগামী বছর একটি ব্যাপক ভাড়া নীতি পর্যালোচনায় সহায়ক হবে বলে আশা করা হচ্ছে।",
      ],
    },
  },
  {
    category: "entertainment",
    author: "R. Alvarez",
    publishedDate: "2026-05-27",
    en: {
      title: "Independent Bookstore Marks Fortieth Year With Community Rewrite of Its Storefront",
      excerpt: "Longtime customers were invited to hand-letter favorite quotes across the shop's front windows.",
      paragraphs: [
        "The corner bookstore marked forty years in business Saturday by inviting longtime customers to hand-letter favorite quotes across its front windows, replacing a planned professional mural after the owner decided the shop's history belonged to its regulars.",
        "The windows will stay as-is through the end of the month before the shop's usual seasonal display returns.",
      ],
    },
    bn: {
      title: "চল্লিশ বছর পূর্তিতে ক্রেতাদের হাতের লেখায় সাজলো বইয়ের দোকানের জানালা",
      excerpt: "দীর্ঘদিনের ক্রেতাদের দোকানের সামনের জানালায় প্রিয় উক্তি হাতে লিখতে আমন্ত্রণ জানানো হয়েছিল।",
      paragraphs: [
        "কর্নার বইয়ের দোকানটি শনিবার তার ব্যবসার চল্লিশ বছর পূর্তি উদযাপন করেছে দীর্ঘদিনের ক্রেতাদের দোকানের সামনের জানালায় প্রিয় উক্তি হাতে লিখতে আমন্ত্রণ জানিয়ে, একটি পরিকল্পিত পেশাদার চিত্রকর্মের বদলে — কারণ মালিক মনে করেছেন দোকানের ইতিহাস তার নিয়মিত ক্রেতাদেরই প্রাপ্য।",
        "মাস শেষ হওয়া পর্যন্ত জানালাগুলো এভাবেই থাকবে, তারপর দোকানের চিরাচরিত মৌসুমি সজ্জা ফিরে আসবে।",
      ],
    },
  },
  {
    category: "economy",
    author: "T. Reyes",
    publishedDate: "2026-08-30",
    en: {
      title: "Utility Cooperative Completes Substation Hardening Ahead of Storm Season",
      excerpt: "The three-year, $40 million project targeted the six substations most prone to weather-related outages.",
      paragraphs: [
        "The regional utility cooperative completed a three-year, forty-million-dollar hardening project this week across the six substations historically most prone to weather-related outages, ahead of the season's projected storm activity.",
        "Cooperative officials said the work is expected to cut storm-related outage duration in the affected service areas by roughly half.",
      ],
    },
    bn: {
      title: "ঝড়ের মৌসুমের আগেই সাবস্টেশন সুরক্ষা কাজ সম্পন্ন করলো বিদ্যুৎ সমবায়",
      excerpt: "তিন বছরের এই ৪ কোটি ডলারের প্রকল্প আবহাওয়াজনিত বিদ্যুৎবিভ্রাটের জন্য সবচেয়ে ঝুঁকিপূর্ণ ছয়টি সাবস্টেশনকে লক্ষ্য করে চালানো হয়েছে।",
      paragraphs: [
        "আঞ্চলিক বিদ্যুৎ সমবায় এই সপ্তাহে তিন বছরের, চার কোটি ডলারের একটি প্রকল্প সম্পন্ন করেছে, যা আবহাওয়াজনিত বিদ্যুৎবিভ্রাটের জন্য ঐতিহাসিকভাবে সবচেয়ে ঝুঁকিপূর্ণ ছয়টি সাবস্টেশনকে ঘিরে চালানো হয়েছিল, মৌসুমের পূর্বাভাসিত ঝড়ের কার্যক্রমের আগে।",
        "সমবায় কর্মকর্তারা বলছেন, এই কাজের ফলে সংশ্লিষ্ট এলাকাগুলোতে ঝড়জনিত বিদ্যুৎবিভ্রাটের সময়কাল প্রায় অর্ধেক কমে আসবে বলে আশা করা হচ্ছে।",
      ],
    },
  },
];

async function main() {
  console.log(`Seeding ${seedArticles.length} articles (bn + en)…`);

  for (const article of seedArticles) {
    const slug = slugify(article.en.title);

    const [inserted] = await db
      .insert(articles)
      .values({
        slug,
        category: article.category,
        coverImageUrl: `https://picsum.photos/seed/${slug}/1200/675`,
        publishedDate: new Date(`${article.publishedDate}T12:00:00.000Z`),
        status: "published",
        author: article.author,
      })
      .onConflictDoNothing({ target: articles.slug })
      .returning({ id: articles.id });

    if (!inserted) continue; // already seeded

    await db.insert(articleTranslations).values([
      {
        articleId: inserted.id,
        locale: "en",
        title: article.en.title,
        excerpt: article.en.excerpt,
        body: doc(article.en.paragraphs),
      },
      {
        articleId: inserted.id,
        locale: "bn",
        title: article.bn.title,
        excerpt: article.bn.excerpt,
        body: doc(article.bn.paragraphs),
      },
    ]);
  }

  console.log("Done.");
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
