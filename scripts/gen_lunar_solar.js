const fs = require("fs");
const path = require("path");
const { Solar, Lunar } = require("lunar-javascript");

// 获取当前公历年份
const START_YEAR = new Date().getFullYear();
const END_YEAR = START_YEAR + 5;

let result = {};

// 初始化年份对象
for (let y = START_YEAR; y <= END_YEAR; y++) {
  result[y] = {};
}

// 遍历这 6 年里的每一天（公历）
// 稍微扩大范围，从 START_YEAR 的 1 月 1 日 到 END_YEAR 的 12 月 31 日
let startDate = new Date(`${START_YEAR}-01-01`);
let endDate = new Date(`${END_YEAR}-12-31`);

for (let d = startDate; d <= endDate; d.setDate(d.getDate() + 1)) {
  // 1. 获取公历对象
  const solar = Solar.fromDate(new Date(d));
  // 2. 转换为农历对象
  const lunar = solar.getLunar();
  
  const lYear = lunar.getYear();   // 农历年
  const lMonth = lunar.getMonth(); // 农历月
  const lDay = lunar.getDay();     // 农历日

  // 只记录我们在结果集中定义的年份
  if (result[lYear]) {
    // 排除闰月（根据你的需求）
    if (!lunar.isLeap()) {
      const key = `${String(lMonth).padStart(2, "0")}-${String(lDay).padStart(2, "0")}`;
      const value = `${solar.getYear()}-${String(solar.getMonth()).padStart(2, "0")}-${String(solar.getDay()).padStart(2, "0")}`;
      
      // 存入对应农历年的集合中
      result[lYear][key] = value;
    }
  }
}

const OUTFILE = path.join(process.cwd(), "lunar_solar.json");
try {
  fs.writeFileSync(OUTFILE, JSON.stringify(result, null, 2), "utf-8");
  console.log(`✅ 成功生成数据！`);
  console.log(`统计结果：`);
  Object.keys(result).forEach(y => {
    console.log(`${y}年: ${Object.keys(result[y]).length} 条数据`);
  });
} catch (err) {
  console.error(`❌ 写入文件失败: ${err.message}`);
}
