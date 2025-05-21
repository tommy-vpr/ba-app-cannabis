// app/dashboard/[...missing]/page.tsx
import { notFound } from "next/navigation";

export default function CatchAllDashboardPage() {
  // Call notFound during render
  notFound();
  return null;
}
