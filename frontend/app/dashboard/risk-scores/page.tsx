import { employees } from "@/lib/mock-data";
import { RiskScoreTable } from "@/components/dashboard/RiskScoreTable";

export default function RiskScoresPage() {
  return (
    <div className="space-y-5">
      <p className="max-w-2xl text-sm text-slate">
        The Knowledge Risk Score weighs project ownership, how many people and processes depend on
        someone, and how much of what they know is actually written down. Sort any column to find
        where to focus next.
      </p>
      <RiskScoreTable employees={employees} />
    </div>
  );
}
