import "dotenv/config";
import { db } from "./index";
import { articles } from "./schema";
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

type SeedArticle = {
  title: string;
  excerpt: string;
  category: string;
  author: string;
  publishedDate: string; // YYYY-MM-DD
  paragraphs: string[];
};

const seedArticles: SeedArticle[] = [
  {
    title: "Harbor District Rezoning Clears Final Council Vote",
    excerpt: "After eighteen months of hearings, the city council approved mixed-use zoning for the old harbor warehouses.",
    category: "Local",
    author: "M. Okonkwo",
    publishedDate: "2023-01-14",
    paragraphs: [
      "The city council voted 6-3 late Tuesday to rezone eleven blocks of the harbor district, clearing the way for a mix of housing, retail, and light industrial use in buildings that have sat mostly vacant since the shipping terminal relocated a decade ago.",
      "Supporters called it overdue; opponents warned of displacement in the adjacent rowhouse blocks. The ordinance takes effect in sixty days.",
    ],
  },
  {
    title: "Regional Wheat Yields Beat Forecasts Despite Dry Spring",
    excerpt: "Grain elevators report the strongest harvest in six years, crediting new drought-resistant seed varieties.",
    category: "Business",
    author: "T. Reyes",
    publishedDate: "2023-03-03",
    paragraphs: [
      "Despite one of the driest springs on record, wheat yields across the tri-county area came in nearly nine percent above the five-year average, according to figures released by the regional grain cooperative.",
      "Agronomists point to newer drought-tolerant cultivars adopted widely last planting season, though some farmers credit little more than luck with late-season rain.",
    ],
  },
  {
    title: "City Pool Reopens After Two-Year Filtration Overhaul",
    excerpt: "The municipal pool's long-delayed renovation is finally complete, just in time for the solstice.",
    category: "Local",
    author: "J. Park",
    publishedDate: "2023-06-21",
    paragraphs: [
      "Lines formed before dawn Wednesday as the municipal pool reopened after a filtration system overhaul that ran nearly a year past its original schedule.",
      "Parks officials apologized for the delay, attributing it to supply shortages for the specialized piping the new system required.",
    ],
  },
  {
    title: "Startup's Battery Recycling Process Wins State Innovation Grant",
    excerpt: "A three-person team says its low-heat extraction method recovers 92 percent of lithium from spent cells.",
    category: "Technology",
    author: "A. Feldman",
    publishedDate: "2023-09-09",
    paragraphs: [
      "A small startup working out of a converted machine shop was awarded the state's annual clean-technology grant this week for a battery recycling process that operates at far lower temperatures than industry-standard smelting.",
      "The company says the method recovers over ninety percent of usable lithium and expects to begin pilot production next year.",
    ],
  },
  {
    title: "Symphony Announces Search for New Music Director",
    excerpt: "The orchestra begins its search after its longtime director's retirement was announced this fall.",
    category: "Culture",
    author: "R. Alvarez",
    publishedDate: "2023-11-30",
    paragraphs: [
      "The philharmonic board has opened a formal search for a new music director following the retirement announcement of its conductor of nineteen years.",
      "A search committee of musicians, board members, and community representatives will review candidates through the coming concert season.",
    ],
  },
  {
    title: "New Ferry Route Cuts Commute Times Across the Bay",
    excerpt: "The first weekday sailing carried commuters in just under twenty-two minutes, roughly half the bridge drive.",
    category: "Local",
    author: "M. Okonkwo",
    publishedDate: "2024-02-05",
    paragraphs: [
      "The transit authority's newest ferry route began weekday service Monday, cutting the crossing to just under twenty-two minutes — about half the time of the equivalent bridge commute during rush hour.",
      "Officials say ridership projections will determine whether a second vessel is added to the route by year's end.",
    ],
  },
  {
    title: "Researchers Sequence Genome of Rare Cave-Dwelling Beetle",
    excerpt: "The species, found in only one limestone system, may hold clues to metabolic adaptation in low-oxygen environments.",
    category: "Science",
    author: "Dr. L. Chen",
    publishedDate: "2024-04-18",
    paragraphs: [
      "A university research team has completed the first full genome sequencing of a beetle species found exclusively in a single limestone cave system, more than four hundred meters below the surface.",
      "Early analysis points to unusual metabolic pathways that may help explain how the species survives in near-total darkness and low oxygen.",
    ],
  },
  {
    title: "Downtown Fireworks Return After Three-Year Budget Hiatus",
    excerpt: "The display was funded this year through a mix of city funds and private sponsorship after years of cancellations.",
    category: "Local",
    author: "J. Park",
    publishedDate: "2024-07-04",
    paragraphs: [
      "The waterfront fireworks display returned Thursday night after a three-year absence caused by budget shortfalls, drawing what police estimated as the largest crowd since before the hiatus began.",
      "This year's show was funded through a combination of city funds and sponsorships from four local businesses.",
    ],
  },
  {
    title: "Semiconductor Plant Breaks Ground on Second Phase",
    excerpt: "The expansion is expected to add nearly 1,200 jobs over the next three years, company officials say.",
    category: "Business",
    author: "T. Reyes",
    publishedDate: "2024-08-22",
    paragraphs: [
      "Construction began this week on the second phase of the semiconductor fabrication plant east of the county line, an expansion company officials say will add roughly twelve hundred jobs over three years.",
      "The project received a package of state tax incentives approved last legislative session.",
    ],
  },
  {
    title: "Local Theater's Restoration Reveals Original 1920s Murals",
    excerpt: "Workers found the painted ceiling panels beneath decades of drop-ceiling tile during asbestos remediation.",
    category: "Culture",
    author: "R. Alvarez",
    publishedDate: "2024-10-31",
    paragraphs: [
      "Crews restoring the century-old Regal Theater discovered a set of painted ceiling murals thought lost since a 1962 renovation, hidden for decades above a drop-ceiling installed during asbestos remediation work.",
      "Preservationists are now working to determine whether the murals can be stabilized and displayed once the restoration is complete.",
    ],
  },
  {
    title: "County Library System Expands Weekend Hours Citywide",
    excerpt: "All twelve branches will now open Saturdays and Sundays following a pilot program's strong turnout.",
    category: "Local",
    author: "M. Okonkwo",
    publishedDate: "2024-12-12",
    paragraphs: [
      "Every branch of the county library system will open on weekends starting next month, following a year-long pilot at four locations that officials say saw turnout exceed projections by nearly forty percent.",
      "The expansion was funded through a reallocation of the system's existing budget rather than new appropriations.",
    ],
  },
  {
    title: "Longitudinal Study Links Neighborhood Green Space to Lower Blood Pressure",
    excerpt: "Researchers tracked over 4,000 residents across a decade, controlling for income and pre-existing conditions.",
    category: "Science",
    author: "Dr. L. Chen",
    publishedDate: "2026-01-09",
    paragraphs: [
      "A decade-long study following more than four thousand residents has found a consistent association between proximity to neighborhood green space and lower average blood pressure, even after controlling for income and pre-existing conditions.",
      "The authors caution the study shows correlation, not causation, but say the effect size was large enough to warrant further controlled research.",
    ],
  },
  {
    title: "Transit Authority Pilots Fare-Free Month for Frequent Riders",
    excerpt: "The program targets commuters who already ride at least sixteen days a month, aiming to measure retention.",
    category: "Local",
    author: "J. Park",
    publishedDate: "2026-03-15",
    paragraphs: [
      "The regional transit authority launched a fare-free pilot this week for riders who logged at least sixteen trips in the prior month, part of an effort to study whether removing cost barriers improves long-term retention among already-frequent commuters.",
      "Results from the pilot are expected to inform a broader fare policy review next year.",
    ],
  },
  {
    title: "Independent Bookstore Marks Fortieth Year With Community Rewrite of Its Storefront",
    excerpt: "Longtime customers were invited to hand-letter favorite quotes across the shop's front windows.",
    category: "Culture",
    author: "R. Alvarez",
    publishedDate: "2026-05-27",
    paragraphs: [
      "The corner bookstore marked forty years in business Saturday by inviting longtime customers to hand-letter favorite quotes across its front windows, replacing a planned professional mural after the owner decided the shop's history belonged to its regulars.",
      "The windows will stay as-is through the end of the month before the shop's usual seasonal display returns.",
    ],
  },
  {
    title: "Utility Cooperative Completes Substation Hardening Ahead of Storm Season",
    excerpt: "The three-year, $40 million project targeted the six substations most prone to weather-related outages.",
    category: "Business",
    author: "T. Reyes",
    publishedDate: "2026-08-30",
    paragraphs: [
      "The regional utility cooperative completed a three-year, forty-million-dollar hardening project this week across the six substations historically most prone to weather-related outages, ahead of the season's projected storm activity.",
      "Cooperative officials said the work is expected to cut storm-related outage duration in the affected service areas by roughly half.",
    ],
  },
];

async function main() {
  console.log(`Seeding ${seedArticles.length} articles…`);

  for (const article of seedArticles) {
    const slug = slugify(article.title);
    await db
      .insert(articles)
      .values({
        title: article.title,
        slug,
        excerpt: article.excerpt,
        body: doc(article.paragraphs),
        category: article.category,
        coverImageUrl: `https://picsum.photos/seed/${slug}/1200/675`,
        publishedDate: new Date(`${article.publishedDate}T12:00:00.000Z`),
        status: "published",
        author: article.author,
      })
      .onConflictDoNothing({ target: articles.slug });
  }

  console.log("Done.");
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
