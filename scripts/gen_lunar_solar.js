const fs = require("fs");
const path = require("path");
const { Lunar } = require("lunar-javascript");

const START_YEAR = new Date().getFullYear();
const END_YEAR = START_YEAR + 5;

let result = {};

for (let year = START_YEAR; year <= END_YEAR; year++) {
  result[year] = {};

  // 农历一年通常 12 个月
  for (let month = 1; month <= 12; month++) {
    // 农历月最大 30 天，最小 29 天
    for (let day = 1; day <= 30; day++) {
      try {
        // 尝试创建农历对象
        const lunar = Lunar.fromYmd(year, month, day);
        
        // 排除闰月数据（根据你的原始需求）
        if (lunar.getYear() !== year || lunar.isLeap()) continue;

        const solar = lunar.getSolar();
        const key = `${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
        // 格式化公历日期为 YYYY-MM-DD
        const value = `${solar.getYear()}-${String(solar.getMonth()).padStart(2, "0")}-${String(solar.getDay()).padStart(2, "0")}`;

        result[year][key] = value;
      } catch (err) {
        // 如果日期不存在（比如小月没有30号），会自动跳过
        continue;
      }
    }
  }
}

// 确保写入路径正确（GitHub Action 环境下 process.cwd() 指向项目根目录）
const OUTFILE = path.join(process.cwd(), "lunar_solar.json");
fs.writeFileSync(OUTFILE, JSON.stringify(result, null, 2), "utf-8");
console.log(`✅ 成功生成数据到: ${OUTFILE}`);
