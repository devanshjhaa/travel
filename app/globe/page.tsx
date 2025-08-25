"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { TransformedLocation } from "@/components/globe-visualization";

const GlobeVisualization = dynamic(
  () => import("@/components/globe-visualization"),
  { 
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900" />
      </div>
    )
  }
);

export default function GlobePage() {
  const [locations, setLocations] = useState<TransformedLocation[]>([]);
  const [globeKey, setGlobeKey] = useState(0);

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const response = await fetch("/api/locations"); 
        if (!response.ok) {
          throw new Error(`Failed to fetch: ${response.statusText}`);
        }
        const data: TransformedLocation[] = await response.json();

        const validData = data.filter(
          (loc) => !isNaN(loc.lat) && !isNaN(loc.lng)
        );

        setLocations(validData);
        setGlobeKey(prevKey => prevKey + 1);
      } catch (err) {
        console.error("Error fetching locations:", err);
      }
    };

    fetchLocations();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-center text-4xl font-bold mb-12">
          Your Travel Journey
        </h1>
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-semibold mb-4">
            See where you have been...
          </h2>
          <div className="h-[600px] w-full">
            <GlobeVisualization key={globeKey} locations={locations} />
          </div>
        </div>
      </div>
    </div>
  );
}