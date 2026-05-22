"use client";

import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/Button";

export default function SettingsPage() {
  const { user, signOut } = useAuth();

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-xl font-semibold text-warm-700 mb-8">设置</h1>

      <div className="space-y-6">
        {/* App Download */}
        <div className="bg-white border border-cream-200 rounded-xl p-5">
          <h2 className="text-sm font-medium text-warm-700 mb-3">App 下载</h2>
          <p className="text-xs text-warm-400 mb-4 leading-relaxed">
            将信件档案安装到手机，支持分享导入和离线浏览
          </p>
          <div className="flex flex-wrap gap-3">
            <a
              href="https://github.com/Dinosofree/letter/releases/tag/apk-latest"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-warm-700 text-cream-100
                         rounded-lg text-sm font-medium hover:bg-warm-700/90 transition-colors"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M6 18c0 .55.45 1 1 1h1v3.5a1.5 1.5 0 0 0 3 0V19h2v3.5a1.5 1.5 0 0 0 3 0V19h1c.55 0 1-.45 1-1V8H6v10zM3.5 8C2.67 8 2 8.67 2 9.5v7a1.5 1.5 0 1 0 3 0v-7C5 8.67 4.33 8 3.5 8zm17 0c-.83 0-1.5.67-1.5 1.5v7a1.5 1.5 0 1 0 3 0v-7c0-.83-.67-1.5-1.5-1.5zM15.53 2.16l1.3-1.3c.2-.2.2-.51 0-.71-.2-.2-.51-.2-.71 0l-1.48 1.48A5.96 5.96 0 0 0 12 1c-1.02 0-1.98.26-2.82.72L7.7.24c-.2-.2-.51-.2-.71 0-.2.2-.2.51 0 .71l1.3 1.3A5.96 5.96 0 0 0 6 6h12c0-1.58-.6-3-1.59-4.06zM12 3c1.1 0 2 .9 2 2H10c0-1.1.9-2 2-2z" />
              </svg>
              下载 Android APK
            </a>
            <span className="text-xs text-warm-300 self-center">
              iOS: Safari 打开 → 分享 → 添加到主屏幕
            </span>
          </div>
        </div>

        {/* Account */}
        <div className="bg-white border border-cream-200 rounded-xl p-5">
          <h2 className="text-sm font-medium text-warm-700 mb-3">账号</h2>
          <p className="text-sm text-warm-500">{user?.email}</p>
        </div>

        {/* About */}
        <div className="bg-white border border-cream-200 rounded-xl p-5">
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
