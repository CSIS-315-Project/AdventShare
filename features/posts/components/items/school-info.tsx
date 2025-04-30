import { School, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import type { School as SchoolType } from "../types";

interface SchoolInfoProps {
  school: SchoolType;
  itemName: string;
}

export default function SchoolInfo({ school, itemName }: SchoolInfoProps) {
  return (
    <div className="space-y-3">
      <h2 className="text-lg font-semibold">Posted by</h2>
      <div className="flex items-center gap-2">
        <School className="h-5 w-5 text-gray-500" />
        <span className="font-medium">{school.name}</span>
      </div>
      {school.location && (
        <div className="flex items-center gap-2">
          <School className="h-5 w-5 text-gray-500" />
          <span>{school.location}</span>
        </div>
      )}

      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline" className="w-full mt-2" size="lg">
            <Mail className="h-5 w-5 mr-2" />
            Contact School
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Contact {school.name}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <p>
              To inquire about this item, please contact the school directly at:
            </p>
            <p className="font-medium">{school.contactEmail}</p>
            <p className="text-sm text-gray-500">
              Please mention the item name "{itemName}" in your communication.
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
