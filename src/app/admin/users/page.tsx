"use client";

import { Admin } from "@/components/auth/admin/admin";

export default function AdminUsersPage() {
  return (
    <div className="w-full max-w-6xl mx-auto p-4 md:p-6" dir="rtl">
      <Admin view="users" />
    </div>
  );
}
