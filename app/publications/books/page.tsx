import { PublicationCategoryPage } from "@/components/publication-category-page";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Books & E-books",
  description: "Books and free e-books published by Greenalaya Nepal.",
  path: "/publications/books",
});

export const revalidate = 300;
export const dynamic = "force-static";

export default function BooksPage() {
  return <PublicationCategoryPage category="books" />;
}
