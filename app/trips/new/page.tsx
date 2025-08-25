"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { createTrip } from "@/lib/actions/create-trip";
import { UploadButton } from "@/lib/upload-thing";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { useState, useTransition } from "react";


export default function NewTrip() {
    const [isPending, startTransition] = useTransition();
    const [imageUrl, setImageUrl] = useState<string | null>(null)
    return (
        <div className="max-w-lg mx-auto mt-10">
            <Card>
                <CardHeader>New Trip</CardHeader>
                <CardContent>
                    <form
                        className="space-y-6"
                        action={(formData: FormData) => {

                            if (imageUrl) {
                                formData.append("imageUrl", imageUrl);
                            }
                            startTransition(() => {
                                createTrip(formData);
                            });
                        }}>
                        <div>
                            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                            <input
                                id="title"
                                type="text"
                                name="title"
                                placeholder="Japan trip...."
                                className={cn(
                                    "w-full border-gray-300 px-3 py-2 ",
                                    "rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                )}
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                            <textarea
                                id="description"
                                name="description"
                                placeholder="Trip desc.."
                                className={cn(
                                    "w-full border-gray-300 px-3 py-2 ",
                                    "rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                )}
                                required
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">StartDate</label>
                                <input
                                    id="startDate"
                                    type="date"
                                    name="startDate"
                                    className={cn(
                                        "w-full border-gray-300 px-3 py-2 ",
                                        "rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    )}
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-1">EndDate</label>
                                <input
                                    id="endDate"
                                    type="date"
                                    name="endDate"
                                    className={cn(
                                        "w-full border-gray-300 px-3 py-2 ",
                                        "rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    )}
                                    required
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Trip Image</label>

                            {imageUrl && (
                                <div className="mb-4">
                                    <Image
                                        src={imageUrl}
                                        alt="Trip Preview"

                                        width={500}
                                        height={300} 
                                        className="w-full rounded-md object-cover max-h-48"
                                    />
                                </div>
                            )}
                            <UploadButton
                                endpoint="imageUploader"
                                onClientUploadComplete={(res) => {
                                    if (res && res[0]?.url) { 
                                        setImageUrl(res[0].url);
                                        alert("Image upload complete!");
                                    }
                                }}
                                onUploadError={(error: Error) => {
                                    console.error("Upload error:", error)
                                    alert(`Image upload failed: ${error.message}`);
                                }}
                            />
                        </div>
                        <Button type="submit" disabled={isPending} className="w-full">
                            {isPending ? "Creating..." : "Create Trip"}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}