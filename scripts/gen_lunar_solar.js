const fs = require("fs");
const path = require("path");
const { Solar, Lunar } = require("lunar-javascript");

// 定义我们需要获取的农历年份范围
const CURRENT_YEAR = new Date().getFullYear();
const START_YEAR = CURRENT_YEAR - 1; // 包含去年，确保覆盖当前农历年底
const END_YEAR = CURRENT_YEAR + 3;

let result = {};

// 1. 初始化容器：确保我们要的年份都有对应的 Key
for (let y = START_YEAR; y <= END_YEAR; y++) {
  result[y] = {};
}

/**
 * 2. 扩大公历遍历范围：
 * 从 START_YEAR 的元旦开始，一直遍历到 END_YEAR 结束后的 3 个月
 * 这样可以确保即便农历年末跨到了公历次年 2 月，也能被捕捉到。
 */
let startDate = new Date(`${START_YEAR}-01-01`);
let endDate = new Date(`${END_YEAR + 1}-03-01`); 


for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
  const solar = Solar.fromDate(d);
  const lunar = solar.getLunar();
  
  const lYear = lunar.getYear(); 
  const lMonth = lunar.getMonth(); // 关键：lunar-javascript 中，闰月返回负数，例如闰四月返回 -4
  const lDay = lunar.getDay();

  if (result[lYear]) {
    // 构造 Key
    let monthStr = String(Math.abs(lMonth)).padStart(2, "0");
    let dayStr = String(lDay).padStart(2, "0");
    
    // 如果是闰月，在前面加个 'R' (表示 Run)
    const key = (lMonth < 0 ? `R${monthStr}` : monthStr) + `-${dayStr}`;
    
    const value = solar.toYmd(); // 获取 YYYY-MM-DD 格式
    
    result[lYear][key] = value;
  }
}



// 4. 写入文件
const OUTFILE = path.join(process.cwd(), "lunar_solar.json");
try {
  fs.writeFileSync(OUTFILE, JSON.stringify(result, null, 2), "utf-8");
  console.log(`✅ 成功生成 lunar_solar.json (${START_YEAR}~${END_YEAR})`);
  
  // 5. 打印每一年抓取到的天数，农历平年应为 353-355 天
  Object.keys(result).forEach(y => {
    console.log(`农历 ${y} 年: 共 ${Object.keys(result[y]).length} 天`);
  });
} catch (err) {
  console.error(`❌ 写入失败: ${err.message}`);
}
