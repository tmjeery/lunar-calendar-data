const fs = require("fs");
const path = require("path");
const { Solar, Lunar } = require("lunar-javascript");

const START_YEAR = new Date().getFullYear();
const END_YEAR = START_YEAR + 3;

let result = {};

for (let y = START_YEAR; y <= END_YEAR; y++) {
  result[y] = {};
}

// 遍历公历范围
let startDate = new Date(`${START_YEAR}-01-01`);
let endDate = new Date(`${END_YEAR + 1}-02-01`); // 多跑一个月确保覆盖农历年末

for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
  const solar = Solar.fromDate(d);
  const lunar = solar.getLunar();
  
  const lYear = lunar.getYear();
  const lMonth = lunar.getMonth(); // 关键：如果该月是闰月，getMonth() 会返回负数
  const lDay = lunar.getDay();

  if (result[lYear]) {
    // 只有 lMonth > 0 时才是正式月份（排除负数的闰月）
    if (lMonth > 0) {
      const key = `${String(lMonth).padStart(2, "0")}-${String(lDay).padStart(2, "0")}`;
      const value = `${solar.getYear()}-${String(solar.getMonth()).padStart(2, "0")}-${String(solar.getDay()).padStart(2, "0")}`;
      
      result[lYear][key] = value;
    }
  }
}

const OUTFILE = path.join(process.cwd(), "lunar_solar.json");
try {
  fs.writeFileSync(OUTFILE, JSON.stringify(result, null, 2), "utf-8");
  console.log(`✅ 成功生成 lunar_solar.json`);
  Object.keys(result).forEach(y => {
    console.log(`${y}年农历数据: ${Object.keys(result[y]).length} 天`);
  });
} catch (err) {
  console.error(`❌ 写入失败: ${err.message}`);
}
