"use client";

import { useRef, useEffect } from "react";
import { Location } from "@prisma/client";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

interface MapProps {
  itineraries: Location[];
}

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN!;

export default function ItineraryMap({ itineraries }: MapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    const center =
      itineraries.length > 0
        ? [itineraries[0].lng, itineraries[0].lat]
        : [0, 0];

    mapRef.current = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center,
      zoom: 8,
    });

    mapRef.current.addControl(new mapboxgl.NavigationControl(), "top-right");

    itineraries.forEach((location) => {
      new mapboxgl.Marker({ color: "red" })
        .setLngLat([location.lng, location.lat])
        .addTo(mapRef.current!);
    });

    return () => mapRef.current?.remove();
  }, [itineraries]);

  return <div ref={mapContainerRef} className="w-full h-full" />;
}
