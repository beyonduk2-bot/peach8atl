import { PlannerForm } from "@/components/PlannerForm";

export default function HomePage() {
  return (
    <main className="w-full px-4 pb-[calc(120px_+_env(safe-area-inset-bottom))]">
      <PlannerForm />
    </main>
  );
}
