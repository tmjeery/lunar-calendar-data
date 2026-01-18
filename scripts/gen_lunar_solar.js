const fs = require("fs");
const path = require("path");
const { Lunar, Solar } = require("lunar-javascript");

const START_YEAR = 2026;
const END_YEAR = 2031;
const OUTFILE = path.join(__dirname, "..", "lunar_solar.json");

let result = {};

for (let year = START_YEAR; year <= END_YEAR; year++) {
  result[year] = {};

  for (let lunarMonth = 1; lunarMonth <= 12; lunarMonth++) {
    for (let lunarDay = 1; lunarDay <= 30; lunarDay++) {
      try {
        const lunar = Lunar.fromYmd(year, lunarMonth, lunarDay);
        if (lunar.isLeap()) continue; // 跳过闰月

        const solar = lunar.getSolar();
        // 验证 lunar 转 solar 再转回 lunar 是否匹配
        const checkLunar = solar.getLunar();
        if (checkLunar.getMonth() !== lunarMonth || checkLunar.getDay() !== lunarDay) continue;

        const key = `${String(lunarMonth).padStart(2, "0")}-${String(lunarDay).padStart(2, "0")}`;
        const value = `${solar.getYear()}-${solar.getMonth()}-${solar.getDay()}`;
        result[year][key] = value;
      } catch (err) {
        // 忽略无效日期
        // console.log(`skip ${year}-${lunarMonth}-${lunarDay} => ${err.message}`);
      }
    }
  }
}

fs.writeFileSync(OUTFILE, JSON.stringify(result, null, 2), "utf-8");
console.log("DONE, FILE:", OUTFILE);
