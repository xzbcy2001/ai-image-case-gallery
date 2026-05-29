import express from "express";
import path from "path";
import fs from "fs";
import multer from "multer";
import { createServer as createViteServer } from "vite";

const PORT = Number(process.env.PORT) || 3000;
const MAX_UPLOAD_BYTES = 60 * 1024 * 1024;
const allowedImageExtensions = new Set([".jpg", ".jpeg", ".png", ".gif", ".webp", ".bmp", ".heic", ".svg"]);
const ignoredRuntimeFiles = ["**/data.json", "**/public/uploads/**", "**/output/**"];

function getSafeImageExtension(fileName = "", mimeType = "") {
  const ext = path.extname(fileName).toLowerCase();
  if (allowedImageExtensions.has(ext)) return ext;

  const subtype = mimeType.split("/")[1]?.split("+")[0]?.toLowerCase();
  if (!subtype) return ".png";
  return subtype === "jpeg" ? ".jpg" : `.${subtype}`;
}

function readDataFile(filePath: string) {
  try {
    return JSON.parse(fs.readFileSync(filePath, "utf-8"));
  } catch (err) {
    console.error("Failed to read data.json", err);
    return { cases: [], siteConfig: {} };
  }
}

function writeJson(filePath: string, data: unknown) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf-8");
}

async function startServer() {
  const app = express();

  app.use(express.json({ limit: "60mb" }));

  // Ensure public and public/uploads directory exists
  const publicDir = path.join(process.cwd(), "public");
  const uploadsDir = path.join(publicDir, "uploads");
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }

  // Setup data.json
  const dataFile = path.join(process.cwd(), "data.json");
  if (!fs.existsSync(dataFile)) {
    writeJson(dataFile, { cases: [], siteConfig: {} });
  }

  // Explicitly serve uploads folder so Vite doesn't miss new files
  app.use("/uploads", express.static(uploadsDir, { maxAge: "7d", immutable: true }));

  // File upload configuration
  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, uploadsDir);
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      const ext = getSafeImageExtension(file.originalname, file.mimetype);
      cb(null, file.fieldname + "-" + uniqueSuffix + ext);
    },
  });
  const upload = multer({
    storage,
    limits: { fileSize: MAX_UPLOAD_BYTES },
    fileFilter: function (req, file, cb) {
      const isImage = file.mimetype.startsWith("image/") || allowedImageExtensions.has(path.extname(file.originalname).toLowerCase());
      cb(null, isImage);
    },
  });

  function buildStoredUploadPayload(fileName: string, size: number) {
    return {
      url: `/uploads/${fileName}`,
      projectStored: true,
      storedInProject: true,
      storedPath: `public/uploads/${fileName}`,
      size,
    };
  }

  // API Route: Handle file uploads
  app.post("/api/upload", upload.single("file"), (req, res) => {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }
    res.json(buildStoredUploadPayload(req.file.filename, req.file.size));
  });

  // API Route: Handle base64 uploads
  app.post("/api/upload-base64", (req, res) => {
    try {
      const { fileBase64, fileName } = req.body;
      if (!fileBase64) {
        return res.status(400).json({ error: "No file data" });
      }

      const matches = fileBase64.match(/^data:(image\/[a-zA-Z0-9.+-]+);base64,(.+)$/);
      if (!matches || matches.length !== 3) {
        return res.status(400).json({ error: "Invalid image data" });
      }

      const ext = getSafeImageExtension(fileName || ".png", matches[1]);
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      const outputFilename = "file-" + uniqueSuffix + ext;
      const outputPath = path.join(uploadsDir, outputFilename);

      fs.writeFileSync(outputPath, matches[2], "base64");
      const stats = fs.statSync(outputPath);

      res.json(buildStoredUploadPayload(outputFilename, stats.size));
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to upload" });
    }
  });

  // API Route: Save state
  app.post("/api/save", (req, res) => {
    const { cases, siteConfig } = req.body;
    if (Array.isArray(cases) && siteConfig && typeof siteConfig === "object") {
      writeJson(dataFile, { cases, siteConfig });
      res.json({ success: true });
    } else {
      res.status(400).json({ error: "Invalid data format" });
    }
  });

  // API Route: Load state
  app.get("/api/data", (req, res) => {
    if (fs.existsSync(dataFile)) {
      res.json(readDataFile(dataFile));
    } else {
      res.json({ cases: [], siteConfig: {} });
    }
  });

  // Vite Integration for dev & prod
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        watch: process.env.DISABLE_HMR === "true" ? null : { ignored: ignoredRuntimeFiles },
      },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    // Serve uploads explicitly for prod if not inside dist
    // Actually Vite copies public/ to dist/, so uploads inside public/ will be available at /uploads/
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
