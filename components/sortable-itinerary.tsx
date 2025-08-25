"use client";

import { Location } from "@prisma/client";
import { reorderItinerary } from "@/lib/actions/reorder-itinerary";
import { DndContext, closestCenter, DragEndEvent } from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useEffect, useId, useState } from "react";
import { toast } from "sonner";
import { GripVertical } from "lucide-react";

interface SortableItineraryProps {
  locations: Location[];
  tripId: string;
}

function SortableItem({ item }: { item: Location }) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="p-3 bg-white border rounded-lg shadow-sm flex justify-between items-center"
    >
      <div className="flex items-center gap-x-3">
        <div {...attributes} {...listeners} className="cursor-grab text-gray-400">
          <GripVertical size={20} />
        </div>
        <div>
          <h4 className="font-medium text-gray-800">{item.locationTitle}</h4>
          <p className="text-sm text-gray-500 truncate max-w-xs">
            {`Lat: ${item.lat.toFixed(4)}, Lng: ${item.lng.toFixed(4)}`}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-x-2">
        <div className="text-sm text-gray-600 font-mono px-2 py-1 bg-gray-100 rounded">
          Day {item.order}
        </div>
      </div>
    </div>
  );
}

export default function SortableItinerary({
  locations,
  tripId,
}: SortableItineraryProps) {
  const id = useId();
  const [localLocations, setLocalLocations] = useState(locations);

  useEffect(() => {
    setLocalLocations(locations);
  }, [locations]);

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const originalOrder = localLocations;
      
      const oldIndex = originalOrder.findIndex((item) => item.id === active.id);
      const newIndex = originalOrder.findIndex((item) => item.id === over.id);

      const newOptimisticOrder = arrayMove(originalOrder, oldIndex, newIndex)
                                 .map((item, index) => ({ ...item, order: index }));
      setLocalLocations(newOptimisticOrder);

      try {
        await reorderItinerary(
          tripId,
          newOptimisticOrder.map((item) => item.id)
        );
        toast.success("Itinerary reordered successfully!");
      } catch (error) {
        toast.error("Failed to reorder. Reverting changes.");
        setLocalLocations(originalOrder);
      }
    }
  };

  return (
    <DndContext
      id={id}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={localLocations.map((loc) => loc.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="space-y-3">
          {localLocations.map((item) => (
            <SortableItem key={item.id} item={item} />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}