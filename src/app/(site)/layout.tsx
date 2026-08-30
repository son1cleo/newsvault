import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

// The masthead shows today's real date and the archive changes whenever the
// admin publishes — never statically cache these routes.
export const dynamic = "force-dynamic";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SiteHeader />
      <main className="flex-1">{children}</main>
      <SiteFooter />
    </>
  );
}
