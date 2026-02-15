import ActivityOverview from "@/components/dashboard/activity.overview";
import MainActions from "@/components/dashboard/main.action";
import WelcomeSection from "@/components/dashboard/welcome.section";
import Navbar from "@/components/nav.bar";
import React from "react";

function DashboardPage() {
  return (
    <>
      <Navbar />

      <div className="max-w-7xl mx-auto px-6 py-8 pt-24">
        <WelcomeSection />
        <MainActions />
        <ActivityOverview />
      </div>
    </>
  );
}

export default DashboardPage;
