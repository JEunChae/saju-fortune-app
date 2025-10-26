"use client";
import React from "react";

type Pillar = {
  stem: string;          // 천간
  branch: string;        // 지지
  element: string;       // 오행
  sibshin?: string;      // 천간 기준 십신
  branchSibshin?: string[]; // 지지 십신
  unseong?: string;      // 12운성
};

type Props = {
  result: {
    year: Pillar;
    month: Pillar;
    day: Pillar;
    hour: Pillar;
  };
};

const elementColors: Record<string, string> = {
  목: "bg-green-100 text-green-700 border-green-300",
  화: "bg-red-100 text-red-700 border-red-300",
  토: "bg-yellow-100 text-yellow-800 border-yellow-300",
  금: "bg-gray-100 text-gray-700 border-gray-300",
  수: "bg-blue-100 text-blue-700 border-blue-300",
};

const stemHanjas = {
  갑: "甲", 을: "乙", 병: "丙", 정: "丁", 무: "戊",
  기: "己", 경: "庚", 신: "辛", 임: "壬", 계: "癸",
} as const;

const branchHanjas = {
  자: "子", 축: "丑", 인: "寅", 묘: "卯", 진: "辰", 사: "巳",
  오: "午", 미: "未", 신: "申", 유: "酉", 술: "戌", 해: "亥",
} as const;

const branchElements = {
  자: "수", 축: "토", 인: "목", 묘: "목", 진: "토",
  사: "화", 오: "화", 미: "토", 신: "금", 유: "금",
  술: "토", 해: "수",
} as const;

export default function ResultCard({ result }: Props) {
  const pillars = [
    { title: "연柱", ...result.year },
    { title: "월柱", ...result.month },
    { title: "일柱", ...result.day },
    { title: "시柱", ...result.hour },
  ];

  return (
    <div className="bg-gradient-to-br from-yellow-50 to-amber-100 border-2 border-amber-300 rounded-2xl shadow-xl p-6 text-center">
      <h2 className="text-2xl font-bold text-gray-900 mb-8 tracking-tight">
        🔮 사주 8기둥 오행 + 십신 분석
      </h2>

      {/* 열 제목 */}
      <div className="grid grid-cols-4 mb-3">
        {pillars.map((p, i) => (
          <div key={`title-${i}`} className="text-lg font-semibold text-amber-700">
            {p.title}
          </div>
        ))}
      </div>

      {/* 위 행: 천간 + 십신 */}
      <div className="grid grid-cols-4 gap-4 mb-4">
        {pillars.map((p, i) => (
          <div
            key={`stem-${i}`}
            className={`rounded-xl border shadow-sm py-3 flex flex-col justify-center items-center ${elementColors[p.element]}`}
          >
            <div className="text-2xl font-bold">
              {stemHanjas[p.stem as keyof typeof stemHanjas]}{" "}
              <span className="text-sm text-gray-600">({p.stem})</span>
            </div>
            <div className="text-sm mt-1 opacity-90">
              {p.element === "목" ? "木(목)" :
               p.element === "화" ? "火(화)" :
               p.element === "토" ? "土(토)" :
               p.element === "금" ? "金(금)" :
               p.element === "수" ? "水(수)" : ""}
            </div>
            {p.sibshin && (
              <div className="text-xs text-gray-700 mt-1 font-medium">{p.sibshin}</div>
            )}
          </div>
        ))}
      </div>

      {/* 아래 행: 지지 + 12운성 */}
      <div className="grid grid-cols-4 gap-4">
        {pillars.map((p, i) => (
          <div
            key={`branch-${i}`}
            className={`rounded-xl border shadow-sm py-3 flex flex-col justify-center items-center ${
              elementColors[branchElements[p.branch as keyof typeof branchElements]]
            }`}
          >
            <div className="text-2xl font-bold">
              {branchHanjas[p.branch as keyof typeof branchHanjas]}{" "}
              <span className="text-sm text-gray-600">({p.branch})</span>
            </div>
            <div className="text-sm mt-1 opacity-90">
              {branchElements[p.branch as keyof typeof branchElements] === "목" ? "木(목)" :
               branchElements[p.branch as keyof typeof branchElements] === "화" ? "火(화)" :
               branchElements[p.branch as keyof typeof branchElements] === "토" ? "土(토)" :
               branchElements[p.branch as keyof typeof branchElements] === "금" ? "金(금)" :
               branchElements[p.branch as keyof typeof branchElements] === "수" ? "水(수)" : ""}
            </div>

            {p.unseong && (
              <div className="text-[11px] text-gray-500 mt-1 italic">{p.unseong}</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}