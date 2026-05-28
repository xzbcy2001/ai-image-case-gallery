import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const dataPath = path.join(root, "data.json");
const publicDir = path.join(root, "public");
const publicDataPath = path.join(publicDir, "data.json");

if (!fs.existsSync(dataPath)) {
  console.error("Missing data.json. Finish your cases locally before building the static site.");
  process.exit(1);
}

let data;
try {
  data = JSON.parse(fs.readFileSync(dataPath, "utf8"));
} catch (error) {
  console.error("data.json is not valid JSON.");
  console.error(error.message);
  process.exit(1);
}

if (!Array.isArray(data.cases)) {
  console.error("data.json must include a cases array.");
  process.exit(1);
}

fs.mkdirSync(publicDir, { recursive: true });
fs.writeFileSync(publicDataPath, JSON.stringify(data, null, 2), "utf8");

console.log(`Prepared static data: ${path.relative(root, publicDataPath)}`);
console.log(`Cases: ${data.cases.length}`);
