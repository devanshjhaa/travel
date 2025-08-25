import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";


// HANDLES: GET /api/trips/[tripId]

export async function GET(
  request: Request,
  { params }: { params: { tripId: string } }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return new NextResponse("Not authenticated", { status: 401 });
    }

    const trip = await prisma.trip.findFirst({
      where: {
        id: params.tripId,
        userId: session.user.id,
      },
      include: {
        locations: {
          orderBy: {
            order: 'asc',
          },
        },
      },
    });

    if (!trip) {
      return new NextResponse("Trip not found or access denied", { status: 404 });
    }

    return NextResponse.json(trip);
  } catch (err) {
    console.error("[TRIP_GET_ERROR]", err);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

// HANDLES: DELETE /api/trips/[tripId]
export async function DELETE(
  request: Request,
  { params }: { params: { tripId: string } }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return new NextResponse("Not authenticated", { status: 401 });
    }

    const tripToDelete = await prisma.trip.findFirst({
      where: {
        id: params.tripId,
        userId: session.user.id,
      },
    });

    if (!tripToDelete) {
      return new NextResponse("Trip not found or access denied", { status: 404 });
    }

    await prisma.trip.delete({
      where: {
        id: params.tripId,
      },
    });

    return NextResponse.json({ message: "Trip deleted successfully" });
  } catch (err) {
    console.error("[TRIP_DELETE_ERROR]", err);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}