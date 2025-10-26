// app/api/fortune/calc/route.ts
import { NextResponse } from "next/server";
import { calculatePillars } from "@/lib/core/pillarCalculator";
import {PillarSet, interpretFortuneDetail } from "@/lib/core/interpretFortuneDetail";


export async function POST(req: Request) {
  const { y, m, d, h } = await req.json();

  const pillars = calculatePillars(y, m, d, h);
  const fortune = interpretFortuneDetail(pillars as unknown as PillarSet, y);

  // ✅ 구조 통일: year, month, day, hour 바로 접근 가능
  return Response.json({
    ...pillars, // year, month, day, hour
    fortune,    // 운세 데이터
  });
}