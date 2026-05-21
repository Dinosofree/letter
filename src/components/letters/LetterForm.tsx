"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Select } from "@/components/ui/Select";
import { TagInput } from "@/components/ui/TagInput";
import { PLATFORMS, PLATFORM_LABELS, LANGUAGES } from "@/lib/constants";
import type { LetterFormData, Language } from "@/types";

const PLATFORM_OPTIONS = PLATFORMS.map((p) => ({
  value: p,
  label: PLATFORM_LABELS[p],
}));

interface LetterFormProps {
  initial?: Partial<LetterFormData>;
  onSubmit: (data: LetterFormData) => Promise<void>;
  loading?: boolean;
}

export function LetterForm({ initial, onSubmit, loading }: LetterFormProps) {
  const [date, setDate] = useState(initial?.date ?? new Date().toISOString().split("T")[0]);
  const [platform, setPlatform] = useState(initial?.platform ?? "notes");
  const [sender, setSender] = useState(initial?.sender ?? "");
  const [receiver, setReceiver] = useState(initial?.receiver ?? "");
  const [language, setLanguage] = useState<Language>(initial?.language ?? "zh");
  const [title, setTitle] = useState(initial?.title ?? "");
  const [content, setContent] = useState(initial?.content ?? "");
  const [tags, setTags] = useState<string[]>(initial?.tags ?? []);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = (): boolean => {
    const e: Record<string, string> = {};
    if (!date) e.date = "请选择日期";
    if (!content.trim()) e.content = "请输入内容";
    if (content.length > 100000) e.content = "内容过长";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    await onSubmit({ date, platform, sender, receiver, language, title, content, tags });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5 max-w-2xl">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="日期"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className={errors.date ? "border-red-300" : ""}
        />

        <Select
          label="平台"
          options={PLATFORM_OPTIONS}
          value={platform}
          onChange={(e) => setPlatform(e.target.value)}
        />

        <Input
          label="发信人"
          value={sender}
          onChange={(e) => setSender(e.target.value)}
          placeholder="你自己 / 对方"
        />

        <Input
          label="收信人"
          value={receiver}
          onChange={(e) => setReceiver(e.target.value)}
          placeholder="对方 / 你自己"
        />

        <Select
          label="语言"
          options={LANGUAGES}
          value={language}
          onChange={(e) => setLanguage(e.target.value as Language)}
        />

        <Input
          label="标题 (可选)"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="简短描述这封信"
        />
      </div>

      <Textarea
        label="内容"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        rows={14}
        placeholder="在此粘贴或输入信件内容..."
        className={`font-serif text-base ${errors.content ? "border-red-300" : ""}`}
      />
      {errors.content && (
        <p className="text-sm text-red-500 -mt-3">{errors.content}</p>
      )}

      <TagInput label="标签" tags={tags} onChange={setTags} />

      <Button type="submit" disabled={loading}>
        {loading ? "保存中..." : "保存信件"}
      </Button>
    </form>
  );
}
