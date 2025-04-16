import { Badge } from "@/components/ui/badge";
import { Clock, Tag } from "lucide-react";
import type { Item } from "../types";
import { getStatusColor } from "../utils/status-utils";

interface ItemDetailsProps {
  item: Item;
}

export default function ItemDetails({ item }: ItemDetailsProps) {
  return (
    <div>
      <h1 className="text-3xl font-bold">{item.name}</h1>
      <div className="flex items-center gap-2 mt-2">
        <Badge variant="outline" className={getStatusColor(item.status)}>
          {item.status}
        </Badge>
        <div className="flex items-center text-gray-500 text-sm">
          <Clock className="h-4 w-4 mr-1" />
          <span>Posted {new Date(item.postedDate).toLocaleDateString()}</span>
        </div>
      </div>

      <div className="space-y-2 mt-4">
        <div className="flex items-center gap-2">
          <Tag className="h-4 w-4 text-gray-500" />
          <span className="text-sm text-gray-700">
            {item.category} {item.subcategory && `› ${item.subcategory}`}
          </span>
        </div>
      </div>
    </div>
  );
}
