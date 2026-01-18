/**
 * gen_lunar_solar.js
 * 最近 6 年农历 → 公历映射
 */
const fs = require("fs");
const path = require("path");
const { Lunar } = require("lunar-javascript");

const START_YEAR = new Date().getFullYear();
const END_YEAR = START_YEAR + 5;

let result = {};

// 遍历最近 6 年
for (let year = START_YEAR; year <= END_YEAR; year++) {
  result[year] = {};

  // 遍历 1~12 月
  for (let month = 1; month <= 12; month++) {
    const lunarMonth = Lunar.fromYm(year, month); // 获取该月农历信息
    const monthDays = lunarMonth.getMonthDays();   // 获取该月天数（29 或 30）

    for (let day = 1; day <= monthDays; day++) {
      const lunarDate = Lunar.fromYmd(year, month, day);
      if (lunarDate.isLeap()) continue;           // 跳过闰月
      const solar = lunarDate.getSolar();
      const key = `${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
      const value = `${solar.getYear()}-${solar.getMonth()}-${solar.getDay()}`;
      result[year][key] = value;
    }
  }
}

// 写入文件
const OUTFILE = path.join(__dirname, "..", "lunar_solar.json");
fs.writeFileSync(OUTFILE, JSON.stringify(result, null, 2), "utf-8");
console.log(`✅ lunar_solar.json 已生成（${START_YEAR}~${END_YEAR}）`);
