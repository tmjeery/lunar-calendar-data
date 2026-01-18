const fs = require("fs");
const path = require("path");
const { Solar, Lunar } = require("lunar-javascript");

// 设置我们要生成的农历年份范围
const START_YEAR = new Date().getFullYear();
const END_YEAR = START_YEAR + 3;

let result = {};

// 初始化我们要生成的 key
for (let y = START_YEAR; y <= END_YEAR; y++) {
  result[y] = {};
}

/**
 * 为了抓取完整的农历年，公历范围必须跨度更大。
 * 比如：农历 2025 年的最后一天可能是公历 2026 年的 2 月。
 */
let startDate = new Date(`${START_YEAR}-01-01`); 
// 结束日期设为目标年份次年的 3 月 1 日，确保完全覆盖农历腊月
let endDate = new Date(`${END_YEAR + 1}-03-01`); 

for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
  const solar = Solar.fromDate(d);
  const lunar = solar.getLunar();
  
  const lYear = lunar.getYear();   // 拿到该日期对应的农历年份
  const lMonth = lunar.getMonth(); // 拿到农历月份（负数表示闰月）
  const lDay = lunar.getDay();

  // 只有当这个日期属于我们想要的农历年份，且不是闰月时，才记录
  if (result[lYear]) {
    if (lMonth > 0) {
      const key = `${String(lMonth).padStart(2, "0")}-${String(lDay).padStart(2, "0")}`;
      const value = `${solar.getYear()}-${String(solar.getMonth()).padStart(2, "0")}-${String(solar.getDay()).padStart(2, "0")}`;
      
      result[lYear][key] = value;
    }
  }
}

// 写入文件
const OUTFILE = path.join(process.cwd(), "lunar_solar.json");
try {
  fs.writeFileSync(OUTFILE, JSON.stringify(result, null, 2), "utf-8");
  console.log(`✅ 成功生成 lunar_solar.json`);
  
  // 打印统计信息，检查每一年的天数是否正常（通常在 353-355 天之间）
  Object.keys(result).forEach(y => {
    console.log(`农历 ${y} 年: 已生成 ${Object.keys(result[y]).length} 天数据`);
  });
} catch (err) {
  console.error(`❌ 写入失败: ${err.message}`);
}
