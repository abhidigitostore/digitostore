// web/app/api/upload/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@sanity/client';

const writeClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  token: process.env.SANITY_API_TOKEN!,
  useCdn: false,
  apiVersion: '2024-07-30',
});

export async function POST(request: NextRequest) {
  try {
    const data = await request.formData();
    const title = data.get('title') as string;
    const description = data.get('description') as string;
    const price = parseFloat(data.get('price') as string);
    const file = data.get('dataFile') as File;
    const categoryId = data.get('categoryId') as string;
    const image = data.get('mainImage') as File;

    if (!file || !title || !price || !categoryId || !image) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Upload the file asset to Sanity
    const [fileAsset, imageAsset] = await Promise.all([
      writeClient.assets.upload('file', file, { filename: file.name }),
      writeClient.assets.upload('image', image),
    ]);

    // Create a new document in Sanity
    await writeClient.create({
      _type: 'documents',
      title: title,
      description: description,
      price: price,
      dataFile: {
        _type: 'file',
        asset: {
          _type: 'reference',
          _ref: fileAsset._id,
        },
      },
      mainImage: {
        _type: 'image',
        asset: { _type: 'reference', _ref: imageAsset._id },
      },
      category: {
        _type: 'reference',
        _ref: categoryId,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Upload Error:', error);
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}