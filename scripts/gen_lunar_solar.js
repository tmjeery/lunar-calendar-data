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

for (let year = START_YEAR; year <= END_YEAR; year++) {
  result[year] = {};

  // 遍历每个月农历日
  for (let month = 1; month <= 12; month++) {
    for (let day = 1; day <= 30; day++) {
      try {
        const lunar = Lunar.fromYm(year, month); // 获取该月对象
        if (day > lunar.getMonthDays()) break;   // 超过该月天数跳出
        const lunarDate = Lunar.fromYmd(year, month, day);
        if (lunarDate.isLeap()) continue;       // 跳过闰月

        const solar = lunarDate.getSolar();
        const key = `${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
        const value = `${solar.getYear()}-${solar.getMonth()}-${solar.getDay()}`;
        result[year][key] = value;
      } catch (_) {
        continue;
      }
    }
  }
}

const OUTFILE = path.join(__dirname, "..", "lunar_solar.json");
fs.writeFileSync(OUTFILE, JSON.stringify(result, null, 2), "utf-8");
console.log(`✅ lunar_solar.json 已生成（${START_YEAR}~${END_YEAR}）`);
