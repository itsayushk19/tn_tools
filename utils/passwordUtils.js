import { randomBytes } from "crypto";

export const countCheckedItems = (options) =>
  Object.values(options).filter(Boolean).length;

export const getColorFromStrengthScore = (score) => {
  const ranges = [
    { score: 0, strength: "V. Weak", color: "red" },
    { score: 20, strength: "Weak", color: "tangerine" },
    { score: 40, strength: "Weak", color: "orange" },
    { score: 60, strength: "Normal", color: "yellow" },
    { score: 70, strength: "Strong", color: "light green" },
    { score: 80, strength: "Strong", color: "green" },
    { score: 100, strength: "V. Strong", color: "very green" },
  ];

  for (const range of ranges) {
    if (score <= range.score) return { strength: range.strength, color: range.color };
  }

  return { strength: "V. Weak", color: "red" };
};

export const calculatePasswordScore = (length, options) => {
  const replacements = { 256: 129, 512: 130, 1024: 131, 2048: 132 };
  const effectiveLength = replacements[length] || length;
  const lengthScore = (effectiveLength * 70) / 132;
  const optionScore = (countCheckedItems(options) * 30) / 4;
  const score = lengthScore + optionScore;

  const { strength, color } = getColorFromStrengthScore(score);
  return { score, strength, color };
};

export const generatePassword = (length, options) => {
  const chars = [
    options.lowercase ? "abcdefghijklmnopqrstuvwxyz" : "",
    options.uppercase ? "ABCDEFGHIJKLMNOPQRSTUVWXYZ" : "",
    options.numbers ? "0123456789" : "",
    options.symbols ? "!@#$%^&*()_+-=[]{}|;:,.<>?" : "",
  ].join("");

  if (!chars) return "";

  let password = "";
  for (let i = 0; i < length; i++) {
    const index = randomBytes(1)[0] % chars.length;
    password += chars[index];
  }

  return password;
};
