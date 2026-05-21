"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

interface TagInputProps {
  label?: string;
  tags: string[];
  onChange: (tags: string[]) => void;
  className?: string;
}

export function TagInput({ label, tags, onChange, className }: TagInputProps) {
  const [input, setInput] = useState("");

  const addTag = () => {
    const trimmed = input.trim();
    if (trimmed && !tags.includes(trimmed)) {
      onChange([...tags, trimmed]);
    }
    setInput("");
  };

  const removeTag = (index: number) => {
    onChange(tags.filter((_, i) => i !== index));
  };

  return (
    <div className={cn("space-y-1.5", className)}>
      {label && <p className="text-sm text-warm-500">{label}</p>}
      <div className="flex flex-wrap gap-1.5 mb-2">
        {tags.map((tag, i) => (
          <span
            key={i}
            className="inline-flex items-center gap-1 px-2 py-0.5 bg-cream-200 text-warm-700 rounded-md text-xs"
          >
            {tag}
            <button
              type="button"
              onClick={() => removeTag(i)}
              className="text-warm-300 hover:text-warm-700 transition-colors"
            >
              ×
            </button>
          </span>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              addTag();
            }
          }}
          placeholder="输入标签, 按 Enter 添加"
          className="flex-1 px-3 py-1.5 bg-white border border-cream-300 rounded-lg text-sm
                     text-warm-700 placeholder-warm-300 focus:outline-none focus:border-accent"
        />
        <button
          type="button"
          onClick={addTag}
          className="px-3 py-1.5 text-sm text-accent hover:text-accent-hover transition-colors"
        >
          添加
        </button>
      </div>
    </div>
  );
}
