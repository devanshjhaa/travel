import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function DELETE(
  req: Request, // first param  Request
  { params }: { params: { locationId: string } } // second param context
): Promise<Response> {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return new NextResponse("Not authenticated", { status: 401 });
    }

    const locationId = params.locationId;

    const location = await prisma.location.findUnique({
      where: { id: locationId },
      include: { trip: true },
    });

    if (!location || location.trip.userId !== session.user.id) {
      return new NextResponse("Unauthorized", { status: 403 });
    }

    await prisma.location.delete({
      where: { id: locationId },
    });

    return new NextResponse("Location deleted", { status: 200 });
  } catch (err) {
    console.error("[DELETE_LOCATION_ERROR]", err);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
