import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import React from "react";
import AdminPageClient from "./admin.page.client";

async function AdminPage() {
  const user = await currentUser();
  if (!user) redirect("/");
  const adminEmail = process.env.ADMIN_EMAIL;

  if (user.emailAddresses[0].emailAddress !== adminEmail || !adminEmail) {
    redirect("/dashboard");
  }

  return <AdminPageClient />;
}

export default AdminPage;
