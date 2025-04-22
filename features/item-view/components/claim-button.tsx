"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { claimItem } from "../server/actions/claim-item";
import type { ItemStatus, Item } from "../types";
import { useUser } from "@clerk/nextjs";


interface ClaimButtonProps {
  item: Item;
  initialStatus: ItemStatus;
}

export default function ClaimButton({ item, initialStatus }: ClaimButtonProps) {
  const [status, setStatus] = useState(initialStatus);
  const [isLoading, setIsLoading] = useState(false);
  const [claimQuantity, setClaimQuantity] = useState(1);

  const maxQuantity = item.availableQuantity || item.quantity || 1;
  const showQuantitySelector =
    (item.quantity || 0) > 1 || (item.availableQuantity || 0) > 1;
  
  const { user } = useUser();
  // console.log("User:", user);
  const userId = user?.id;

  const handleClaimItem = async () => {
    if (status !== "Available") return;

    setIsLoading(true);
    try {
      const response = await claimItem(
        item.id,
        userId || "",
        claimQuantity,
        item.school.id
      );
      console.log("Claim response:", response);

      if (response.success) {
        setStatus("Pending Approval");
        toast.success("Claim Request Submitted", {
          description: `The school has been notified of your interest in ${
            claimQuantity > 1 ? `${claimQuantity} items` : "this item"
          }.`,
        });
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      toast.error("Error", {
        description:
          error instanceof Error
            ? error.message
            : "There was a problem submitting your claim request. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {showQuantitySelector && status === "Available" && (
        <div className="space-y-2">
          <div className="flex justify-between">
            <Label htmlFor="quantity">Quantity</Label>
            <span className="text-sm text-muted-foreground">
              {maxQuantity > 1
                ? `Maximum available: ${maxQuantity}`
                : "Only 1 item available"}
            </span>
          </div>
          <Input
            id="quantity"
            type="number"
            min={1}
            max={maxQuantity}
            value={claimQuantity}
            onChange={(e) =>
              setClaimQuantity(
                Math.min(
                  Math.max(1, Number.parseInt(e.target.value) || 1),
                  maxQuantity
                )
              )
            }
          />
        </div>
      )}

      <Button
        className="w-full"
        size="lg"
        disabled={status !== "Available" || isLoading}
        onClick={handleClaimItem}
      >
        {isLoading
          ? "Processing..."
          : status === "Available"
          ? showQuantitySelector
            ? `Claim ${claimQuantity} ${claimQuantity === 1 ? "Item" : "Items"}`
            : "Claim This Item"
          : status === "Pending Approval"
          ? "Request Pending"
          : "Item Claimed"}
      </Button>
    </div>
  );
}
