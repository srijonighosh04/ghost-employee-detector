import { Suspense } from "react";
import { SimulatorPanel } from "@/components/dashboard/SimulatorPanel";

export default function SimulatorPage() {
  return (
    <Suspense fallback={null}>
      <SimulatorPanel />
    </Suspense>
  );
}
