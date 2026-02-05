import Navbar from "@/components/nav.bar";
import FeatureCards from "@/components/voice/feature.cards";
import ProPlanRequired from "@/components/voice/pro.plan.required";
import VapiWidget from "@/components/voice/vapi.widget";
import WelcomeSection from "@/components/voice/welcome.section";
import { auth } from "@clerk/nextjs/server";

async function VoicePage() {
  const { has } = await auth();

  const hasProPlan = has({ plan: "ai_basic" }) || has({ plan: "ai_pro" });

  if (!hasProPlan) return <ProPlanRequired />;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="max-w-7xl mx-auto px-6 py-8 pt-24">
        <WelcomeSection />
        <FeatureCards />
      </div>

      <VapiWidget />
    </div>
  );
}

export default VoicePage;