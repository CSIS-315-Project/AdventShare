export function getStatusColor(status: string) {
  switch (status) {
    case "Available":
      return "bg-green-100 text-green-800 hover:bg-green-200";
    case "Claimed":
      return "bg-red-100 text-red-800 hover:bg-red-200";
    case "Pending Approval":
      return "bg-yellow-100 text-yellow-800 hover:bg-yellow-200";
    default:
      return "bg-gray-100 text-gray-800 hover:bg-gray-200";
  }
}
