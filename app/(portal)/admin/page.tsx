export default async function AdministrationPage() {
  return (
    <div className="flex flex-col gap-4">
      <p className="text-gray-500">
        This is the administration page. Only administrators can access this
        page.
      </p>
      <p className="text-gray-500">
        You can manage users, roles, and permissions from here.
      </p>
      <p className="text-gray-500">
        Make sure to handle sensitive information with care.
      </p>
      <p className="text-gray-500">
        If you have any questions, please contact support.
      </p>
    </div>
  );
}
