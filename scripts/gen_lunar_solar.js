const fs = require("fs");
const path = require("path");
const { Lunar } = require("lunar-javascript");

const START_YEAR = new Date().getFullYear();
const END_YEAR = START_YEAR + 5;

const ROOT = process.env.GITHUB_WORKSPACE || path.join(__dirname, "..");
const OUTFILE = path.join(ROOT, "lunar_solar.json");

let result = {};

for (let year = START_YEAR; year <= END_YEAR; year++) {
  result[year] = {};

  for (let month = 1; month <= 12; month++) {
    for (let day = 1; day <= 30; day++) {
      try {
        const lunar = Lunar.fromYmd(year, month, day);
        if (lunar.isLeap()) continue;
        // 保证月份、日期匹配
        if (lunar.getMonth() !== month || lunar.getDay() !== day) continue;

        const solar = lunar.getSolar();
        const key = `${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
        const value = `${solar.getYear()}-${solar.getMonth()}-${solar.getDay()}`;
        result[year][key] = value;
      } catch (err) {
        // 打印错误，方便调试
        console.log(`Skip invalid date: ${year}-${month}-${day} => ${err.message}`);
      }
    }
  }
}

fs.writeFileSync(OUTFILE, JSON.stringify(result, null, 2), "utf-8");
console.log("DONE, FILE:", OUTFILE);
