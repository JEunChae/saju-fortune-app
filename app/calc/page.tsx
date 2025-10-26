"use client";

import { useState } from "react";
import ResultCard from "./ResultCard";
import ResultDetail from "./ResultDetail";

// ---------------------------
// 🔹 타입 정의
// ---------------------------
interface Pillar {
  stem: string;
  branch: string;
  element: string;
  sibshin?: string;
  branchSibshin?: string[];
  unseong?: string;
}

interface Fortune {
  lifetime: string;
  yearly: string;
  caution: string;
  money: string;
  love: string;
  ability: string;
  health: string;
}

interface ResultType {
  year: Pillar;
  month: Pillar;
  day: Pillar;
  hour: Pillar;
  fortune?: Fortune;
}

// ---------------------------
// 🔹 컴포넌트
// ---------------------------
export default function Home() {
  const [birth, setBirth] = useState({ y: "", m: "", d: "", h: "" });
  const [result, setResult] = useState<ResultType | null>(null);
  const [loading, setLoading] = useState(false);
  const [showFortune, setShowFortune] = useState(false); // 운세 보기 버튼 상태

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setBirth((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // ✅ 필수값 검증
    if (!birth.y || !birth.m || !birth.d) {
      alert("출생 연도, 월, 일은 반드시 입력해주세요!");
      return;
    }

    setLoading(true);
    setResult(null);
    setShowFortune(false);

    try {
      const res = await fetch("/api/fortune/calc", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          y: Number(birth.y),
          m: Number(birth.m),
          d: Number(birth.d),
          h: Number(birth.h || 0),
        }),
      });

      const data: ResultType = await res.json();
      setResult(data);
    } catch (error) {
      console.error("API 호출 오류:", error);
      alert("서버 요청 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-yellow-100 via-amber-50 to-yellow-200 p-6">
      <h1 className="text-4xl font-bold text-gray-800 mb-10 tracking-tight drop-shadow">
        🔮 전통 명리 사주 계산기
      </h1>

      {/* 입력 폼 */}
      <form
        onSubmit={handleSubmit}
        className="bg-white/80 backdrop-blur-sm shadow-xl rounded-2xl p-8 w-full max-w-md border border-amber-200"
      >
        <div className="grid grid-cols-2 gap-4 mb-6">
          <input
            type="number"
            name="y"
            placeholder="출생 연도"
            value={birth.y}
            onChange={handleChange}
            className="p-3 rounded-xl border border-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-400 text-gray-700 placeholder:text-gray-400"
          />
          <input
            type="number"
            name="m"
            placeholder="출생 월"
            value={birth.m}
            onChange={handleChange}
            className="p-3 rounded-xl border border-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-400 text-gray-700 placeholder:text-gray-400"
          />
          <input
            type="number"
            name="d"
            placeholder="출생 일"
            value={birth.d}
            onChange={handleChange}
            className="p-3 rounded-xl border border-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-400 text-gray-700 placeholder:text-gray-400"
          />
          <input
            type="number"
            name="h"
            placeholder="출생 시 (0~23)"
            value={birth.h}
            onChange={handleChange}
            className="p-3 rounded-xl border border-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-400 text-gray-700 placeholder:text-gray-400"
          />
        </div>

        <button
          type="submit"
          className="w-full py-3 bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-500 hover:to-yellow-600 text-white font-semibold rounded-xl shadow-md transition focus:outline-none focus:ring-0"
        >
          {loading ? "계산 중..." : "✨ 사주 계산하기"}
        </button>
      </form>

      {/* 결과 영역 */}
      {result && result.year && (
        <div className="mt-10 w-full max-w-md animate-fadeIn">
          <ResultCard result={result} />

          {!showFortune && (
            <button
              onClick={() => setShowFortune(true)}
              className="mt-6 w-full py-3 bg-gradient-to-r from-indigo-400 to-blue-500 hover:from-indigo-500 hover:to-blue-600 text-white font-semibold rounded-xl shadow-md transition focus:outline-none focus:ring-0"
            >
              🔮 운세 리포트 보기
            </button>
          )}

          {showFortune && result.fortune && (
            <ResultDetail fortune={result.fortune} />
          )}
        </div>
      )}
    </main>
  );
}