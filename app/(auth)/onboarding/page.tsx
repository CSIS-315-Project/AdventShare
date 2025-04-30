import OnboardingForm from "@/features/auth/components/forms/onboarding";
import { getOrganizations } from "@/features/auth/server/db/organizations";

export default async function OnboardingComponent({
  searchParams,
}: {
  searchParams: Promise<{ search?: string }>;
}) {
  const searchQuery = (await searchParams)?.search;

  const schools = await getOrganizations({
    query: searchQuery || "",
    limit: 10,
    offset: 0,
  });

  return (
    <div>
      <OnboardingForm organizations={schools} />
    </div>
  );
}
