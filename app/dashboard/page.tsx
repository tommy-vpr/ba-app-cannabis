// app/dashboard/page.tsx

import { CompanyList } from "../components/CompanyList";

export default function DashboardPage() {
  return (
    <div className="p-4 w-full max-w-[1200px] mx-auto">
      <CompanyList />
    </div>
  );
}
