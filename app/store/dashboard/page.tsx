import { DashboardView } from "@/components/dashboard/dashboard-view";
import { getDashboardData } from "@/lib/services/dashboard-service";

export default async function DashboardPage() {
  const data = await getDashboardData();
  return <main className="mx-auto w-full max-w-7xl flex-1 px-6 py-16"><DashboardView data={data} /></main>;
}
