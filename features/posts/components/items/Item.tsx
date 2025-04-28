"use client";

import { Toaster } from "sonner";
import type { Item } from "../types";

import ImageGallery from "./image-gallery";
import ItemDetails from "./item-details";
import SchoolInfo from "./school-info";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

interface ItemViewClientProps {
  item: Item;
}

export default function ItemViewClient({ item }: ItemViewClientProps) {
  return (
	<div className="container mx-auto px-4 py-8 max-w-6xl">
	  {/* Add Sonner Toaster component */}
	  <Toaster position="top-right" />

	  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
		{/* Left Column - Image Gallery */}
		<div className="lg:col-span-2">
		  <ImageGallery images={item.images} itemName={item.name} />
		</div>

		{/* Right Column - Item Details */}
		<div className="space-y-6">
		  <ItemDetails item={item} />

		  <Separator />

		  <SchoolInfo school={item.school} itemName={item.name} />

		  <Separator />
		</div>
	  </div>

	  {/* Item Description */}
	  <Card className="mt-8">
		<CardContent className="pt-6">
		  <h2 className="text-xl font-semibold mb-4">Description</h2>
		  <p className="text-gray-700 whitespace-pre-line break-words overflow-hidden pb-6">
			{item.description}
		  </p>
		</CardContent>
	  </Card>
	</div>
  );
}
