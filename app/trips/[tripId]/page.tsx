import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";
import TripDetailClient from "@/components/trip-detail"; 

interface TripDetailPageProps {
  params: {
    tripId: string;
  };
}

export default async function TripDetailPage({ params }: TripDetailPageProps) {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    redirect("/api/auth/signin");
  }

  const trip = await prisma.trip.findFirst({
    where: {
      id: params.tripId,
      userId: userId, 
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
    notFound();
  }

  return <TripDetailClient trip={trip} />;
}