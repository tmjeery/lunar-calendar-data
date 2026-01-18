/**
 * gen_lunar_solar.js
 * 生成最近 6 年农历 → 公历映射 lunar_solar.json
 */

const fs = require("fs");
const path = require("path");
const { Lunar } = require("lunar-javascript");

const START_YEAR = new Date().getFullYear();
const END_YEAR = START_YEAR + 5;

let result = {};

for (let year = START_YEAR; year <= END_YEAR; year++) {
  result[year] = {};

  for (let lunarMonth = 1; lunarMonth <= 12; lunarMonth++) {
    for (let lunarDay = 1; lunarDay <= 30; lunarDay++) {
      try {
        const lunar = Lunar.fromYmd(year, lunarMonth, lunarDay);
        if (lunar.isLeap()) continue; // 跳过闰月

        // 获取对应公历
        const solar = lunar.getSolar();
        const key = `${String(lunarMonth).padStart(2, "0")}-${String(lunarDay).padStart(2, "0")}`;
        const value = `${solar.getYear()}-${solar.getMonth()}-${solar.getDay()}`;

        result[year][key] = value;
      } catch (_) {
        continue; // 超出该月天数直接跳过
      }
    }
  }
}

const OUTFILE = path.join(__dirname, "..", "lunar_solar.json");
fs.writeFileSync(OUTFILE, JSON.stringify(result, null, 2), "utf-8");

console.log(`✅ lunar_solar.json 已生成（${START_YEAR}~${END_YEAR}）`);
