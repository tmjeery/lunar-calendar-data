const fs = require("fs");
const { Lunar } = require("lunar-javascript");

const START_YEAR = new Date().getFullYear();
const END_YEAR = START_YEAR + 5;

let result = {};

for (let year = START_YEAR; year <= END_YEAR; year++) {
  result[year] = {};

  for (let month = 1; month <= 12; month++) {
    for (let day = 1; day <= 30; day++) {
      try {
        const lunar = Lunar.fromYmd(year, month, day);
        if (lunar.isLeap()) continue;
        if (lunar.getMonth() !== month || lunar.getDay() !== day) continue;

        const solar = lunar.getSolar();
        const key = `${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
        const value = `${solar.getYear()}-${solar.getMonth()}-${solar.getDay()}`;

        result[year][key] = value;
      } catch (_) {}
    }
  }
}

fs.writeFileSync("lunar_solar.json", JSON.stringify(result, null, 2));
console.log("done");
