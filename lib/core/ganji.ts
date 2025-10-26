// 10천간
const heavenlyStems = [
  { name: "갑", element: "목", yinYang: "양" },
  { name: "을", element: "목", yinYang: "음" },
  { name: "병", element: "화", yinYang: "양" },
  { name: "정", element: "화", yinYang: "음" },
  { name: "무", element: "토", yinYang: "양" },
  { name: "기", element: "토", yinYang: "음" },
  { name: "경", element: "금", yinYang: "양" },
  { name: "신", element: "금", yinYang: "음" },
  { name: "임", element: "수", yinYang: "양" },
  { name: "계", element: "수", yinYang: "음" },
];

// 12지지
const earthlyBranches = [
  { name: "자", element: "수" },
  { name: "축", element: "토" },
  { name: "인", element: "목" },
  { name: "묘", element: "목" },
  { name: "진", element: "토" },
  { name: "사", element: "화" },
  { name: "오", element: "화" },
  { name: "미", element: "토" },
  { name: "신", element: "금" },
  { name: "유", element: "금" },
  { name: "술", element: "토" },
  { name: "해", element: "수" },
];

// 천간/지지 접근 함수
export function getStem(index: number) {
  const mod = ((index % 10) + 10) % 10;
  return heavenlyStems[mod];
}

export function getBranch(index: number) {
  const mod = ((index % 12) + 12) % 12;
  return earthlyBranches[mod];
}

// 천간 → 오행 매핑
export function getElementByStem(stem: string): string {
  const map: Record<string, string> = {
    갑: "목", 을: "목",
    병: "화", 정: "화",
    무: "토", 기: "토",
    경: "금", 신: "금",
    임: "수", 계: "수",
  };
  return map[stem] ?? "";
}

export { heavenlyStems, earthlyBranches };