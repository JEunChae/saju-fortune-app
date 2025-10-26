import { getStem, getBranch, getElementByStem } from "./ganji";

/** 절입 기준표 (입춘~입동) */
const SOLAR_TERMS = [
  { month: 1, day: 6 },
  { month: 2, day: 4 },
  { month: 3, day: 6 },
  { month: 4, day: 5 },
  { month: 5, day: 6 },
  { month: 6, day: 6 },
  { month: 7, day: 7 },
  { month: 8, day: 8 },
  { month: 9, day: 8 },
  { month: 10, day: 8 },
  { month: 11, day: 7 },
  { month: 12, day: 7 },
];

function getMonthBranchBySolarTerm(month: number, day: number): number {
  const term = SOLAR_TERMS[month - 1];
  if (!term) return 0;
  const branchIndex = day < term.day ? (month + 11) % 12 : (month + 12) % 12;
  return (branchIndex + 12) % 12;
}

function getStartStemIndexByYearStem(yearStemChar: string): number {
  if (["갑", "기"].includes(yearStemChar)) return 2;
  if (["을", "경"].includes(yearStemChar)) return 4;
  if (["병", "신"].includes(yearStemChar)) return 6;
  if (["정", "임"].includes(yearStemChar)) return 8;
  if (["무", "계"].includes(yearStemChar)) return 0;
  return 0;
}

function calculateMonthPillar(yearStemChar: string, month: number, day: number) {
  const monthBranchIdx = getMonthBranchBySolarTerm(month, day);
  const monthBranch = getBranch(monthBranchIdx);
  const startStemIdx = getStartStemIndexByYearStem(yearStemChar);
  const offset = (monthBranchIdx - 2 + 12) % 12;
  const monthStem = getStem((startStemIdx + offset) % 10);
  return { stem: monthStem, branch: monthBranch };
}

function toJulianDay(year: number, month: number, day: number): number {
  if (month <= 2) {
    year -= 1;
    month += 12;
  }
  const A = Math.floor(year / 100);
  const B = 2 - A + Math.floor(A / 4);
  return (
    Math.floor(365.25 * (year + 4716)) +
    Math.floor(30.6001 * (month + 1)) +
    day +
    B -
    1524.5
  );
}

function adjustYearByIpchun(year: number, month: number, day: number): number {
  if (month < 2 || (month === 2 && day < 4)) return year - 1;
  return year;
}

/** 시지 */
const hourBranches = ["자","축","인","묘","진","사","오","미","신","유","술","해"];

const hourStemMap: Record<string, string[]> = {
  갑: ["갑","을","병","정","무","기","경","신","임","계","갑","을"],
  을: ["병","정","무","기","경","신","임","계","갑","을","병","정"],
  병: ["무","기","경","신","임","계","갑","을","병","정","무","기"],
  정: ["경","신","임","계","갑","을","병","정","무","기","경","신"],
  무: ["임","계","갑","을","병","정","무","기","경","신","임","계"],
  기: ["갑","을","병","정","무","기","경","신","임","계","갑","을"],
  경: ["병","정","무","기","경","신","임","계","갑","을","병","정"],
  신: ["무","기","경","신","임","계","갑","을","병","정","무","기"],
  임: ["경","신","임","계","갑","을","병","정","무","기","경","신"],
  계: ["임","계","갑","을","병","정","무","기","경","신","임","계"],
};

/** 십신 계산 */
function getSibshin(dayStem: string, targetStem: string): string {
  type Element = "목" | "화" | "토" | "금" | "수";
  const elementMap: Record<string, Element> = {
    갑: "목", 을: "목", 병: "화", 정: "화",
    무: "토", 기: "토", 경: "금", 신: "금", 임: "수", 계: "수",
  };
  const generate: Record<Element, Element> = {
    목: "화", 화: "토", 토: "금", 금: "수", 수: "목",
  };
  const control: Record<Element, Element> = {
    목: "토", 화: "금", 토: "수", 금: "목", 수: "화",
  };
  const dayEl = elementMap[dayStem];
  const targetEl = elementMap[targetStem];
  const sameEl = dayEl === targetEl;
  const isYangSame =
    ["갑","병","무","경","임"].includes(dayStem) ===
    ["갑","병","무","경","임"].includes(targetStem);
  if (sameEl && isYangSame) return "비견";
  if (sameEl && !isYangSame) return "겁재";
  if (generate[dayEl] === targetEl && isYangSame) return "식신";
  if (generate[dayEl] === targetEl && !isYangSame) return "상관";
  if (control[dayEl] === targetEl && isYangSame) return "편재";
  if (control[dayEl] === targetEl && !isYangSame) return "정재";
  if (control[targetEl] === dayEl && isYangSame) return "편관";
  if (control[targetEl] === dayEl && !isYangSame) return "정관";
  if (generate[targetEl] === dayEl && isYangSame) return "편인";
  if (generate[targetEl] === dayEl && !isYangSame) return "정인";
  return "";
}

/** ✅ 12운성 계산 (본기 기준) */
function getUnseong(dayStem: string, branch: string): string {
  const table: Record<string, string[]> = {
    갑: ["사","묘","절","태","양","장생","목욕","관대","건록","제왕","쇠","병"],
    을: ["병","사","묘","절","태","양","장생","목욕","관대","건록","제왕","쇠"],
    병: ["묘","절","태","양","장생","목욕","관대","건록","제왕","쇠","병","사"],
    정: ["절","태","양","장생","목욕","관대","건록","제왕","쇠","병","사","묘"],
    무: ["태","양","장생","목욕","관대","건록","제왕","쇠","병","사","묘","절"],
    기: ["양","장생","목욕","관대","건록","제왕","쇠","병","사","묘","절","태"],
    경: ["장생","목욕","관대","건록","제왕","쇠","병","사","묘","절","태","양"],
    신: ["목욕","관대","건록","제왕","쇠","병","사","묘","절","태","양","장생"],
    임: ["관대","건록","제왕","쇠","병","사","묘","절","태","양","장생","목욕"],
    계: ["건록","제왕","쇠","병","사","묘","절","태","양","장생","목욕","관대"],
  };
  const branches = ["자","축","인","묘","진","사","오","미","신","유","술","해"];
  const idx = branches.indexOf(branch);
  return idx >= 0 ? table[dayStem][idx] : "";
}

/** ✅ 지지 십신 (본기 기준) */
function getBranchSibshin(dayStem: string, branch: string): string {
  const mainStemMap: Record<string, string> = {
    자: "계", 축: "기", 인: "갑", 묘: "을",
    진: "무", 사: "병", 오: "정", 미: "기",
    신: "경", 유: "신", 술: "무", 해: "임",
  };
  const mainStem = mainStemMap[branch];
  return mainStem ? getSibshin(dayStem, mainStem) : "";
}

/** 최종 4기둥 계산기 */
export function calculatePillars(y: number, m: number, d: number, h: number) {
  const adjYear = adjustYearByIpchun(y, m, d);
  const yearStemIdx = (adjYear - 4) % 10;
  const yearBranchIdx = (adjYear - 4) % 12;
  const yearStem = getStem(yearStemIdx);
  const yearBranch = getBranch(yearBranchIdx);
  const { stem: monthStem, branch: monthBranch } = calculateMonthPillar(yearStem.name, m, d);
  const jd = Math.floor(toJulianDay(y, m, d) + 0.5);
  const dayStem = getStem((jd + 9) % 10);
  const dayBranch = getBranch((jd + 1) % 12);
  const hourIdx = Math.floor((h + 1) / 2) % 12;
  const hourBranch = getBranch(hourIdx);
  const hourStem = { name: hourStemMap[dayStem.name][hourIdx] };
  const ds = dayStem.name;

  return {
    year: { stem: yearStem.name, branch: yearBranch.name, element: getElementByStem(yearStem.name),
            sibshin: getSibshin(ds, yearStem.name), branchSibshin: getBranchSibshin(ds, yearBranch.name),
            unseong: getUnseong(ds, yearBranch.name) },
    month: { stem: monthStem.name, branch: monthBranch.name, element: getElementByStem(monthStem.name),
             sibshin: getSibshin(ds, monthStem.name), branchSibshin: getBranchSibshin(ds, monthBranch.name),
             unseong: getUnseong(ds, monthBranch.name) },
    day: { stem: dayStem.name, branch: dayBranch.name, element: getElementByStem(dayStem.name),
           sibshin: "일원", branchSibshin: getBranchSibshin(ds, dayBranch.name),
           unseong: getUnseong(ds, dayBranch.name) },
    hour: { stem: hourStem.name, branch: hourBranch.name, element: getElementByStem(hourStem.name),
            sibshin: getSibshin(ds, hourStem.name), branchSibshin: getBranchSibshin(ds, hourBranch.name),
            unseong: getUnseong(ds, hourBranch.name) },
  };
}