"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { claimItem } from "../server/actions/claim-item";
import type { ItemStatus } from "../types";

interface ClaimButtonProps {
  itemId: string;
  initialStatus: ItemStatus;
}

export default function ClaimButton({
  itemId,
  initialStatus,
}: ClaimButtonProps) {
  const [status, setStatus] = useState(initialStatus);
  const [isLoading, setIsLoading] = useState(false);

  const handleClaimItem = async () => {
    if (status !== "Available") return;

    setIsLoading(true);
    try {
      // In a real app, this would be a server action call
      const response = await claimItem(itemId);

      if (response.success) {
        setStatus("Pending Approval");
        toast.success("Claim Request Submitted", {
          description:
            "The school has been notified of your interest in this item.",
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
    <Button
      className="w-full"
      size="lg"
      disabled={status !== "Available" || isLoading}
      onClick={handleClaimItem}
    >
      {isLoading
        ? "Processing..."
        : status === "Available"
        ? "Claim This Item"
        : status === "Pending Approval"
        ? "Request Pending"
        : "Item Claimed"}
    </Button>
  );
}
