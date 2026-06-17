import { Suspense } from "react";
import { HandoverGenerator } from "@/components/dashboard/HandoverGenerator";

export default function HandoverPage() {
  return (
    <Suspense fallback={null}>
      <HandoverGenerator />
    </Suspense>
  );
}
