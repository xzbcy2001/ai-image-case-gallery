import { spawnSync } from "node:child_process";
import path from "node:path";

const root = process.cwd();
const nodeBin = process.platform === "win32" ? "node.exe" : "node";
const viteCli = path.join(root, "node_modules", "vite", "bin", "vite.js");

function run(command, args, options = {}) {
  const result = spawnSync(command, args, {
    cwd: root,
    stdio: "inherit",
    shell: false,
    ...options,
  });

  if (result.status !== 0) {
    process.exit(result.status || 1);
  }
}

run(nodeBin, [path.join(root, "scripts", "prepare-static.mjs")]);
run(nodeBin, [viteCli, "build"], {
  env: {
    ...process.env,
    VITE_STATIC_SITE: "true",
  },
});
