import { useRoute } from "wouter";
import { Loader2 } from "lucide-react";
import { usePage } from "@/hooks/useCMS";
import { SectionRenderer } from "@/components/sections";
import { SEO } from "@/components/SEO";

export default function DynamicPage() {
  const [, params] = useRoute("/:slug");
  const slug = params?.slug || "home";
  const { data: page, isLoading } = usePage(slug);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!page) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-4xl font-bold mb-4">Page Not Found</h1>
        <p className="text-muted-foreground">The page you're looking for doesn't exist.</p>
      </div>
    );
  }

  return (
    <div data-testid={`page-${page.slug}`}>
      <SEO 
        title={page.title} 
        description={`${page.title} - Downtown Irwin`}
        path={`/${page.slug}`}
      />
      {page.sections.map((section, index) => (
        <SectionRenderer key={index} section={section} />
      ))}
    </div>
  );
}
