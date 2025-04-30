export function getStatusColor(status: string) {
  switch (status) {
    case "Available":
    case "available":
    case "approved":
      return "bg-green-100 text-green-800 hover:bg-green-200";
    case "Claimed":
    case "claimed":
      return "bg-red-100 text-red-800 hover:bg-red-200";
    case "Pending Approval":
    case "pending":
      return "bg-yellow-100 text-yellow-800 hover:bg-yellow-200";
    case "rejected":
    case "Rejected":
      return "bg-red-100 text-red-800 hover:bg-red-200";
    default:
      return "bg-gray-100 text-gray-800 hover:bg-gray-200";
  }
}
