import { Badge } from "@/components/ui/badge";
import { Clock, Tag, DollarSign, Package } from "lucide-react";
import type { Item } from "../types";
import { getStatusColor } from "../utils/status-utils";
import { formatCurrency } from "../utils/format-utils";

interface ItemDetailsProps {
  item: Item;
}

export default function ItemDetails({ item }: ItemDetailsProps) {
  return (
    <div>
      <h1 className="text-3xl font-bold">{item.name}</h1>
      <div className="flex flex-wrap items-center gap-2 mt-2">
        <Badge variant="outline" className={getStatusColor(item.status)}>
          {item.status}
        </Badge>

        {/* Show quantity badge if available */}
        {item.availableQuantity !== undefined && item.availableQuantity > 0 && (
          <Badge variant="secondary">{item.availableQuantity} available</Badge>
        )}

        <div className="flex items-center text-gray-500 text-sm">
          <Clock className="h-4 w-4 mr-1" />
          <span>Posted {new Date(item.postedDate).toLocaleDateString()}</span>
        </div>
      </div>

      <div className="space-y-3 mt-4">
        <div className="flex items-center gap-2">
          <Tag className="h-4 w-4 text-gray-500" />
          <span className="text-sm text-gray-700">
            {item.category} {item.subcategory && `› ${item.subcategory}`}
          </span>
        </div>

        {/* Display quantity details if available */}
        {item.quantity !== undefined && item.quantity > 1 && (
          <div className="flex items-center gap-2">
            <Package className="h-4 w-4 text-gray-500" />
            <span className="text-sm text-gray-700">
              {item.quantity} total items
              {item.availableQuantity !== undefined &&
              item.quantity !== item.availableQuantity
                ? ` (${item.availableQuantity} available)`
                : null}
            </span>
          </div>
        )}

        {/* Display estimated value if available */}
        {item.estimatedValue !== undefined && (
          <div className="flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-gray-500" />
            <span className="text-sm text-gray-700">
              Estimated Value: {formatCurrency(item.estimatedValue)}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
