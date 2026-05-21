import { EmptyState } from "@/components/ui/EmptyState";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <EmptyState
        title="页面不存在"
        action={
          <Link href="/">
            <Button variant="secondary">返回首页</Button>
          </Link>
        }
      />
    </div>
  );
}
