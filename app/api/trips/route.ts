import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return new NextResponse("Not authenticated", { status: 401 });
    }

    const trips = await prisma.trip.findMany({
      where: {
        userId: session.user.id,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(trips);
  } catch (err) {
    console.error("[GET_ALL_TRIPS_ERROR]", err);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}