import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return new NextResponse("Not authenticated", { status: 401 });
    }

    const locations = await prisma.location.findMany({
      where: {
        trip: {
          userId: session.user.id,
        },
      },
      select: {
        lat: true,
        lng: true,
        country: true,
        formattedAddress: true,
        trip: {
          select: {
            title: true,
          },
        },
      },
    });

    const transformedLocations = locations.map((loc) => ({
      name: `${loc.trip.title} - ${loc.formattedAddress}`,
      lat: loc.lat,
      lng: loc.lng,
      country: loc.country,
    }));

    return NextResponse.json(transformedLocations);
  } catch (err) {
    console.error("[GET_ALL_LOCATIONS_ERROR]", err);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}