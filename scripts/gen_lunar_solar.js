const fs = require("fs");
const path = require("path");
const { Solar, Lunar } = require("lunar-javascript");

const START_YEAR = new Date().getFullYear();
const END_YEAR = START_YEAR + 5;

let result = {};

for (let year = START_YEAR; year <= END_YEAR; year++) {
  result[year] = {};
  
  // 建议：遍历公历每一天，反查农历，这样绝对不会溢出或报错
  // 或者修正农历逻辑：
  for (let m = 1; m <= 12; m++) {
    // 注意：这里需要遍历农历月
    for (let d = 1; d <= 30; d++) {
      try {
        const lunar = Lunar.fromYmd(year, m, d);
        if (lunar.isLeap()) continue; // 跳过闰月

        const solar = lunar.getSolar();
        const key = `${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
        const value = `${solar.getYear()}-${String(solar.getMonth()).padStart(2, "0")}-${String(solar.getDay()).padStart(2, "0")}`;

        result[year][key] = value;
      } catch (err) {
        // 当 d=30 但农历月只有29天时，fromYmd 会报错，直接跳过即可
        continue;
      }
    }
  }
}

// 修正路径：直接写入命令执行时所在的根目录
const OUTFILE = path.join(process.cwd(), "lunar_solar.json");
fs.writeFileSync(OUTFILE, JSON.stringify(result, null, 2), "utf-8");
console.log(`✅ 已生成：${OUTFILE}`);
