"use client"

import type React from "react"

import { useState } from "react"
import { toast } from "sonner"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { updateClaim } from "../server/actions/update-claim"
import type { Claim } from "../types"

interface EditClaimDialogProps {
  claim: Claim
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function EditClaimDialog({ claim, open, onOpenChange }: EditClaimDialogProps) {
  const [quantity, setQuantity] = useState(claim.quantity)
  const [notes, setNotes] = useState(claim.notes || "")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const maxQuantity = claim.item.availableQuantity || 10 // Fallback to 10 if not specified

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
    await toast.promise(
      updateClaim({
        id: claim.id,
        quantity,
        notes,
      }),
      {
        loading: "Updating claim...",
        success: () => {
          toast.success("Claim updated successfully")
          onOpenChange(false)
          return "Claim updated successfully"
        },
        error: (error) => {
          throw new Error(error instanceof Error ? error.message : "Failed to update claim")
        },
      }
    )
    } catch (error) {
      toast.error("Failed to update claim", {
        description: error instanceof Error ? error.message : "Please try again later",
      })
    } finally {
      setIsSubmitting(false)
      // reload the page after 1 second
      setTimeout(() => {
        window.location.reload()
      }, 700)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Claim</DialogTitle>
          <DialogDescription>Update your claim for {claim.item.name}</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <div className="flex justify-between">
              <Label htmlFor="quantity">Quantity</Label>
              <span className="text-sm text-muted-foreground">Maximum available: {maxQuantity}</span>
            </div>
            <Input
              id="quantity"
              type="number"
              min={1}
              max={maxQuantity}
              value={quantity}
              onChange={(e) => setQuantity(Math.min(Math.max(1, Number(e.target.value) || 1), maxQuantity))}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes (optional)</Label>
            <Textarea
              id="notes"
              placeholder="Add any special requirements or notes for the school"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="min-h-[100px]"
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Updating..." : "Update Claim"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
