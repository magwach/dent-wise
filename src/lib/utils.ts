import { Gender } from "@/generated/prisma/enums";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatPhoneNumber = (value: string) => {
  if (!value) return value;

  const phoneNumber = value.replace(/[^\d]/g, "");
  const phoneNumberLength = phoneNumber.length;

  if (phoneNumberLength < 4) return phoneNumber;
  if (phoneNumberLength < 7) {
    return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3)}`;
  }
  return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3, 6)}-${phoneNumber.slice(6, 10)}`;
};

export function generateAvatar(name: string, gender: Gender) {
  const seed = name.replace(/\s+/g, "").toLowerCase();

  const style = gender === "FEMALE"
    ? "personas"
    : "adventurer";

  return `https://api.dicebear.com/7.x/${style}/svg?seed=${seed}`;
}
