import { Suspense } from "react";
import { AssistantChat } from "@/components/dashboard/AssistantChat";

export default function AssistantPage() {
  return (
    <Suspense fallback={null}>
      <AssistantChat />
    </Suspense>
  );
}
