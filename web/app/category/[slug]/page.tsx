// web/app/category/[slug]/page.tsx
import { client } from '@/sanity/client';
import CategoryClientPage from './CategoryClientPage';

interface Params {
  params: {
    slug: string;
  };
}

const query = `*[_type == "category" && slug.current == $slug][0]{
  title,
  "documents": *[_type == "documents" && references(^._id)] | order(_createdAt desc){
    _id,
    title,
    description,
    price,
    "imageUrl": mainImage.asset->url
  }
}`;

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params; // Await the promise to get the actual object
  const { slug } = resolvedParams;
  const categoryData = await client.fetch(query, { slug });
  if (!categoryData) {
    // You can add a proper 404 page later
    return <div>Category not found</div>;
  }

  return (
    <CategoryClientPage 
      title={categoryData.title} 
      documents={categoryData.documents} 
    />
  );
}