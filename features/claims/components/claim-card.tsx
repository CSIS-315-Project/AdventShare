"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { toast } from "sonner"
import { Calendar, Clock, Edit, Trash2, School, Package } from "lucide-react"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { formatCurrency } from "@/lib/format"
import { getStatusColor } from "@/lib/status"
import { formatDate } from "../utils/date-utils"
import { deleteClaim } from "../server/actions/delete-claim"
import EditClaimDialog from "./edit-claim-dialog"
import DeleteClaimDialog from "./delete-claim-dialog"
import type { Claim } from "../types"

interface ClaimCardProps {
  claim: Claim
}

export default function ClaimCard({ claim }: ClaimCardProps) {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      await toast.promise(
        deleteClaim({
          claim_id: claim.id,
          item_name: claim.item.name,
        }),
        {
          loading: "Deleting claim...",
          success: () => {
            toast.success("Claim deleted successfully")
            return "Claim deleted successfully"
          },
          error: (error) => {
            throw new Error(error instanceof Error ? error.message : "Failed to delete claim")
          },
        }
      )   
    } catch (error) {
      toast.error("Failed to delete claim", {
        description: error instanceof Error ? error.message : "Please try again later",
      })
    } finally {
      setIsDeleting(false)
      setIsDeleteDialogOpen(false)
      setTimeout(() => {
        window.location.reload()
      }, 700)
    }
  }

  return (
    <Card>
      <CardContent className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-6">
          {/* Item Image */}
          <div className="relative aspect-square rounded-md overflow-hidden bg-gray-100">
            <Image src={claim.item.image || "/Logo2.png"} alt={claim.item.name} fill className="object-cover" />
          </div>

          {/* Claim Details */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div>
                <h2 className="text-xl font-semibold">
                  <Link href={`/items/${claim.item.id}`} className="hover:underline">
                    {claim.item.name}
                  </Link>
                </h2>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="outline" className={getStatusColor(claim.status)}>
                    {claim.status}
                  </Badge>
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsEditDialogOpen(true)}
                  disabled={claim.status === "approved" || claim.status === "rejected"}
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-destructive hover:bg-destructive/10"
                  onClick={() => setIsDeleteDialogOpen(true)}
                  disabled={claim.status === "approved" || claim.status === "rejected"}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center text-sm text-muted-foreground">
                  <School className="h-4 w-4 mr-2" />
                  {claim.item.school}
                </div>
                <div className="flex items-center text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4 mr-2" />
                  Claimed on {formatDate(claim.claimDate)}
                </div>
                {claim.responseDate && (
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Clock className="h-4 w-4 mr-2" />
                    Response on {formatDate(claim.responseDate)}
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <div className="flex items-center text-sm">
                  <Package className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span className="font-medium">
                    {claim.quantity} {claim.quantity === 1 ? "item" : "items"} claimed
                  </span>
                </div>
                {claim.item.estimatedValue && (
                  <div className="text-sm">
                    <span className="text-muted-foreground">Estimated value: </span>
                    <span className="font-medium">{formatCurrency(claim.item.estimatedValue * claim.quantity)}</span>
                  </div>
                )}
              </div>
            </div>

            {claim.notes && (
              <>
                <Separator />
                <div>
                  <h3 className="text-sm font-medium mb-1">Notes</h3>
                  <p className="text-sm text-muted-foreground">{claim.notes}</p>
                </div>
              </>
            )}

            {claim.responseMessage && (
              <>
                <Separator />
                <div>
                  <h3 className="text-sm font-medium mb-1">Response from school</h3>
                  <p className="text-sm text-muted-foreground">{claim.responseMessage}</p>
                </div>
              </>
            )}
          </div>
        </div>
      </CardContent>

      {/* Edit Dialog */}
      <EditClaimDialog claim={claim} open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen} />

      {/* Delete Dialog */}
      <DeleteClaimDialog
        claim={claim}
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onDelete={handleDelete}
        isDeleting={isDeleting}
      />
    </Card>
  )
}
