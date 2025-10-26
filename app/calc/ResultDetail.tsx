"use client";
import React, { useState } from "react";

type Fortune = {
  lifetime: string;
  yearly: string;
  caution: string;
  money: string;
  love: string;
  ability: string;
  health: string;
};

type Props = {
  fortune: Fortune;
};

export default function ResultDetail({ fortune }: Props) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const items = [
    { title: "🌿 평생사주 (대운 분석)", key: "lifetime", color: "from-emerald-100 to-green-50" },
    { title: "☀️ 올해운세", key: "yearly", color: "from-amber-100 to-yellow-50" },
    { title: "⚠️ 올해 주의할 점", key: "caution", color: "from-red-100 to-rose-50" },
    { title: "💰 재물운", key: "money", color: "from-yellow-100 to-amber-50" },
    { title: "💞 애정운", key: "love", color: "from-pink-100 to-rose-50" },
    { title: "💼 능력 / 직업운", key: "ability", color: "from-indigo-100 to-blue-50" },
    { title: "🩺 건강운", key: "health", color: "from-teal-100 to-cyan-50" },
  ];

  return (
    <div className="mt-8 space-y-4">
      <h3 className="text-2xl font-bold text-gray-800 text-center mb-6">
        🔮 상세 운세 리포트
      </h3>

      {items.map((item, idx) => {
        const content = fortune[item.key as keyof Fortune];
        const isOpen = openIndex === idx;

        return (
          <div
            key={idx}
            className={`rounded-2xl shadow-md border border-amber-200 overflow-hidden transition-all duration-300 bg-gradient-to-br ${item.color}`}
          >
            <button
              onClick={() => setOpenIndex(isOpen ? null : idx)}
              className="w-full flex justify-between items-center p-4 font-semibold text-gray-900 hover:bg-white/50 transition"
            >
              <span>{item.title}</span>
              <span
                className={`transform transition-transform duration-200 ${
                  isOpen ? "rotate-90 text-amber-600" : "rotate-0 text-gray-500"
                }`}
              >
                ▶
              </span>
            </button>

            {isOpen && (
              <div className="p-5 text-gray-800 text-sm leading-relaxed whitespace-pre-line bg-white/60 border-t border-amber-100">
                {content}
              </div>
            )}
          </div>
        );
      })}

      <p className="text-xs text-gray-500 text-center mt-4">
        ※ 본 해석은 전통 명리 이론을 기반으로 한 참고 해석입니다.
      </p>
    </div>
  );
}