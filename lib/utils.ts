import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const parseStringify = (value: any) => JSON.parse(JSON.stringify(value));

export const getAccessType = (userType: UserType) => {
  switch (userType) {
    case "creator":
      return ["room:write"];
    case "editor":
      return ["room:write"];
    case "viewer":
      return ["room:read", "room:presence:write"];
    default:
      return ["room:read", "room:presence:write"];
  }
};

function toChinaTime(utcDate: string): Date {
  const date = new Date(utcDate);
  return new Date(date.getTime() + 8 * 60 * 60 * 1000); // 转换为 UTC+8
}

export const dateConverter = (timestamp: string): string => {
   // 将UTC时间转换为中国时区（CST，UTC+8）
   const utcDate = new Date(timestamp);
   const cstDate = new Date(utcDate.getTime() + 8 * 60 * 60 * 1000);

   // 获取当前时间
   const now = new Date();

   // 计算时间差（以毫秒为单位）
   const timeDifference = now.getTime() - cstDate.getTime();

   // 将时间差转换为秒、分钟、小时和天
   const secondsDifference = Math.floor(timeDifference / 1000);
   const minutesDifference = Math.floor(secondsDifference / 60);
   const hoursDifference = Math.floor(minutesDifference / 60);
   const daysDifference = Math.floor(hoursDifference / 24);

   // 根据时间差返回相应的字符串
   if (timeDifference < 60 * 1000) {
       return "刚刚"; // 小于1分钟
   } else if (minutesDifference < 60) {
       return `${minutesDifference}分钟之前`;
   } else if (hoursDifference < 24) {
       return `${hoursDifference}小时之前`;
   } else {
       return `${daysDifference}天之前`;
   }
};

// Function to generate a random color in hex format, excluding specified colors
export function getRandomColor() {
  const avoidColors = ["#000000", "#FFFFFF", "#8B4513"]; // Black, White, Brown in hex format

  let randomColor;
  do {
    // Generate random RGB values
    const r = Math.floor(Math.random() * 256); // Random number between 0-255
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);

    // Convert RGB to hex format
    randomColor = `#${r.toString(16)}${g.toString(16)}${b.toString(16)}`;
  } while (avoidColors.includes(randomColor));

  return randomColor;
}

export const brightColors = [
  "#2E8B57", // Darker Neon Green
  "#FF6EB4", // Darker Neon Pink
  "#00CDCD", // Darker Cyan
  "#FF00FF", // Darker Neon Magenta
  "#FF007F", // Darker Bright Pink
  "#FFD700", // Darker Neon Yellow
  "#00CED1", // Darker Neon Mint Green
  "#FF1493", // Darker Neon Red
  "#00CED1", // Darker Bright Aqua
  "#FF7F50", // Darker Neon Coral
  "#9ACD32", // Darker Neon Lime
  "#FFA500", // Darker Neon Orange
  "#32CD32", // Darker Neon Chartreuse
  "#ADFF2F", // Darker Neon Yellow Green
  "#DB7093", // Darker Neon Fuchsia
  "#00FF7F", // Darker Spring Green
  "#FFD700", // Darker Electric Lime
  "#FF007F", // Darker Bright Magenta
  "#FF6347", // Darker Neon Vermilion
];

export function getUserColor(userId: string) {
  let sum = 0;
  for (let i = 0; i < userId.length; i++) {
    sum += userId.charCodeAt(i);
  }

  const colorIndex = sum % brightColors.length;
  return brightColors[colorIndex];
}
