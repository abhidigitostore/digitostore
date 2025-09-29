// web/app/api/add-category/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@sanity/client';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

const writeClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  token: process.env.SANITY_API_TOKEN!,
  useCdn: false,
  apiVersion: '2024-07-30',
});

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { title } = await request.json();
    if (!title) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 });
    }
    
    const slug = {
      _type: 'slug',
      current: title.toLowerCase().replace(/\s+/g, '-').slice(0, 96),
    };

    // Create the document only ONCE
    await writeClient.create({
      _type: 'category',
      title: title,
      slug: slug,
    });
    
    return NextResponse.json({ success: true, message: 'Category created' });
  } catch (error) {
    console.error('Error creating category:', error);
    return NextResponse.json({ error: 'Failed to create category' }, { status: 500 });
  }
}