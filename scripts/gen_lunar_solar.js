const fs = require("fs");
const path = require("path");
const { Lunar } = require("lunar-javascript");

const START_YEAR = new Date().getFullYear();
const END_YEAR = START_YEAR + 5;

let result = {};

for (let year = START_YEAR; year <= END_YEAR; year++) {
  result[year] = {};

  // 遍历农历月份
  for (let month = 1; month <= 12; month++) {
    const lunarMonthDays = Lunar.getMonthDays(year, month); // 获取该农历月天数

    for (let day = 1; day <= lunarMonthDays; day++) {
      try {
        const lunar = Lunar.fromYmd(year, month, day);
        if (lunar.isLeap()) continue; // 跳过闰月

        const solar = lunar.getSolar();
        const key = `${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
        const value = `${solar.getYear()}-${solar.getMonth()}-${solar.getDay()}`;

        result[year][key] = value;
      } catch (e) {
        // 超出日期范围就跳过
        continue;
      }
    }
  }
}

const OUTFILE = path.join(__dirname, "..", "lunar_solar.json");
fs.writeFileSync(OUTFILE, JSON.stringify(result, null, 2), "utf-8");
console.log(`✅ lunar_solar.json 已生成：${START_YEAR}~${END_YEAR}`);
