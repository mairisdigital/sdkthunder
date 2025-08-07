import { NextRequest, NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';

// Cloudinary konfigurācija
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
  secure: true
});

export async function POST(request: NextRequest) {
  try {
    // Pārbaudām vai ir konfigurācija
    if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
      console.error('Cloudinary environment variables are missing');
      return NextResponse.json(
        { error: 'Cloudinary configuration is missing' },
        { status: 500 }
      );
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;
    const folder = formData.get('folder') as string || 'sdkthunder';
    
    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Validējam faila tipu
    if (!file.type.startsWith('image/')) {
      return NextResponse.json(
        { error: 'Only image files are allowed' },
        { status: 400 }
      );
    }

    // Validējam faila izmēru (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'File size too large. Maximum 5MB allowed.' },
        { status: 400 }
      );
    }

    // Izveidojam īsāku, tīrāku faila nosaukumu
    const timestamp = Date.now();
    const cleanFileName = file.name.replace(/[^a-zA-Z0-9]/g, '').substring(0, 20);
    const publicId = `${timestamp}_${cleanFileName}`;

    console.log('Uploading file:', {
      originalName: file.name,
      publicId: publicId,
      type: file.type,
      size: file.size,
      folder: folder
    });

    // Konvertējam failu uz base64
    const fileBuffer = await file.arrayBuffer();
    const base64String = Buffer.from(fileBuffer).toString('base64');
    const dataURI = `data:${file.type};base64,${base64String}`;
    
    // Augšupielādējam uz Cloudinary ar optimizāciju
    const result = await cloudinary.uploader.upload(dataURI, {
      folder: folder,
      public_id: publicId,
      resource_type: 'auto',
      overwrite: false,
      // Optimizācijas logoam
      transformation: folder.includes('logo') ? [
        { width: 400, height: 400, crop: 'fit', quality: 'auto:good' },
        { format: 'auto' }
      ] : [
        { width: 1920, height: 1080, crop: 'limit', quality: 'auto:good' },
        { format: 'auto' }
      ]
    });

    console.log('✅ Upload successful:', {
      public_id: result.public_id,
      secure_url: result.secure_url,
      width: result.width,
      height: result.height,
      format: result.format,
      bytes: result.bytes
    });

    // Īsāks response
    return NextResponse.json({
      url: result.secure_url,
      publicId: result.public_id,
      width: result.width,
      height: result.height
    });

  } catch (error) {
    console.error('❌ Upload error:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to upload file',
        details: process.env.NODE_ENV === 'development' ? String(error) : undefined
      },
      { status: 500 }
    );
  }
}