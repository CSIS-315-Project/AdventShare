"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import { invite } from "@/features/dashboard/organizations/server/actions/invite";

export function InviteStaffDialog({
  organizationId,
}: {
  organizationId: string;
}) {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<"ADMIN" | "MANAGER" | "STAFF">("STAFF");

  const inviteStaffMember = invite.bind(null, organizationId);

  const handleSubmit = async () => {
    await inviteStaffMember({
      email,
      role,
    });
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Invite Staff</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Invite Staff Member</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-3">
        <div className="grid grid-cols-4 gap-3">
          <Input
            className="col-span-3"
            placeholder="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Select value={role} onValueChange={(value: "ADMIN" | "MANAGER" | "STAFF") => setRole(value)}>
            <SelectTrigger className="col-span-1 w-full">
              <SelectValue placeholder="Select role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ADMIN">Admin</SelectItem>
              <SelectItem value="MANAGER">Manager</SelectItem>
              <SelectItem value="STAFF">Staff</SelectItem>
            </SelectContent>
          </Select>
          </div>
          <Button onClick={handleSubmit}>Send Invitation</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
} 