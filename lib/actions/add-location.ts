"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

async function geocodeAddress(address: string) {
  const apikey = process.env.MAPS_API_TOKEN!;
  const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
    address
  )}.json?access_token=${apikey}&limit=1`;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Failed to fetch coordinates");
  }

  const data = await response.json();
  if (!data.features || data.features.length === 0) {
    throw new Error("Address not found");
  }

  const [lng, lat] = data.features[0].center;
  return { lat, lng };
}

export async function addLocation(formData: FormData, tripId: string) {
  const session = await auth();
  if (!session) {
    throw new Error("Not authenticated");
  }

  const address = formData.get("address")?.toString();
  if (!address) {
    throw new Error("Missing address");
  }

  const { lat, lng } = await geocodeAddress(address);

  const lastLocation = await prisma.location.findFirst({
    where: { tripId },
    orderBy: { order: "desc" },
  });

  const newOrder = lastLocation ? lastLocation.order + 1 : 1;

  await prisma.location.create({
    data: {
      locationTitle: address,
      lat,
      lng,
      tripId,
      order: newOrder,
    },
  });

  redirect(`/trips/${tripId}`);
}
