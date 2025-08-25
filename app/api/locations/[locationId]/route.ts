import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function DELETE(
  request: Request,
  context: { params: { locationId: string } }
) {
  try {
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
      return new NextResponse("Not authenticated", { status: 401 });
    }
    
    const { locationId } = context.params;

    if (!locationId) {
      return new NextResponse("Location ID is required", { status: 400 });
    }

    const location = await prisma.location.findUnique({
      where: {
        id: locationId,
      },
      include: {
        trip: {
          select: {
            userId: true,
          },
        },
      },
    });

    if (!location) {
      return new NextResponse("Location not found", { status: 404 });
    }

    if (location.trip.userId !== userId) {
      return new NextResponse("Forbidden: You do not own this trip", { status: 403 });
    }

    await prisma.location.delete({
      where: {
        id: locationId,
      },
    });

    return NextResponse.json({ message: "Location deleted successfully" });
  } catch (err) {
    console.error("[LOCATION_DELETE_ERROR]", err);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}