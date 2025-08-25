"use client";

import { Trip, Location } from "@prisma/client";
import Image from "next/image";
import { Calendar, MapPin, Plus } from "lucide-react";
import Link from "next/link";
import { Button } from "./ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { useState } from "react";
import Map from "@/components/map";
import SortableItinerary from "./sortable-itinerary";
import DeleteTripButton from "@/components/delete-trip"; 

export type TripwithLocations = Trip & {
  locations: Location[];
};

interface TripDetailClientProps {
  trip: TripwithLocations;
}

export default function TripDetailClient({ trip }: TripDetailClientProps) {
  const [activeTab, setActiveTab] = useState("overview");

  const startDate = new Date(trip.startDate);
  const endDate = new Date(trip.endDate);
  const dayCount =
    Math.round((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Trip Image */}
      {trip.imageUrl && (
        <div className="w-full h-72 md:h-96 overflow-hidden rounded-xl shadow-lg relative">
          <Image
            src={trip.imageUrl}
            alt={trip.title}
            className="object-cover"
            fill
            priority
          />
        </div>
      )}

      {/* Trip Header */}
      <div className="bg-white p-6 shadow rounded-lg flex flex-col md:flex-row justify-between items-start md:items-center">
        <div>
          <h1 className="text-4xl font-extrabold text-gray-800">
            {trip.title}
          </h1>
          <div className="flex items-center text-gray-500 mt-2">
            <Calendar className="h-5 w-5 mr-2" />
            <span className="text-lg">
              {`${startDate.toLocaleDateString()} - ${endDate.toLocaleDateString()}`}
            </span>
          </div>
        </div>
        {/* 2. Grouped action buttons */}
        <div className="mt-4 md:mt-0 flex items-center gap-x-2">
          <Link href={`/trips/${trip.id}/itinerary/new`}>
            <Button>
              <Plus className="mr-2 h-5 w-5" />
              Add location
            </Button>
          </Link>
          <DeleteTripButton tripId={trip.id} />
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white p-6 shadow rounded-lg">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="overview" className="text-lg">
              Overview
            </TabsTrigger>
            <TabsTrigger value="itinerary" className="text-lg">
              Itinerary
            </TabsTrigger>
            <TabsTrigger value="map" className="text-lg">
              Map
            </TabsTrigger>
          </TabsList>

          {/* Overview tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h2 className="text-2xl font-semibold mb-4">Trip Summary</h2>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <Calendar className="h-6 w-6 mr-3 text-gray-500" />
                    <div>
                      <p className="font-medium text-gray-700">Dates</p>
                      <p className="text-sm text-gray-500">
                        {`${startDate.toLocaleDateString()} - ${endDate.toLocaleDateString()}`}
                        <br />
                        {`${dayCount} day(s)`}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <MapPin className="h-6 w-6 mr-3 text-gray-500" />
                    <div>
                      <p className="font-medium text-gray-700">Destinations</p>
                      <p className="text-sm text-gray-500">
                        {trip.locations.length}{" "}
                        {trip.locations.length === 1
                          ? "location"
                          : "locations"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="h-72 rounded-lg overflow-hidden shadow">
                <Map itineraries={trip.locations} />
              </div>
            </div>

            {trip.description && (
              <div>
                <p className="text-gray-500 leading-relaxed">
                  {trip.description}
                </p>
              </div>
            )}
          </TabsContent>

          {/* Itinerary tab */}
          <TabsContent value="itinerary" className="space-y-6">
            <h2 className="text-2xl font-semibold">Full Itinerary</h2>
            {trip.locations.length === 0 ? (
              <div className="text-center p-4 border-2 border-dashed rounded-lg">
                <p className="mb-4 text-gray-500">
                  Your itinerary is empty. Add a location to get started!
                </p>
                <Link href={`/trips/${trip.id}/itinerary/new`}>
                  <Button>
                    <Plus className="mr-2 h-5 w-5" />
                    Add location
                  </Button>
                </Link>
              </div>
            ) : (
              <SortableItinerary
                locations={trip.locations}
                tripId={trip.id}
              />
            )}
          </TabsContent>

          {/* Map tab */}
          <TabsContent value="map">
            <div className="h-[600px] rounded-lg overflow-hidden shadow">
              <Map itineraries={trip.locations} />
            </div>
          </TabsContent>
        </Tabs>
      </div>
      <div className="text-center">
        <Link href={`/trips`}>
          <Button> Back to Trips</Button>
        </Link>
      </div>
    </div>
  );
}