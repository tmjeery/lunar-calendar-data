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

  // 遍历每个月
  for (let month = 1; month <= 12; month++) {
    // 农历每个月最多30天
    for (let day = 1; day <= 30; day++) {
      try {
        const lunar = Lunar.fromYmd(year, month, day);
        // 如果是闰月或者公历日期和农历不匹配，跳过
        if (lunar.isLeap() || lunar.getMonth() !== month || lunar.getDay() !== day) continue;

        const solar = lunar.getSolar();
        const key = `${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
        const value = `${solar.getYear()}-${solar.getMonth()}-${solar.getDay()}`;

        result[year][key] = value;
      } catch (_) {
        // 日期超出范围会报错，直接跳过
        continue;
      }
    }
  }
}

// 写入文件
const OUTFILE = path.join(__dirname, "..", "lunar_solar.json");
fs.writeFileSync(OUTFILE, JSON.stringify(result, null, 2), "utf-8");

console.log(`✅ lunar_solar.json 已生成（${START_YEAR}~${END_YEAR}）`);
