import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const dataPath = path.join(root, "data.json");
const strict = process.argv.includes("--strict") || process.env.STRICT_DEPLOY_CHECK === "true";
const largeImageBytes = Number(process.env.MAX_IMAGE_BYTES || 900 * 1024);

function readJson(filePath) {
  try {
    return JSON.parse(fs.readFileSync(filePath, "utf8"));
  } catch (error) {
    console.error(`Cannot read ${path.relative(root, filePath)}: ${error.message}`);
    process.exit(1);
  }
}

function localUploadPath(url = "") {
  if (!url.startsWith("/uploads/")) return null;
  return path.join(root, "public", url.replace(/^\//, ""));
}

function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

if (!fs.existsSync(dataPath)) {
  console.error("Missing data.json.");
  process.exit(1);
}

const data = readJson(dataPath);
const cases = Array.isArray(data.cases) ? data.cases : [];
const problems = [];
const warnings = [];
let totalSlots = 0;
let filledSlots = 0;
let hiddenCases = 0;
let shareReadyCases = 0;

for (const block of cases) {
  const images = Array.isArray(block.images) ? block.images : [];
  const missing = images.filter((image) => !image?.url).length;
  const pairCount = Math.ceil(images.length / 2);
  const completePairs = [];

  if (block.hidden) hiddenCases += 1;

  images.forEach((image, index) => {
    totalSlots += 1;
    if (image?.url) filledSlots += 1;
    if (!image?.url) {
      warnings.push(`${block.navLabel || block.title}: slot ${index + 1} has no image.`);
      return;
    }

    const filePath = localUploadPath(image.url);
    if (!filePath) return;

    if (!fs.existsSync(filePath)) {
      warnings.push(`${block.navLabel || block.title}: ${image.url} does not exist.`);
      return;
    }

    const size = fs.statSync(filePath).size;
    if (size === 0) {
      warnings.push(`${block.navLabel || block.title}: ${image.url} is 0 B.`);
    } else if (size > largeImageBytes) {
      warnings.push(`${block.navLabel || block.title}: ${image.url} is large (${formatBytes(size)}).`);
    }
  });

  for (let index = 0; index < images.length; index += 2) {
    if (images[index]?.url && images[index + 1]?.url) {
      completePairs.push(index / 2);
    }
  }

  if (completePairs.length > 0) shareReadyCases += 1;
  if (images.length === 0 || pairCount === 0) {
    problems.push(`${block.navLabel || block.title}: no image slots configured.`);
  }
  if (missing > 0) {
    warnings.push(`${block.navLabel || block.title}: ${missing} image slot(s) still empty.`);
  }
}

console.log("Deploy readiness report");
console.log(`Cases: ${cases.length}`);
console.log(`Image slots: ${filledSlots}/${totalSlots}`);
console.log(`Share-ready cases: ${shareReadyCases}`);
console.log(`Hidden cases: ${hiddenCases}`);

if (warnings.length > 0) {
  console.log("\nWarnings:");
  warnings.slice(0, 40).forEach((item) => console.log(`- ${item}`));
  if (warnings.length > 40) {
    console.log(`- ...and ${warnings.length - 40} more`);
  }
}

if (problems.length > 0) {
  console.log("\nProblems:");
  problems.forEach((item) => console.log(`- ${item}`));
}

if (strict && (warnings.length > 0 || problems.length > 0)) {
  process.exit(1);
}

if (problems.length > 0) {
  process.exit(1);
}
