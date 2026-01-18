/**
 * gen_lunar_solar.js
 * 生成 lunar_solar.json，支持 6 年（当前年份起）
 * 使用 lunar-javascript 库
 */

const fs = require("fs");
const path = require("path");
const { Lunar } = require("lunar-javascript");

// 生成年份范围
const START_YEAR = new Date().getFullYear();
const END_YEAR = START_YEAR + 5;

let result = {};

for (let year = START_YEAR; year <= END_YEAR; year++) {
  result[year] = {};

  for (let month = 1; month <= 12; month++) {
    for (let day = 1; day <= 30; day++) {
      try {
        const lunar = Lunar.fromYmd(year, month, day);

        // 跳过闰月
        if (lunar.isLeap()) continue;

        // 农历日和月不匹配直接跳过（避免不存在的日期）
        if (lunar.getMonth() !== month || lunar.getDay() !== day) continue;

        const solar = lunar.getSolar();
        const key = `${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
        const value = `${solar.getYear()}-${solar.getMonth()}-${solar.getDay()}`;

        result[year][key] = value;
      } catch (_) {
        // 日期非法直接跳过
      }
    }
  }
}

// 输出文件路径（仓库根目录）
const OUTFILE = path.resolve(process.cwd(), "lunar_solar.json");

// 写入文件
fs.writeFileSync(OUTFILE, JSON.stringify(result, null, 2), "utf-8");

// 打印日志，确认生成情况
const stats = fs.statSync(OUTFILE);
console.log("✅ lunar_solar.json 生成完成");
console.log("路径:", OUTFILE);
console.log("文件大小:", stats.size, "bytes");
console.log("最后修改时间:", stats.mtime);
