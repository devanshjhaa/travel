"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface DeleteTripButtonProps {
  tripId: string;
}

export default function DeleteTripButton({ tripId }: DeleteTripButtonProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this trip and all its locations?")) {
      return;
    }

    setIsDeleting(true);
    try {
      const response = await fetch(`/api/trips/${tripId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete trip.");
      }

      toast.success("Trip deleted successfully!");
      router.push("/trips");
      router.refresh();
    } catch (error) {
      console.error(error);
      toast.error("An error occurred while deleting the trip.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Button
      variant="destructive"
      onClick={handleDelete}
      disabled={isDeleting}
    >
      <Trash2 className="mr-2 h-4 w-4" />
      {isDeleting ? "Deleting..." : "Delete Trip"}
    </Button>
  );
}