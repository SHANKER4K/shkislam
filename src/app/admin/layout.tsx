import { headers } from "next/headers";
import { notFound, redirect } from "next/navigation";

import { auth } from "@/lib/auth";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    redirect("/auth/sign-in?redirectTo=%2Fadmin%2Fusers");
  }
  // ponytail: single admin for now — swap to a roles array when a second role appears
  if (session.user.role !== "admin") {
    notFound();
  }

  return <>{children}</>;
}
