"use client";

import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showEmail, setShowEmail] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  // Check if already logged in
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) router.push("/");
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleGoogle = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    if (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  const handleEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      router.push("/");
      router.refresh();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-cream-100 px-4">
      <div className="w-full max-w-sm">
        <h1 className="text-3xl font-semibold text-warm-700 text-center mb-1 tracking-wide">
          信件档案
        </h1>
        <p className="text-sm text-warm-400 text-center mb-10">
          个人通信记忆库
        </p>

        {/* Google sign-in — primary */}
        <button
          onClick={handleGoogle}
          disabled={loading}
          className="w-full py-3 bg-white border border-cream-300 rounded-xl
                     text-warm-700 hover:border-accent hover:shadow-sm
                     disabled:opacity-50 transition-all flex items-center justify-center gap-3
                     text-sm font-medium mb-4"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          {loading ? "登录中..." : "使用 Google 登录"}
        </button>

        {/* Email login — secondary */}
        {!showEmail ? (
          <button
            onClick={() => setShowEmail(true)}
            className="w-full text-xs text-warm-400 hover:text-warm-600 transition-colors py-2"
          >
            或使用邮箱密码登录
          </button>
        ) : (
          <form onSubmit={handleEmail} className="space-y-3">
            <div className="h-px bg-cream-200 my-4" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2.5 bg-white border border-cream-300 rounded-lg
                         text-warm-700 placeholder-warm-300 text-sm
                         focus:outline-none focus:border-accent transition-colors"
              placeholder="Email"
            />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2.5 bg-white border border-cream-300 rounded-lg
                         text-warm-700 placeholder-warm-300 text-sm
                         focus:outline-none focus:border-accent transition-colors"
              placeholder="密码"
            />

            {error && (
              <p className="text-xs text-red-500 bg-red-50 px-3 py-2 rounded-lg">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-warm-700 text-cream-100 rounded-lg
                         hover:bg-warm-700/90 disabled:opacity-50 transition-colors
                         text-sm font-medium"
            >
              {loading ? "登录中..." : "登录"}
            </button>

            <button
              type="button"
              onClick={() => setShowEmail(false)}
              className="w-full text-xs text-warm-400 hover:text-warm-600 transition-colors py-1"
            >
              返回
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
