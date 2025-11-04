import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    // Get total count of ACTIVE PrivateAds
    const totalAds = await prisma.privateAd.count({
      where: {
        active: true
      }
    });
    
    if (totalAds === 0) {
      return NextResponse.json(
        { error: 'No active ads available' },
        { status: 404 }
      );
    }
    
    // Generate a random offset
    const randomOffset = Math.floor(Math.random() * totalAds);
    
    // Fetch one random ACTIVE PrivateAd with its worker (user) and images
    const ad = await prisma.privateAd.findFirst({
      skip: randomOffset,
      where: {
        active: true
      },
      select: {
        id: true,
        title: true,
        services: {
          select: {
            price: true,
            length: true,
          }
        },
        worker: {
          select: {
            id: true,
            slug: true,
            suburb: true,
            image: true,
            images: {
              select: { url: true },
              take: 6 // Get up to 6 images for the featured section
            }
          }
        }
      }
    });
    
    if (!ad || !ad.worker) {
      return NextResponse.json(
        { error: 'No ad found' },
        { status: 404 }
      );
    }
    
    // Format pricing from service price range
    let priceText = 'Contact for rates';
    if (ad.services.length > 0) {
      const prices = ad.services.map(s => s.price);
      const minPrice = Math.min(...prices);
      const maxPrice = Math.max(...prices);
      
      if (minPrice === maxPrice) {
        priceText = `$${minPrice}`;
      } else {
        priceText = `$${minPrice} - $${maxPrice}`;
      }
    }
    
    // Format the response
    const profile = {
      id: ad.worker.id,
      adId: ad.id,
      name: ad.worker.slug || ad.title || 'Featured Profile',
      location: ad.worker.suburb || 'Unknown location',
      price: priceText,
      images: ad.worker.images.length > 0 
        ? ad.worker.images.map(img => img.url) 
        : ad.worker.image 
          ? [ad.worker.image] 
          : ['/placeholder.jpg']
    };
    
    return NextResponse.json(profile);
    
  } catch (error) {
    console.error('Error fetching featured profile:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
