const fs = require("fs");
const path = require("path");
const { Lunar } = require("lunar-javascript");

// 最近 6 年
const START_YEAR = new Date().getFullYear();
const END_YEAR = START_YEAR + 5;

let result = {};

for (let year = START_YEAR; year <= END_YEAR; year++) {
  result[year] = {};

  for (let month = 1; month <= 12; month++) {
    const monthDays = Lunar.getMonthDays(year, month); // 获取该农历月的天数

    for (let day = 1; day <= monthDays; day++) {
      try {
        const lunar = Lunar.fromYmd(year, month, day); // 农历年月日
        if (lunar.isLeap()) continue; // 跳过闰月

        const solar = lunar.getSolar();
        const key = `${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
        const value = `${solar.getYear()}-${solar.getMonth()}-${solar.getDay()}`;

        result[year][key] = value;
      } catch (err) {
        // 超出日期范围或其他错误跳过
        continue;
      }
    }
  }
}

const OUTFILE = path.join(__dirname, "..", "lunar_solar.json");
fs.writeFileSync(OUTFILE, JSON.stringify(result, null, 2), "utf-8");
console.log(`✅ lunar_solar.json 已生成：${START_YEAR}~${END_YEAR}`);
