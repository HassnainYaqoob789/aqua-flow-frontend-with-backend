// app/page.tsx
import DashboardPage from "@/components/Dashboard/E-commerce";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default function HomePage() {
  // Read token from cookies server-side
  const token = cookies().get("token")?.value;

  if (!token) {
    // If no token, redirect to login
    redirect("/auth/login"); // no 'return' needed with redirect()
  }

  // If token exists, show dashboard
  return (
    <DefaultLayout>
      <DashboardPage />
    </DefaultLayout>
  );
}
