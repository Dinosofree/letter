import { PageSpinner } from "@/components/ui/LoadingSpinner";

export default function Loading() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-semibold text-warm-700 mb-8">通信时间轴</h1>
      <PageSpinner />
    </div>
  );
}
