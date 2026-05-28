import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const uploadsDir = path.join(root, "public", "uploads");
const apply = process.argv.includes("--apply");

if (!fs.existsSync(uploadsDir)) {
  console.log("No public/uploads directory found.");
  process.exit(0);
}

const zeroFiles = fs
  .readdirSync(uploadsDir)
  .map((fileName) => path.join(uploadsDir, fileName))
  .filter((filePath) => fs.statSync(filePath).isFile() && fs.statSync(filePath).size === 0);

if (zeroFiles.length === 0) {
  console.log("No 0 B upload files found.");
  process.exit(0);
}

console.log(`${zeroFiles.length} zero-byte upload file(s) found:`);
zeroFiles.forEach((filePath) => console.log(`- ${path.relative(root, filePath)}`));

if (!apply) {
  console.log("\nDry run only. Run `node scripts/clean-zero-uploads.mjs --apply` to delete them.");
  process.exit(0);
}

zeroFiles.forEach((filePath) => fs.rmSync(filePath));
console.log("Deleted zero-byte upload files.");
