// src/app/api/upload/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';

// Cloudinary konfigurācija
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true
});

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const folder = formData.get('folder') as string || 'sdkthunder';
    
    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Konvertējam failu uz base64
    const fileBuffer = await file.arrayBuffer();
    const base64String = Buffer.from(fileBuffer).toString('base64');
    const dataURI = `data:${file.type};base64,${base64String}`;
    
    // Augšupielādējam uz Cloudinary
    const result = await cloudinary.uploader.upload(dataURI, {
      folder: folder,
      resource_type: 'auto'
    });

    return NextResponse.json({
      url: result.secure_url,
      publicId: result.public_id,
      width: result.width,
      height: result.height
    });
  } catch (error) {
    console.error('Error uploading to Cloudinary:', error);
    return NextResponse.json(
      { error: 'Failed to upload file' },
      { status: 500 }
    );
  }
}