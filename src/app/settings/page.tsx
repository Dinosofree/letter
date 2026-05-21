"use client";

import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/Button";

export default function SettingsPage() {
  const { user, signOut } = useAuth();

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-xl font-semibold text-warm-700 mb-8">设置</h1>

      <div className="space-y-6">
        <div className="bg-white border border-cream-200 rounded-lg p-5">
          <h2 className="text-sm font-medium text-warm-700 mb-3">账号</h2>
          <p className="text-sm text-warm-500">{user?.email}</p>
        </div>

        <div className="bg-white border border-cream-200 rounded-lg p-5">
          <h2 className="text-sm font-medium text-warm-700 mb-3">关于</h2>
          <p className="text-sm text-warm-500 leading-relaxed">
            信件档案 — 个人通信记忆库。
            <br />
            安静保存、整理、检索、分析你的信件与通信记录。
          </p>
        </div>

        <Button variant="danger" onClick={signOut}>
          登出
        </Button>
      </div>
    </div>
  );
}
