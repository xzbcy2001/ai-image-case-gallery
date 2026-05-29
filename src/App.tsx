import React, { useMemo, useRef, useState, useEffect } from "react";
import { createPortal } from "react-dom";
import {
  Upload,
  Plus,
  Trash2,
  Image as ImageIcon,
  ImageOff,
  Sparkles,
  PanelTop,
  Camera,
  Gift,
  Heart,
  CheckCircle2,
  Copy,
  ArrowRight,
  ArrowDown,
  ArrowUp,
  ChevronLeft,
  ChevronRight,
  Download,
  Eye,
  EyeOff,
  Pencil,
  GripVertical,
  Filter,
  FolderOpen,
  Images,
  ListChecks,
  Maximize2,
  Pause,
  Play,
  Presentation,
  RotateCcw,
  Share2,
  SlidersHorizontal,
  UserCheck,
  X,
} from "lucide-react";
import { motion } from "motion/react";

// Configuration and cases are loaded dynamically from the backend

const themeMap = {
  brown: {
    label: "复古金棕",
    bg: "bg-[#fdfaf6]",
    panel: "bg-white",
    ink: "text-[#4a3f35]",
    accent: "bg-[#8c7851]",
    accentText: "text-[#8c7851]",
    border: "border-[#8c7851]/20",
    chip: "bg-[#8c7851]/5 text-[#4a3f35] border-[#8c7851]/10",
    dark: "bg-[#4a3f35]",
  },
  gold: {
    label: "生日暖金",
    bg: "bg-[#fcf8f2]",
    panel: "bg-white",
    ink: "text-[#5c4a3d]",
    accent: "bg-[#c5b358]",
    accentText: "text-[#c5b358]",
    border: "border-[#c5b358]/20",
    chip: "bg-[#c5b358]/5 text-[#5c4a3d] border-[#c5b358]/10",
    dark: "bg-[#5c4a3d]",
  },
  red: {
    label: "中式酒红",
    bg: "bg-[#fcf5f5]",
    panel: "bg-white",
    ink: "text-[#4a3536]",
    accent: "bg-[#9d4447]",
    accentText: "text-[#9d4447]",
    border: "border-[#9d4447]/20",
    chip: "bg-[#9d4447]/5 text-[#4a3536] border-[#9d4447]/10",
    dark: "bg-[#4a3536]",
  },
  green: {
    label: "胶片墨绿",
    bg: "bg-[#f4f7f4]",
    panel: "bg-white",
    ink: "text-[#35483a]",
    accent: "bg-[#6a8470]",
    accentText: "text-[#6a8470]",
    border: "border-[#6a8470]/20",
    chip: "bg-[#6a8470]/5 text-[#35483a] border-[#6a8470]/10",
    dark: "bg-[#35483a]",
  },
  dark: {
    label: "暗调电影",
    bg: "bg-[#25221f]",
    panel: "bg-[#312d2a]",
    ink: "text-[#e8e4db]",
    accent: "bg-[#bba585]",
    accentText: "text-[#bba585]",
    border: "border-[#bba585]/20",
    chip: "bg-[#bba585]/10 text-[#e8e4db] border-[#bba585]/20",
    dark: "bg-[#181614]",
  },
  blue: {
    label: "蔚蓝海滨",
    bg: "bg-[#f0f4f8]",
    panel: "bg-white",
    ink: "text-[#334155]",
    accent: "bg-[#3b82f6]",
    accentText: "text-[#3b82f6]",
    border: "border-[#3b82f6]/20",
    chip: "bg-[#3b82f6]/5 text-[#334155] border-[#3b82f6]/10",
    dark: "bg-[#1e293b]",
  },
  purple: {
    label: "梦幻紫夜",
    bg: "bg-[#f5f3f7]",
    panel: "bg-white",
    ink: "text-[#4a3a55]",
    accent: "bg-[#8b5cf6]",
    accentText: "text-[#8b5cf6]",
    border: "border-[#8b5cf6]/20",
    chip: "bg-[#8b5cf6]/5 text-[#4a3a55] border-[#8b5cf6]/10",
    dark: "bg-[#2e1f3d]",
  },
  neutral: {
    label: "极简性冷淡",
    bg: "bg-[#fafafa]",
    panel: "bg-white",
    ink: "text-[#171717]",
    accent: "bg-[#404040]",
    accentText: "text-[#404040]",
    border: "border-[#404040]/20",
    chip: "bg-[#404040]/5 text-[#171717] border-[#404040]/10",
    dark: "bg-[#0a0a0a]",
  },
  rose: {
    label: "粉霜浅夏",
    bg: "bg-[#fcf5f7]",
    panel: "bg-white",
    ink: "text-[#5a3845]",
    accent: "bg-[#e11d48]",
    accentText: "text-[#e11d48]",
    border: "border-[#e11d48]/20",
    chip: "bg-[#e11d48]/5 text-[#5a3845] border-[#e11d48]/10",
    dark: "bg-[#3f212e]",
  },
};

const layoutOptions = [
  { value: "compareHero", label: "大幅左右对比" },
  { value: "compareCards", label: "多组卡片对比" },
  { value: "comparePoster", label: "海报式重点成图" },
  { value: "compareGrid", label: "四图并排网格" },
  { value: "highResZoom", label: "高清局部放大" },
];

const caseCategoryMap: Record<string, string> = {
  tone: "localEdit",
  pose: "portrait",
  angles: "generation",
  blend: "commercial",
  inpainting: "localEdit",
  "portrait-retouch": "portrait",
  "headshot-id-photo": "portrait",
  "expression-detail": "portrait",
  "old-photo-restore": "repair",
  "upscale-enhance": "repair",
  "outpaint-reframe": "generation",
};

const categoryOptions = [
  { id: "all", label: "全部", description: "所有案例" },
  { id: "portrait", label: "人像处理", description: "姿势、头像、精修和细节" },
  { id: "repair", label: "修复增强", description: "老照片与画质增强" },
  { id: "commercial", label: "商业商品", description: "溶图、海报和电商表达" },
  { id: "generation", label: "构图生成", description: "多角度、扩图和尺寸适配" },
  { id: "localEdit", label: "局部编辑", description: "调色、重绘和局部替换" },
];

const progressFilterOptions = [
  { id: "all", label: "全部状态" },
  { id: "complete", label: "已完成" },
  { id: "todo", label: "待补图" },
];

const categoryIconMap: Record<string, any> = {
  all: Images,
  portrait: Camera,
  repair: Sparkles,
  commercial: Gift,
  generation: PanelTop,
  localEdit: SlidersHorizontal,
};

const defaultSiteConfig = {
  topBadge: "批量处理案例展示页模板",
  heroTitle: "AI 批量图片处理\n前后对比案例馆",
  heroDesc:
    "集中展示原图到 AI 成图的真实变化，适合调色调光、风格转换、主题写真、电商图片优化等批量处理结果。",
  allTabLabel: "全部案例",
  processSteps: ["上传原图", "选择风格", "AI 批量处理", "生成成图"],
  tipText: "每组案例保持一张原图和一张成图，让用户快速看到处理前后的差异。",
  footerText: "BEFORE · AFTER · AI IMAGE CASES",
};

function normalizeSiteConfig(config: any) {
  return {
    ...defaultSiteConfig,
    ...(config || {}),
    processSteps:
      Array.isArray(config?.processSteps) && config.processSteps.length > 0
        ? config.processSteps
        : defaultSiteConfig.processSteps,
  };
}

async function uploadImageFile(file: File): Promise<any> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = () => {
      const localUrl = String(reader.result);
      const image = new Image();
      image.onload = async () => {
        const width = image.naturalWidth || image.width;
        const height = image.naturalHeight || image.height;
        try {
          const response = await fetch("/api/upload-base64", {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({ fileBase64: localUrl, fileName: file.name })
          });
          const text = await response.text();
          if (text.includes("Cookie check") && text.includes("authFlowTestCookie")) {
            console.error("Upload intercepted by cookie check; reloading page.");
            window.location.reload();
            return;
          }
          if (!response.ok) {
            console.error("Upload failed with status:", response.status, text);
            resolve({
              url: localUrl,
              width,
              height,
              aspectRatio: `${width} / ${height}`,
              aspectLabel: getAspectLabel(width, height),
            });
            return;
          }
          let data;
          try {
            data = JSON.parse(text);
          } catch (e) {
            console.error("Failed to parse response:", text);
            resolve({
              url: localUrl,
              width,
              height,
              aspectRatio: `${width} / ${height}`,
              aspectLabel: getAspectLabel(width, height),
            });
            return;
          }
          const finalUrl = data.url || localUrl;
          resolve({
            url: finalUrl,
            width,
            height,
            aspectRatio: `${width} / ${height}`,
            aspectLabel: getAspectLabel(width, height),
          });
        } catch (err) {
          console.error("Upload failed", err);
          resolve({ url: localUrl, width, height, aspectRatio: `${width} / ${height}`, aspectLabel: getAspectLabel(width, height) });
        }
      };
      image.onerror = () => resolve({ url: localUrl, width: 0, height: 0, aspectRatio: undefined, aspectLabel: undefined });
      image.src = localUrl;
    };
    reader.readAsDataURL(file);
  });
}

function getAspectLabel(width: number, height: number): string {
  if (!width || !height) return "自动比例";
  const ratio = width / height;
  const presets = [
    { label: "16:9", value: 16 / 9 },
    { label: "9:16", value: 9 / 16 },
    { label: "4:3", value: 4 / 3 },
    { label: "3:4", value: 3 / 4 },
    { label: "1:1", value: 1 },
    { label: "4:5", value: 4 / 5 },
    { label: "5:4", value: 5 / 4 },
    { label: "3:2", value: 3 / 2 },
    { label: "2:3", value: 2 / 3 },
  ];
  const match = presets.find((item) => Math.abs(item.value - ratio) < 0.04);
  return match ? match.label : `${width}:${height}`;
}

function getImagePairs(images: any[]) {
  const pairs = [];
  for (let index = 0; index < images.length; index += 2) {
    pairs.push({ before: images[index], after: images[index + 1], beforeIndex: index, afterIndex: index + 1 });
  }
  return pairs;
}

function hasImageUrl(image: any) {
  return Boolean(image?.url);
}

function getUploadProgress(images: any[] = []) {
  const total = images.length;
  const uploaded = images.filter(hasImageUrl).length;
  return {
    total,
    uploaded,
    percent: total ? Math.round((uploaded / total) * 100) : 0,
  };
}

function getCompletePairCount(images: any[] = []) {
  return getImagePairs(images).filter((pair) => hasImageUrl(pair.before) && hasImageUrl(pair.after)).length;
}

function getCaseCover(block: any) {
  const pairs = getImagePairs(block?.images || []);
  const completePair = pairs.find((pair) => hasImageUrl(pair.after) || hasImageUrl(pair.before));
  return completePair?.after?.url || completePair?.before?.url || "";
}

function isCaseComplete(block: any) {
  const progress = getUploadProgress(block?.images || []);
  return progress.total > 0 && progress.uploaded === progress.total;
}

function getMissingSlotCount(block: any) {
  return (block?.images || []).filter((image: any) => !hasImageUrl(image)).length;
}

function getCaseCategoryId(block: any) {
  if (caseCategoryMap[block?.id]) return caseCategoryMap[block.id];
  const text = `${block?.navLabel || ""} ${block?.title || ""} ${block?.desc || ""}`;
  if (/人像|姿势|头像|表情|精修/.test(text)) return "portrait";
  if (/修复|高清|放大|画质|老照片/.test(text)) return "repair";
  if (/商品|电商|溶图|海报|商业/.test(text)) return "commercial";
  if (/扩图|构图|多角度|多机位|尺寸/.test(text)) return "generation";
  return "localEdit";
}

function getImageRole(label = "") {
  if (/after|result|成图|结果|优化|修复|高清|上色|封面|海报|Banner/i.test(label)) return "成图位";
  if (/before|original|原图|原始|生活照|旧照|低清/i.test(label)) return "原图位";
  return "素材位";
}

function Field({ label, value, onChange, placeholder, multiline = false }: any) {
  return (
    <label className="block space-y-1.5">
      <span className="block text-[10px] font-sans uppercase font-bold opacity-50">{label}</span>
      {multiline ? (
        <textarea
          value={value}
          placeholder={placeholder}
          onChange={(event) => onChange(event.target.value)}
          className="min-h-[84px] w-full bg-white border border-[#8c7851]/20 rounded-md p-2 text-xs focus:ring-1 focus:ring-[#8c7851] outline-none transition"
        />
      ) : (
        <input
          value={value}
          placeholder={placeholder}
          onChange={(event) => onChange(event.target.value)}
          className="w-full bg-white border border-[#8c7851]/20 rounded-md p-2 text-xs focus:ring-1 focus:ring-[#8c7851] outline-none transition"
        />
      )}
    </label>
  );
}

function BeforeAfterSlider({ before, after, aspectRatio, theme }: any) {
  const [position, setPosition] = useState(52);
  const [isSliding, setIsSliding] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const beforeLabel = before?.label || "原图";
  const afterLabel = after?.label || "AI成图";

  useEffect(() => {
    setHasError(false);
    setIsReady(false);
    if (!before?.url || !after?.url) return;

    let isActive = true;
    function loadImage(src: string) {
      return new Promise<void>((resolve, reject) => {
        const image = new Image();
        const timeout = window.setTimeout(() => reject(new Error("Image load timeout")), 8000);
        image.onload = () => {
          window.clearTimeout(timeout);
          image.naturalWidth > 0 ? resolve() : reject(new Error("Image has no dimensions"));
        };
        image.onerror = () => {
          window.clearTimeout(timeout);
          reject(new Error("Image failed to load"));
        };
        image.src = src;
      });
    }

    Promise.all([loadImage(before.url), loadImage(after.url)])
      .then(() => {
        if (isActive) setIsReady(true);
      })
      .catch(() => {
        if (isActive) setHasError(true);
      });

    return () => {
      isActive = false;
    };
  }, [before?.url, after?.url]);

  function updatePosition(event: React.PointerEvent<HTMLDivElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    const next = ((event.clientX - rect.left) / rect.width) * 100;
    setPosition(Math.max(8, Math.min(92, Math.round(next))));
  }

  if (!before?.url || !after?.url) return null;

  if (hasError) {
    return (
      <div
        className="flex min-h-[260px] w-full flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-[#8c7851]/30 bg-[#8c7851]/5 p-8 text-center font-sans text-[#8c7851]"
        style={aspectRatio ? { aspectRatio } : undefined}
      >
        <ImageOff className="h-8 w-8" />
        <div className="text-[11px] font-bold uppercase tracking-widest">图片文件缺失</div>
        <p className="max-w-sm text-xs leading-6 text-[#4a3f35]/55">当前图位保存了路径，但文件无法加载。进入编辑模式重新上传即可恢复滑块预览。</p>
      </div>
    );
  }

  if (!isReady) {
    return (
      <div
        className="flex min-h-[260px] w-full flex-col items-center justify-center gap-3 rounded-lg border border-[#8c7851]/15 bg-[#181715] p-8 text-center font-sans text-white"
        style={aspectRatio ? { aspectRatio } : undefined}
      >
        <motion.div
          animate={{ scale: [1, 1.08, 1], opacity: [0.7, 1, 0.7] }}
          transition={{ duration: 1.3, repeat: Infinity, ease: "easeInOut" }}
          className={`h-3 w-3 rounded-full ${theme.accent}`}
        />
        <div className="text-[11px] font-bold uppercase tracking-widest text-white/80">正在加载对比图</div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.985 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.45 }}
      className="group relative min-h-[260px] touch-none overflow-hidden rounded-lg border border-black/10 bg-[#11100f] shadow-2xl shadow-black/10"
      style={aspectRatio ? { aspectRatio } : undefined}
      onPointerDown={(event) => {
        setIsSliding(true);
        event.currentTarget.setPointerCapture(event.pointerId);
        updatePosition(event);
      }}
      onPointerMove={(event) => {
        if (isSliding) updatePosition(event);
      }}
      onPointerUp={() => setIsSliding(false)}
      onPointerCancel={() => setIsSliding(false)}
    >
      <img
        src={before.url}
        alt={beforeLabel}
        draggable={false}
        loading="lazy"
        decoding="async"
        onError={() => setHasError(true)}
        className="absolute inset-0 h-full w-full select-none object-cover"
      />
      <div className="absolute inset-0 overflow-hidden" style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}>
        <img
          src={after.url}
          alt={afterLabel}
          draggable={false}
          loading="lazy"
          decoding="async"
          onError={() => setHasError(true)}
          className="h-full w-full select-none object-cover"
        />
      </div>

      <div className="absolute inset-x-0 top-0 flex items-center justify-between p-4 font-sans">
        <span className="rounded-full border border-white/20 bg-black/45 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-white backdrop-blur">
          BEFORE · {beforeLabel}
        </span>
        <span className={`rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-white ${theme.dark}`}>
          AFTER · {afterLabel}
        </span>
      </div>

      <div className="absolute inset-y-0 z-20 w-px bg-white shadow-[0_0_0_1px_rgba(0,0,0,0.2)]" style={{ left: `${position}%` }}>
        <motion.div
          animate={{ x: isSliding ? -18 : [-18, -14, -18] }}
          transition={{ duration: 1.8, repeat: isSliding ? 0 : Infinity, ease: "easeInOut" }}
          className={`absolute top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/50 ${theme.accent} text-white shadow-xl shadow-black/30`}
        >
          <GripVertical className="h-5 w-5" />
        </motion.div>
      </div>

      <input
        aria-label="调整前后对比滑块"
        type="range"
        min="8"
        max="92"
        value={position}
        onChange={(event) => setPosition(Number(event.target.value))}
        className="absolute bottom-5 left-6 right-6 z-30 h-1 cursor-ew-resize accent-[#d0b783] opacity-0 transition group-hover:opacity-100"
      />

      <div className="pointer-events-none absolute bottom-4 left-4 rounded-full border border-white/15 bg-black/45 px-3 py-1 font-sans text-[10px] font-bold uppercase tracking-widest text-white/80 backdrop-blur">
        拖动查看前后变化
      </div>
    </motion.div>
  );
}

function UploadTile({ item, onUpload, onRemove, onPreview, className = "", labelTone = "dark", frameAspectRatio, imageFit = "cover", isEditMode = true }: any) {
  const inputRef = useRef<HTMLInputElement>(null);
  const dragCounter = useRef(0);
  const hoverTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [imageFailed, setImageFailed] = useState(false);
  const tileLabel = item?.label || "图片";
  const aspectRatio = frameAspectRatio || item?.aspectRatio || undefined;
  const aspectLabel = item?.aspectLabel || "自动适配";
  const imageRole = getImageRole(tileLabel);

  useEffect(() => {
    setImageFailed(false);
  }, [item?.url]);

  async function handleFile(file?: File) {
    if (!file || !isEditMode) return;
    if (!file.type.startsWith("image/") && !file.name.match(/\.(jpg|jpeg|png|gif|webp|bmp|heic|svg)$/i)) return;
    setIsUploading(true);
    try {
      const imageData = await uploadImageFile(file);
      onUpload(imageData);
    } finally {
      setIsUploading(false);
    }
  }

  function handleMouseEnter() {
    hoverTimeoutRef.current = setTimeout(() => {
      setShowPreview(true);
    }, 500);
  }

  function handleMouseLeave() {
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    setShowPreview(false);
  }

  function handleDragEnter(event: React.DragEvent) {
    if (!isEditMode) return;
    event.preventDefault();
    event.stopPropagation();
    dragCounter.current += 1;
    if (dragCounter.current === 1) {
      setIsDragging(true);
    }
  }

  function handleDragOver(event: React.DragEvent) {
    if (!isEditMode) return;
    event.preventDefault();
    event.stopPropagation();
    event.dataTransfer.dropEffect = "copy";
  }

  function handleDragLeave(event: React.DragEvent) {
    if (!isEditMode) return;
    event.preventDefault();
    event.stopPropagation();
    dragCounter.current -= 1;
    if (dragCounter.current === 0) {
      setIsDragging(false);
    }
  }

  async function handleDrop(event: React.DragEvent) {
    if (!isEditMode) return;
    event.preventDefault();
    event.stopPropagation();
    dragCounter.current = 0;
    setIsDragging(false);
    
    // Attempt to handle both file drop and image URL drop
    const file = event.dataTransfer.files?.[0];
    if (file) {
      handleFile(file);
    }
  }

  return (
    <div
      className={`group relative overflow-hidden rounded-md border bg-[#8c7851]/5 transition-all outline-none ${
        isDragging ? "scale-[1.01] border-[#8c7851] ring-1 ring-[#8c7851]" : "border-[#8c7851]/20 hover:border-[#8c7851]/40"
      } ${className}`}
      style={aspectRatio ? { aspectRatio } : undefined}
      onDragEnter={handleDragEnter}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {item?.url && !imageFailed ? (
        <img
          src={item.url}
          alt={tileLabel}
          draggable={false}
          loading="lazy"
          decoding="async"
          onError={() => setImageFailed(true)}
          onClick={() => onPreview?.()}
          className={`h-full min-h-[220px] w-full bg-[#1f1b18]/5 transition-transform duration-700 group-hover:scale-[1.025] ${onPreview ? "cursor-zoom-in" : ""} ${imageFit === "contain" ? "object-contain" : "object-cover"}`}
        />
      ) : (
        <button
          type="button"
          disabled={!isEditMode}
          onClick={() => isEditMode && inputRef.current?.click()}
          className={`relative flex h-full min-h-[220px] w-full flex-col items-center justify-center gap-4 overflow-hidden bg-[linear-gradient(135deg,rgba(140,120,81,0.12),rgba(255,255,255,0.35)),linear-gradient(rgba(140,120,81,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(140,120,81,0.08)_1px,transparent_1px)] bg-[length:auto,24px_24px,24px_24px] p-6 text-[#8c7851] transition ${isEditMode ? "cursor-pointer hover:bg-[#8c7851]/10" : "cursor-default"}`}
        >
          <div className="pointer-events-none absolute inset-x-6 top-6 flex items-center justify-between font-sans text-[9px] font-bold uppercase tracking-widest text-[#8c7851]/55">
            <span>{imageRole}</span>
            <span>{aspectLabel}</span>
          </div>
          <motion.div
            whileHover={isEditMode ? { y: -2, scale: 1.03 } : undefined}
            className="flex h-16 w-16 items-center justify-center rounded-full border border-[#8c7851]/25 bg-white/70 shadow-sm backdrop-blur"
          >
            {imageFailed ? <ImageOff className="h-7 w-7" /> : <ImageIcon className="h-7 w-7" />}
          </motion.div>
          <div className="text-center font-sans">
            <div className="text-[11px] font-bold uppercase tracking-widest">
              {imageFailed ? "图片文件缺失" : isUploading ? "Uploading..." : isEditMode ? "点击或拖拽上传" : "待上传素材"}
            </div>
            <div className="mt-2 max-w-[220px] text-xs leading-5 text-[#4a3f35]/55">
              {imageFailed ? "当前路径无法读取，请重新上传这一张图片。" : isEditMode ? `建议上传 ${tileLabel}，系统会记录原始比例。` : "进入编辑模式后可补齐这张案例图片。"}
            </div>
          </div>
          <div className="pointer-events-none absolute inset-x-6 bottom-6 border-t border-dashed border-[#8c7851]/20 pt-3 font-sans text-[9px] font-bold uppercase tracking-widest text-[#8c7851]/45">
            {isEditMode ? "Drop image here" : "Empty slot"}
          </div>
        </button>
      )}

      {isUploading && (
        <div className="pointer-events-none absolute inset-0 z-30 flex items-center justify-center bg-white/70 text-xs font-bold uppercase tracking-widest text-[#8c7851] backdrop-blur-sm">
          Uploading
        </div>
      )}

      {isDragging && isEditMode && (
        <div className="pointer-events-none absolute inset-0 z-30 flex flex-col items-center justify-center gap-3 bg-[#3b281b]/70 text-white backdrop-blur-sm">
          <Upload className="h-10 w-10" />
          <div className="text-base font-bold">松开鼠标导入图片</div>
          <div className="text-xs opacity-80">会自动适配图片原始比例</div>
        </div>
      )}

      <div
        className={`absolute left-4 top-4 z-20 rounded-full px-4 py-1.5 text-[10px] font-sans font-bold uppercase tracking-widest backdrop-blur-md border ${
          labelTone === "light" ? "bg-white/80 text-[#4a3f35] border-black/10" : "bg-black/60 text-white border-white/20"
        }`}
      >
        {tileLabel}
      </div>

      <div className="absolute right-4 top-4 z-20 rounded-full bg-white/80 px-4 py-1.5 text-[10px] font-sans font-bold uppercase tracking-widest text-[#4a3f35] border border-black/10 backdrop-blur-md">
        <span className="inline-flex items-center gap-1">
          {aspectLabel}
        </span>
      </div>

      {isEditMode && (
        <div className="absolute bottom-4 right-4 z-20 flex gap-2 opacity-0 transition group-hover:opacity-100">
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="rounded-full bg-white/90 p-2 text-[#6d5234] shadow hover:bg-white"
            title="替换"
          >
            <Upload className="h-4 w-4" />
          </button>
          {item?.url && (
            <button
              type="button"
              onClick={onRemove}
              className="rounded-full bg-white/90 p-2 text-[#9d2b2f] shadow hover:bg-white"
              title="删除图片"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          )}
        </div>
      )}

      {item?.url && !imageFailed && onPreview && (
        <button
          type="button"
          onClick={onPreview}
          className="absolute bottom-4 left-4 z-20 inline-flex items-center gap-2 rounded-full border border-white/20 bg-black/55 px-3 py-2 font-sans text-[10px] font-bold uppercase tracking-widest text-white opacity-0 shadow-lg backdrop-blur transition group-hover:opacity-100"
          title="打开大图预览"
        >
          <Maximize2 className="h-3.5 w-3.5" />
          预览
        </button>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        hidden
        onChange={async (event) => {
          const file = event.target.files?.[0];
          await handleFile(file);
          event.target.value = "";
        }}
      />
      {showPreview && item?.url && !imageFailed && !isDragging && document.body && createPortal(
        <div className="fixed inset-0 z-[100] pointer-events-none flex flex-col items-center justify-center bg-black/70 backdrop-blur-md p-8 transition-opacity duration-300">
          <img src={item.url} alt={`${tileLabel} 高清预览`} className="max-h-full max-w-full object-contain drop-shadow-2xl rounded-lg border border-white/10" />
          <div className="mt-6 rounded-full bg-black/60 px-6 py-2 text-sm text-white backdrop-blur-md font-sans">
            {tileLabel} 高清预览
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}

function ImageLightbox({ preview, onClose, onShift }: any) {
  const images = preview?.images || [];
  const current = images[preview?.index || 0];

  useEffect(() => {
    if (!preview) return;
    function handleKey(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
      if (event.key === "ArrowLeft") onShift(-1);
      if (event.key === "ArrowRight") onShift(1);
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose, onShift, preview]);

  if (!preview || !current?.url || !document.body) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[120] flex items-center justify-center bg-[#12100e]/92 p-4 text-white backdrop-blur-md md:p-8"
      onClick={onClose}
    >
      <button
        type="button"
        onClick={onClose}
        className="absolute right-4 top-4 z-20 rounded-full border border-white/15 bg-white/10 p-3 text-white transition hover:bg-white/20"
        aria-label="关闭预览"
      >
        <X className="h-5 w-5" />
      </button>

      {images.length > 1 && (
        <>
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              onShift(-1);
            }}
            className="absolute left-4 top-1/2 z-20 -translate-y-1/2 rounded-full border border-white/15 bg-white/10 p-3 text-white transition hover:bg-white/20"
            aria-label="上一张"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              onShift(1);
            }}
            className="absolute right-4 top-1/2 z-20 -translate-y-1/2 rounded-full border border-white/15 bg-white/10 p-3 text-white transition hover:bg-white/20"
            aria-label="下一张"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        </>
      )}

      <div className="flex max-h-full max-w-6xl flex-col items-center gap-5" onClick={(event) => event.stopPropagation()}>
        <div className="flex w-full flex-wrap items-center justify-between gap-3 font-sans">
          <div>
            <div className="text-[11px] font-bold uppercase tracking-[0.35em] text-[#d0b783]">
              {preview.title || "图片预览"}
            </div>
            <div className="mt-1 text-sm text-white/70">
              {current.label || "案例图片"} · {preview.index + 1}/{images.length}
            </div>
          </div>
          <a
            href={current.url}
            download
            className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-bold text-white transition hover:bg-white/20"
          >
            <Download className="h-3.5 w-3.5" />
            下载原图
          </a>
        </div>
        <img
          src={current.url}
          alt={current.label || "案例图片"}
          className="max-h-[78vh] max-w-full rounded-lg border border-white/10 object-contain shadow-2xl shadow-black/50"
        />
      </div>
    </div>,
    document.body
  );
}

function CompareBridge({ theme, index }: any) {
  return (
    <div className="pointer-events-none absolute left-1/2 top-1/2 z-20 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-2">
      <motion.div
        animate={{ x: [0, 4, 0] }}
        transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
        className={`flex h-12 w-12 items-center justify-center rounded-full bg-white border border-black/10 text-black shadow-lg`}
      >
        <ArrowRight className="h-5 w-5 text-[#8c7851]" />
      </motion.div>
    </div>
  );
}

function PairStatus({ before, after, theme }: any) {
  const beforeReady = hasImageUrl(before);
  const afterReady = hasImageUrl(after);
  const label = beforeReady && afterReady ? "可展示对比" : beforeReady ? "还缺成图" : afterReady ? "还缺原图" : "等待上传原图和成图";

  return (
    <div className="mb-3 flex items-center justify-between gap-3 rounded-full border border-black/5 bg-white/65 px-4 py-2 font-sans text-[10px] font-bold uppercase tracking-widest text-[#4a3f35]/55 backdrop-blur">
      <span className="inline-flex items-center gap-2">
        <span className={`h-2 w-2 rounded-full ${beforeReady && afterReady ? theme.accent : "bg-[#8c7851]/30"}`} />
        {label}
      </span>
      <span className="text-[#4a3f35]/40">
        {beforeReady ? "原图 OK" : "缺原图"} / {afterReady ? "成图 OK" : "缺成图"}
      </span>
    </div>
  );
}

const posterFeatureIcons = [Camera, Sparkles, Heart, Images, SlidersHorizontal, CheckCircle2];

function getPosterLetter(index: number) {
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  return letters[index % letters.length] || String(index + 1);
}

function PosterFeatureStrip({ chips = [], theme }: any) {
  const items = chips.length ? chips : ["画面更完整", "风格更统一", "出片更高效"];

  return (
    <div className={`mt-8 border-t ${theme.border} pt-6 font-sans`}>
      <div className="grid gap-4 md:grid-cols-3">
        {items.slice(0, 3).map((chip: string, index: number) => {
          const Icon = posterFeatureIcons[index % posterFeatureIcons.length];
          return (
            <div key={`${chip}-${index}`} className="flex items-center justify-center gap-3 border-[#8c7851]/14 md:border-r last:border-r-0">
              <div className={`flex h-10 w-10 flex-none items-center justify-center rounded-full ${theme.accent} text-white shadow-sm`}>
                <Icon className="h-4 w-4" />
              </div>
              <div className="min-w-0">
                <div className="text-sm font-semibold text-[#4a3f35]">{chip}</div>
                <div className="mt-0.5 text-[10px] text-[#4a3f35]/45">AI IMAGE CASE</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ComparisonPair({ pair, index, layout, theme, onUpdateImage, onRemoveImage, onOpenLightbox, blockId, isEditMode, shareMode = false, comparisonMode = "slider" }: any) {
  const before = pair.before || { id: `before-${index}`, label: "原图", url: "", aspectRatio: "", aspectLabel: "" };
  const after = pair.after || { id: `after-${index}`, label: "AI成图", url: "", aspectRatio: "", aspectLabel: "" };
  const pairAspect = after.url ? after.aspectRatio : before.url ? before.aspectRatio : after.aspectRatio || before.aspectRatio || undefined;
  const pairAspectLabel = after.url ? after.aspectLabel : before.url ? before.aspectLabel : after.aspectLabel || before.aspectLabel || "自动比例";
  const effectiveLayout = comparisonMode === "cards" ? "compareCards" : layout;
  const posterLetter = getPosterLetter(index);
  const previewImages = [before, after].filter(hasImageUrl);
  const openPreview = (image: any) => {
    if (!image?.url || !onOpenLightbox) return;
    const previewIndex = Math.max(0, previewImages.findIndex((item: any) => item.id === image.id));
    onOpenLightbox({
      images: previewImages,
      index: previewIndex,
      title: `${before.label || "Before"} / ${after.label || "After"}`,
    });
  };

  const canUseSlider = comparisonMode === "slider" && !isEditMode && hasImageUrl(before) && hasImageUrl(after) && layout !== "highResZoom";

  if (canUseSlider) {
    return (
      <motion.article
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.45, delay: index * 0.04, ease: "easeOut" }}
        className={`relative overflow-hidden rounded-md border ${theme.border} bg-white/72 p-3 shadow-[0_18px_45px_rgba(52,47,42,0.08)]`}
      >
        <div className="mb-3 flex items-center justify-between gap-3 px-1 font-sans">
          <div className="flex items-center gap-3">
            <span className={`flex h-9 w-9 items-center justify-center rounded-full ${theme.dark} font-serif text-lg text-white shadow-sm`}>
              {posterLetter}
            </span>
            <div className="flex items-center gap-2 text-[11px] font-semibold text-[#4a3f35]/65">
              <span>原始图片</span>
              <ArrowRight className={`h-3.5 w-3.5 ${theme.accentText}`} />
              <span>效果展示</span>
            </div>
          </div>
          <span className="text-[10px] font-semibold text-[#4a3f35]/35">{pairAspectLabel}</span>
        </div>
        <div className={`overflow-hidden rounded-sm border ${theme.border} bg-[#fdfaf6] p-2`}>
          <BeforeAfterSlider before={before} after={after} aspectRatio={pairAspect} theme={theme} />
        </div>
        <button
          type="button"
          onClick={() => openPreview(after)}
          className="absolute right-6 top-16 z-30 inline-flex items-center gap-2 rounded-full border border-white/20 bg-black/55 px-3 py-2 font-sans text-[10px] font-bold text-white shadow-lg backdrop-blur transition hover:bg-black/70"
        >
          <Maximize2 className="h-3.5 w-3.5" />
          大图
        </button>
      </motion.article>
    );
  }

  if (effectiveLayout === "comparePoster") {
    return (
      <motion.article
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.45, delay: index * 0.04, ease: "easeOut" }}
        className={`relative overflow-hidden rounded-md border ${theme.border} bg-[#fdfaf6] p-4 shadow-[0_18px_45px_rgba(52,47,42,0.08)] md:p-6`}
      >
        <div className="mb-4 flex items-center justify-between gap-3 font-sans">
          <div className="flex items-center gap-3">
            <span className={`flex h-9 w-9 items-center justify-center rounded-full ${theme.dark} font-serif text-lg text-white shadow-sm`}>
              {posterLetter}
            </span>
            <span className="text-[11px] font-semibold text-[#4a3f35]/60">原始图片 → 效果展示</span>
          </div>
          <span className="text-[10px] font-semibold text-[#4a3f35]/35">{pairAspectLabel}</span>
        </div>
        {!shareMode && <PairStatus before={before} after={after} theme={theme} />}
        <div className="grid gap-4 md:grid-cols-[0.7fr_1.3fr] md:items-end">
          <div className="relative z-10 md:pb-8">
            <div className="mb-3 text-[10px] font-sans font-bold uppercase tracking-widest text-[#8c7851]">ORIGINAL</div>
            <UploadTile
              item={before}
              className="rotate-[-2deg]"
              labelTone="light"
              frameAspectRatio={pairAspect}
              imageFit="contain"
              isEditMode={isEditMode}
              onPreview={() => openPreview(before)}
              onUpload={(url: any) => onUpdateImage(blockId, pair.beforeIndex, url)}
              onRemove={() => onRemoveImage(blockId, pair.beforeIndex)}
            />
          </div>
          <div className="relative z-10">
            <div className={`mb-3 inline-flex items-center gap-2 rounded-full ${theme.dark} px-4 py-1.5 text-[10px] font-sans font-bold uppercase tracking-widest text-white`}>
              <Sparkles className="h-3 w-3" /> AI RESULT
            </div>
            <UploadTile
              item={after}
              className="shadow-2xl shadow-black/20"
              frameAspectRatio={pairAspect}
              imageFit="contain"
              isEditMode={isEditMode}
              onPreview={() => openPreview(after)}
              onUpload={(url: any) => onUpdateImage(blockId, pair.afterIndex, url)}
              onRemove={() => onRemoveImage(blockId, pair.afterIndex)}
            />
          </div>
        </div>
        <div className="mt-5 flex items-center justify-center gap-3 text-xs font-sans uppercase tracking-[0.2em] text-[#8c7851]">
          <span>ORIGINAL</span>
          <ArrowRight className="h-4 w-4" />
          <span>AI RESULT</span>
        </div>
      </motion.article>
    );
  }

  if (effectiveLayout === "highResZoom") {
    return (
      <div className={`relative overflow-hidden rounded-lg border border-black/5 bg-gradient-to-br from-white to-black/5 p-6 md:p-10 shadow-inner group transition-all duration-300 hover:shadow-lg`}>
        <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white opacity-20 blur-3xl pointer-events-none"></div>
        {!shareMode && <PairStatus before={before} after={after} theme={theme} />}
        <div className="grid gap-10 lg:grid-cols-[1fr_1.5fr] items-center relative z-10">
          <div className="relative flex flex-col items-center">
            <div className="mb-4 inline-flex items-center self-start gap-2 rounded-full border border-black/5 bg-black/5 px-4 py-1.5 font-sans text-xs font-bold uppercase tracking-widest text-black/50 backdrop-blur-md">
              <span className="w-1.5 h-1.5 rounded-full bg-black/30" /> ORIGINAL 1X
            </div>
            <div className="w-full relative">
              <div className="absolute inset-0 scale-[0.9] opacity-0 group-hover:scale-[1] group-hover:opacity-100 transition-all duration-700 bg-white shadow-2xl rounded-lg" />
              <div className="relative z-10 rounded-lg overflow-hidden border border-black/10">
                <UploadTile
                  item={before}
                  labelTone="dark"
                  frameAspectRatio={pairAspect}
                  imageFit="contain"
                  isEditMode={isEditMode}
                  onPreview={() => openPreview(before)}
                  onUpload={(url: any) => onUpdateImage(blockId, pair.beforeIndex, url)}
                  onRemove={() => onRemoveImage(blockId, pair.beforeIndex)}
                />
              </div>
            </div>
          </div>
          <div className="relative">
            <div className={`mb-4 inline-flex self-start items-center gap-2 rounded-full ${theme.accent} px-4 py-1.5 font-sans text-xs font-bold uppercase tracking-widest text-white shadow-lg shadow-black/10`}>
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" /> AI ZOOM 4X
            </div>
            <div className="relative">
              {/* Magnifier styling around the after image */}
              <div className="absolute -inset-2 rounded-lg border-2 border-white/50 bg-white/20 backdrop-blur-sm pointer-events-none z-20 group-hover:border-white transition-all duration-500 shadow-[inset_0_0_20px_rgba(255,255,255,0.5)]"></div>
              
              <div className="relative z-10 overflow-hidden rounded-lg bg-white shadow-2xl shadow-black/20 ring-1 ring-black/5 transition-transform duration-500 group-hover:scale-[1.02]">
                <UploadTile
                  item={after}
                  frameAspectRatio={pairAspect}
                  imageFit="cover" /* The zoom should fill it nicely to look like a cropped detail */
                  isEditMode={isEditMode}
                  onPreview={() => openPreview(after)}
                  onUpload={(url: any) => onUpdateImage(blockId, pair.afterIndex, url)}
                  onRemove={() => onRemoveImage(blockId, pair.afterIndex)}
                  className="scale-105" /* Slight scale to emphasize zoom */
                />
                
                {/* Crosshairs overlay to make it look technical / magnifying */}
                <div className="absolute inset-0 pointer-events-none opacity-30 mix-blend-overlay flex items-center justify-center">
                  <div className="w-full h-[1px] bg-white absolute top-1/2 left-0 -translate-y-1/2"></div>
                  <div className="h-full w-[1px] bg-white absolute left-1/2 top-0 -translate-x-1/2"></div>
                  <div className="w-16 h-16 border border-white rounded-full"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (effectiveLayout === "compareCards") {
    return (
      <motion.article
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.45, delay: index * 0.04, ease: "easeOut" }}
        className={`relative overflow-hidden rounded-md border ${theme.border} bg-white/70 p-4 shadow-[0_18px_45px_rgba(52,47,42,0.08)]`}
      >
        {!shareMode && <PairStatus before={before} after={after} theme={theme} />}
        <div className="mb-4 flex items-center justify-between gap-3 font-sans">
          <div className="flex items-center gap-3">
            <span className={`flex h-9 w-9 items-center justify-center rounded-full ${theme.dark} font-serif text-lg text-white shadow-sm`}>
              {posterLetter}
            </span>
            <span className="text-[11px] font-semibold text-[#4a3f35]/60">左侧原图 / 右侧效果图</span>
          </div>
          <span className="text-[10px] font-semibold text-[#4a3f35]/35">{pairAspectLabel}</span>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <div className={`relative overflow-hidden rounded-sm border ${theme.border} bg-[#fdfaf6] p-2`}>
            <div className="mb-2 flex items-center justify-between px-1 font-sans text-[10px] font-semibold text-[#4a3f35]/45">
              <span>原始拍摄</span>
              <span>BEFORE</span>
            </div>
            <UploadTile
              item={before}
              className="shadow-sm"
              labelTone="light"
              frameAspectRatio={pairAspect}
              imageFit="contain"
              isEditMode={isEditMode}
              onPreview={() => openPreview(before)}
              onUpload={(url: any) => onUpdateImage(blockId, pair.beforeIndex, url)}
              onRemove={() => onRemoveImage(blockId, pair.beforeIndex)}
            />
          </div>
          <div className={`relative overflow-hidden rounded-sm border ${theme.border} bg-[#fdfaf6] p-2`}>
            <div className={`mb-2 flex items-center justify-between px-1 font-sans text-[10px] font-semibold ${theme.accentText}`}>
              <span>效果展示</span>
              <span>AFTER</span>
            </div>
            <UploadTile
              item={after}
              className="shadow-sm"
              frameAspectRatio={pairAspect}
              imageFit="contain"
              isEditMode={isEditMode}
              onPreview={() => openPreview(after)}
              onUpload={(url: any) => onUpdateImage(blockId, pair.afterIndex, url)}
              onRemove={() => onRemoveImage(blockId, pair.afterIndex)}
            />
          </div>
        </div>
      </motion.article>
    );
  }

  return (
    <motion.article
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.45, delay: index * 0.04, ease: "easeOut" }}
      className={`relative overflow-hidden rounded-md border ${theme.border} bg-white/72 p-4 shadow-[0_18px_45px_rgba(52,47,42,0.08)]`}
    >
      {!shareMode && <PairStatus before={before} after={after} theme={theme} />}
      <div className="mb-4 flex items-center justify-between gap-3 font-sans">
        <div className="flex items-center gap-3">
          <span className={`flex h-9 w-9 items-center justify-center rounded-full ${theme.dark} font-serif text-lg text-white shadow-sm`}>
            {posterLetter}
          </span>
          <div className="flex items-center gap-2 text-[11px] font-semibold text-[#4a3f35]/60">
            <span>原图</span>
            <ArrowRight className={`h-3.5 w-3.5 ${theme.accentText}`} />
            <span>AI成图</span>
          </div>
        </div>
        <span className="text-[10px] font-semibold text-[#4a3f35]/35">{pairAspectLabel}</span>
      </div>
      <div className={`grid gap-px overflow-hidden rounded-sm border ${theme.border} bg-[#d8cdbb] md:grid-cols-2`}>
        <div className="relative bg-[#fdfaf6] p-2">
          <div className="mb-2 flex items-center justify-between px-1 font-sans text-[10px] font-semibold text-[#4a3f35]/45">
            <span>原始拍摄</span>
            <span>BEFORE</span>
          </div>
          <UploadTile
            item={before}
            className=""
            labelTone="light"
            frameAspectRatio={pairAspect}
            imageFit="contain"
            isEditMode={isEditMode}
            onPreview={() => openPreview(before)}
            onUpload={(url: any) => onUpdateImage(blockId, pair.beforeIndex, url)}
            onRemove={() => onRemoveImage(blockId, pair.beforeIndex)}
          />
        </div>
        <div className="relative bg-[#fdfaf6] p-2">
          <div className={`mb-2 flex items-center justify-between px-1 font-sans text-[10px] font-semibold ${theme.accentText}`}>
            <span>效果展示</span>
            <span>AFTER</span>
          </div>
          <UploadTile
            item={after}
            className=""
            frameAspectRatio={pairAspect}
            imageFit="contain"
            isEditMode={isEditMode}
            onPreview={() => openPreview(after)}
            onUpload={(url: any) => onUpdateImage(blockId, pair.afterIndex, url)}
            onRemove={() => onRemoveImage(blockId, pair.afterIndex)}
          />
        </div>
      </div>
    </motion.article>
  );
}

function CaseCard({ block, siteConfig, onUpdateImage, onRemoveImage, onAddPair, onOpenLightbox, isEditMode, shareMode = false, comparisonMode = "slider" }: any) {
  const theme = themeMap[block.theme as keyof typeof themeMap] || themeMap.brown;
  const pairs = getImagePairs(block.images);
  const visiblePairs = shareMode
    ? pairs.filter((pair) => hasImageUrl(pair.before) && hasImageUrl(pair.after))
    : pairs;
  const progress = getUploadProgress(block.images);

  return (
    <motion.section
      id={`case-${block.id}`}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={`relative scroll-mt-24 overflow-hidden rounded-md border ${theme.border} bg-[#fbf7ef] p-5 shadow-[0_22px_70px_rgba(52,47,42,0.10)] md:p-8 lg:p-10`}
    >
      <div aria-hidden="true" className={`pointer-events-none absolute -left-10 -top-10 h-32 w-40 rounded-br-[80px] ${theme.accent} opacity-[0.08]`} />
      <div aria-hidden="true" className={`pointer-events-none absolute -right-12 top-8 h-28 w-28 rounded-full border ${theme.border} opacity-50`} />
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-8 top-5 h-px bg-[#4a3f35]/10" />
      <header className="relative mb-10 text-center font-sans">
        <div className="mb-6 flex items-center justify-center gap-4 text-[#4a3f35]/45">
          <span className="hidden text-[10px] font-semibold sm:inline">CASE STUDY</span>
          <div className={`h-px flex-1 max-w-[96px] ${theme.border}`} />
          <Sparkles className={`h-4 w-4 ${theme.accentText}`} />
          <div className={`h-px flex-1 max-w-[96px] ${theme.border}`} />
          <span className="hidden text-[10px] font-semibold sm:inline">AI IMAGE</span>
        </div>
        <div className="mb-3 flex flex-wrap items-center justify-center gap-3">
          <span className={`rounded-full border px-4 py-1.5 text-[10px] font-bold ${theme.border} ${theme.chip}`}>
            {block.tag}
          </span>
          {isEditMode && block.hidden && (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-red-300 bg-red-50 px-3 py-1 text-[10px] font-bold text-red-500">
              <EyeOff className="h-3 w-3" />
              已隐藏
            </span>
          )}
          {!shareMode && (
            <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[10px] font-bold ${theme.border} ${theme.accentText}`}>
              <CheckCircle2 className="h-3 w-3" />
              {progress.uploaded}/{progress.total}
            </span>
          )}
        </div>
        <h2 className={`mx-auto max-w-5xl font-serif text-[40px] font-light leading-tight md:text-5xl lg:text-6xl ${theme.ink}`}>
          {block.title}
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-[#4a3f35]/65">{block.subtitle}</p>
        <p className="mx-auto mt-2 max-w-xl text-sm text-[#4a3f35]/45">{block.desc}</p>
        <div className="mx-auto mt-7 flex max-w-lg flex-wrap items-center justify-center gap-3">
          {block.chips.map((chip: string, index: number) => (
            <span
              key={chip + "-" + index}
              className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-[11px] font-medium tracking-wide transition-colors hover:bg-black/[0.03] ${theme.border} ${theme.accentText}`}
            >
              <span className={`h-1.5 w-1.5 rounded-full ${theme.accent}`} />
              {chip}
            </span>
          ))}
        </div>
        {!shareMode && (
          <div className="mx-auto mt-6 h-1 max-w-[200px] overflow-hidden rounded-full bg-black/5">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress.percent}%` }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              className={`h-full ${theme.accent}`} />
          </div>
        )}
        <div className="mt-8 flex items-center justify-center gap-3">
          <div className={`h-px flex-1 max-w-[120px] ${theme.border}`} />
          <span className={`text-[9px] font-bold uppercase tracking-[0.5em] ${theme.accentText}`}>CASE</span>
          <div className={`h-px flex-1 max-w-[120px] ${theme.border}`} />
        </div>
      </header>

      <div className={`relative z-10 mt-8 ${block.layout === "compareGrid" ? "grid gap-5 lg:grid-cols-2 lg:items-start" : "space-y-5"}`}>
        {visiblePairs.map((pair, index) => (
          <ComparisonPair
            key={`${pair.before?.id || "before"}-${pair.after?.id || "after"}-${index}`}
            pair={pair}
            index={index}
            layout={block.layout}
            theme={theme}
            blockId={block.id}
            isEditMode={isEditMode}
            shareMode={shareMode}
            comparisonMode={comparisonMode}
            onOpenLightbox={onOpenLightbox}
            onUpdateImage={onUpdateImage}
            onRemoveImage={onRemoveImage}
          />
        ))}

        {isEditMode && (
          <button
            type="button"
            onClick={() => onAddPair(block.id)}
            className={`flex w-full items-center justify-center gap-2 rounded-lg border border-dashed border-[#8c7851]/30 bg-[#8c7851]/5 px-4 py-5 text-[10px] font-sans font-bold uppercase tracking-widest text-[#8c7851] transition hover:bg-[#8c7851]/10 ${block.layout === "compareGrid" ? "lg:col-span-2" : ""}`}
          >
            <Plus className="h-4 w-4" />
            ADD IMAGE PAIR
          </button>
        )}
      </div>

      <footer>
        <PosterFeatureStrip chips={block.chips} theme={theme} />
        <div className={`mt-6 text-center font-sans text-[10px] font-bold opacity-60 ${theme.accentText}`}>{siteConfig.footerText}</div>
      </footer>
    </motion.section>
  );
}

function CoverMedia({ src, alt }: any) {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return (
      <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(208,183,131,0.25),rgba(255,255,255,0.04)),linear-gradient(rgba(255,255,255,0.07)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.07)_1px,transparent_1px)] bg-[length:auto,22px_22px,22px_22px]" />
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      onError={() => setFailed(true)}
      className="absolute inset-0 h-full w-full object-cover opacity-72 transition duration-700 group-hover:scale-105 group-hover:opacity-90"
    />
  );
}

function CoverWall({ cases, isEditMode, clientMode = false }: any) {
  if (!cases.length) return null;

  return (
    <section className="mb-8 font-sans">
      <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
        <div>
          <div className="text-[11px] font-bold uppercase tracking-[0.35em] text-[#8c7851]">Cover Wall</div>
          <h2 className="mt-2 font-serif text-3xl font-light text-[#4a3f35]">案例封面墙</h2>
        </div>
        <div className="text-xs text-[#4a3f35]/55">点击封面快速跳转到对应案例</div>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {cases.slice(0, 8).map((block: any, index: number) => {
          const cover = getCaseCover(block);
          const theme = themeMap[block.theme as keyof typeof themeMap] || themeMap.brown;
          return (
            <a
              key={block.id}
              href={`#case-${block.id}`}
              className="group relative min-h-[190px] overflow-hidden rounded-lg border border-black/10 bg-[#181715] shadow-sm shadow-black/5 transition hover:-translate-y-0.5 hover:shadow-xl hover:shadow-black/10"
            >
              <CoverMedia src={cover} alt={block.navLabel || block.title} />
              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.05),rgba(0,0,0,0.78))]" />
              <div className="relative z-10 flex h-full min-h-[190px] flex-col justify-between p-4 text-white">
                <div className="flex items-center justify-between gap-2">
                  <span className={`rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-white ${theme.accent}`}>
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  {isEditMode && block.hidden && (
                    <span className="inline-flex items-center gap-1 rounded-full border border-white/15 bg-black/45 px-2 py-1 text-[10px] font-bold">
                      <EyeOff className="h-3 w-3" />
                      隐藏
                    </span>
                  )}
                </div>
                <div>
                  <div className="mb-2 line-clamp-2 font-serif text-xl font-light leading-tight">{block.navLabel || block.title}</div>
                  <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-widest text-white/62">
                    <span>{clientMode ? "精选案例" : `${getCompletePairCount(block.images)} 组完整`}</span>
                    <span>查看</span>
                  </div>
                </div>
              </div>
            </a>
          );
        })}
      </div>
    </section>
  );
}

function LongPosterPreview({ cases, onClose, onPrint }: any) {
  return (
    <section className="poster-print-area mb-8 overflow-hidden rounded-lg border border-[#d0b783]/25 bg-[#15130f] text-white shadow-2xl shadow-black/20">
      <style>{`
        @media print {
          body * { visibility: hidden !important; }
          .poster-print-area, .poster-print-area * { visibility: visible !important; }
          .poster-print-area { position: absolute !important; left: 0; top: 0; width: 100% !important; border: 0 !important; border-radius: 0 !important; }
        }
      `}</style>
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 px-5 py-4 font-sans">
        <div>
          <div className="text-[11px] font-bold uppercase tracking-[0.35em] text-[#d0b783]">Long Poster</div>
          <div className="mt-1 text-sm text-white/62">当前筛选下的完整案例长图预览</div>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={onPrint}
            className="inline-flex items-center gap-2 rounded-full bg-[#d0b783] px-4 py-2 text-xs font-bold text-[#15130f] transition hover:bg-[#e3ca91]"
          >
            <Download className="h-3.5 w-3.5" />
            打印/保存
          </button>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-bold text-white transition hover:bg-white/18"
          >
            关闭
          </button>
        </div>
      </div>
      <div className="mx-auto max-w-3xl px-5 py-8">
        <div className="mb-8 text-center">
          <div className="font-sans text-[11px] font-bold uppercase tracking-[0.45em] text-[#d0b783]">AI IMAGE CASES</div>
          <h2 className="mt-3 font-serif text-4xl font-light">前后对比长图海报</h2>
        </div>
        <div className="space-y-6">
          {cases.length === 0 && (
            <div className="rounded-lg border border-dashed border-white/15 px-6 py-14 text-center font-sans text-sm text-white/55">
              当前筛选下暂无完整案例可生成海报
            </div>
          )}
          {cases.map((block: any, index: number) => {
            const pair = getImagePairs(block.images || []).find((item) => hasImageUrl(item.before) && hasImageUrl(item.after));
            if (!pair) return null;
            return (
              <article key={block.id} className="overflow-hidden rounded-lg border border-white/10 bg-white/[0.06]">
                <div className="flex items-center justify-between gap-4 border-b border-white/10 px-4 py-3 font-sans">
                  <span className="text-[10px] font-bold uppercase tracking-[0.35em] text-[#d0b783]">{String(index + 1).padStart(2, "0")}</span>
                  <span className="truncate text-xs font-bold text-white/70">{block.navLabel || block.title}</span>
                </div>
                <div className="grid gap-px bg-white/10 md:grid-cols-2">
                  <img src={pair.before.url} alt={pair.before.label || "原图"} className="h-64 w-full bg-[#0f0d0a] object-cover" />
                  <img src={pair.after.url} alt={pair.after.label || "成图"} className="h-64 w-full bg-[#0f0d0a] object-cover" />
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function OverviewStats({ total, complete, todo, shareReady, hidden, clientMode }: any) {
  const stats = [
    { label: "总案例", value: total, icon: FolderOpen },
    { label: "已完成", value: complete, icon: CheckCircle2 },
    { label: "待补图", value: todo, icon: ImageOff },
    { label: "可分享", value: shareReady, icon: Share2 },
    { label: "已隐藏", value: hidden, icon: EyeOff },
  ];
  const percent = total ? Math.round((complete / total) * 100) : 0;

  return (
    <section className="mb-8 overflow-hidden rounded-lg border border-[#8c7851]/18 bg-[#181715] text-white shadow-xl shadow-black/10">
      <div className="grid gap-5 p-5 md:grid-cols-[260px_1fr] md:p-6">
        <div className="font-sans">
          <div className="text-[11px] font-bold uppercase tracking-[0.35em] text-[#d0b783]">
            {clientMode ? "Client View" : "Progress Overview"}
          </div>
          <div className="mt-3 font-serif text-3xl font-light">案例完成度总览</div>
          <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/10">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${percent}%` }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              className="h-full bg-[#d0b783]"
            />
          </div>
          <div className="mt-2 text-xs text-white/55">{percent}% 完成</div>
        </div>
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-5">
          {stats.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.label} className="rounded-lg border border-white/10 bg-white/[0.06] p-4 font-sans">
                <div className="mb-4 flex items-center justify-between text-white/55">
                  <Icon className="h-4 w-4" />
                  <span className="text-[10px] font-bold uppercase tracking-widest">{item.label}</span>
                </div>
                <div className="text-3xl font-semibold">{item.value}</div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function ContentEditor({ siteConfig, setSiteConfig, cases, setCases, selectedCaseId, setSelectedCaseId, onShowShareReady, onHideIncomplete, onSortByCompletion }: any) {
  const selectedCase = cases.find((item: any) => item.id === selectedCaseId) || cases[0] || null;
  const selectedCaseIndex = selectedCase ? cases.findIndex((item: any) => item.id === selectedCase.id) : -1;
  const [editorTab, setEditorTab] = useState<"site" | "case" | "images">("site");
  const editorTabs = [
    { id: "site", label: "页面文案", icon: SlidersHorizontal },
    { id: "case", label: "案例内容", icon: FolderOpen },
    { id: "images", label: "图片配对", icon: Images },
  ] as const;

  function updateSiteField(field: string, value: string) {
    setSiteConfig((prev: any) => ({ ...prev, [field]: value }));
  }

  function updateProcessSteps(text: string) {
    const steps = text
      .split("\n")
      .map((item) => item.trim())
      .filter(Boolean);
    setSiteConfig((prev: any) => ({ ...prev, processSteps: steps }));
  }

  function updateCaseField(field: string, value: string | string[]) {
    if (!selectedCase) return;
    setCases((prev: any) => prev.map((item: any) => (item.id === selectedCase.id ? { ...item, [field]: value } : item)));
  }

  function updateCaseChips(text: string) {
    const chips = text
      .split("\n")
      .map((item) => item.trim())
      .filter(Boolean);
    updateCaseField("chips", chips);
  }

  function updateImageLabel(index: number, value: string) {
    if (!selectedCase) return;
    setCases((prev: any) =>
      prev.map((block: any) =>
        block.id === selectedCase.id
          ? {
              ...block,
              images: block.images.map((image: any, imageIndex: number) => (imageIndex === index ? { ...image, label: value } : image)),
            }
          : block
      )
    );
  }

  function duplicateCase() {
    if (!selectedCase) return;
    const copy = {
      ...selectedCase,
      id: `${selectedCase.id}-${Date.now()}`,
      navLabel: `${selectedCase.navLabel} 副本`,
      title: `${selectedCase.title} 副本`,
      images: selectedCase.images.map((image: any, index: number) => ({ ...image, id: `${selectedCase.id}-copy-${Date.now()}-${index}` })),
    };
    setCases((prev: any) => [...prev, copy]);
    setSelectedCaseId(copy.id);
  }

  function addCase() {
    const id = `case-${Date.now()}`;
    const nextCase = {
      id,
      navLabel: "新案例",
      tag: "BEFORE / AFTER",
      title: "新的前后对比案例",
      subtitle: "原图 → AI成图",
      desc: "这里填写案例说明，例如适合什么场景、处理前后有什么变化。",
      chips: ["原图成图对比", "效果清晰可见", "适合批量展示"],
      theme: "brown",
      layout: "compareHero",
      images: [
        { id: `${id}-1`, label: "原图", url: "", aspectRatio: "", aspectLabel: "" },
        { id: `${id}-2`, label: "AI成图", url: "", aspectRatio: "", aspectLabel: "" },
      ],
    };
    setCases((prev: any) => [...prev, nextCase]);
    setSelectedCaseId(id);
  }

  function addZoomCase() {
    const id = `case-${Date.now()}`;
    const nextCase = {
      id,
      navLabel: "高清放大",
      tag: "ORIGINAL / ZOOM",
      title: "细节展现毫无压力的放大效果",
      subtitle: "局部细节 → 高清放大",
      desc: "鼠标悬停或查看对比，AI处理后的画面细节拉满。",
      chips: ["细节放大", "画质增强", "4X高清"],
      theme: "blue",
      layout: "highResZoom",
      images: [
        { id: `${id}-1`, label: "原图细节", url: "", aspectRatio: "", aspectLabel: "" },
        { id: `${id}-2`, label: "AI高清", url: "", aspectRatio: "", aspectLabel: "" },
      ],
    };
    setCases((prev: any) => [...prev, nextCase]);
    setSelectedCaseId(id);
  }

  function removeCase() {
    if (cases.length <= 1) return;
    setCases((prev: any) => prev.filter((item: any) => item.id !== selectedCase.id));
    const next = cases.find((item: any) => item.id !== selectedCase.id);
    if (next) setSelectedCaseId(next.id);
  }

  function moveCase(direction: -1 | 1) {
    if (!selectedCase || selectedCaseIndex < 0) return;
    const targetIndex = selectedCaseIndex + direction;
    if (targetIndex < 0 || targetIndex >= cases.length) return;
    setCases((prev: any[]) => {
      const next = [...prev];
      const [item] = next.splice(selectedCaseIndex, 1);
      next.splice(targetIndex, 0, item);
      return next;
    });
  }

  function toggleCaseHidden() {
    if (!selectedCase) return;
    setCases((prev: any[]) =>
      prev.map((item: any) => (item.id === selectedCase.id ? { ...item, hidden: !item.hidden } : item))
    );
  }

  const missingSlots = cases.flatMap((block: any) =>
    (block.images || [])
      .map((image: any, imageIndex: number) => ({ block, image, imageIndex }))
      .filter(({ image }: any) => !hasImageUrl(image))
  );

  return (
    <section className="mb-8 rounded-lg border border-[#8c7851]/20 bg-white/50 p-4 shadow-sm backdrop-blur md:p-6">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="text-[10px] uppercase tracking-widest font-sans font-bold text-[#8c7851]">Settings / 页面设置</h3>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={addCase}
            className="inline-flex items-center gap-2 rounded-sm bg-[#8c7851] px-4 py-2 text-[10px] font-sans font-bold uppercase tracking-widest text-white shadow-sm hover:bg-[#726244]"
          >
            <Plus className="h-3 w-3" /> Add Compare Case
          </button>
          <button
            type="button"
            onClick={addZoomCase}
            className="inline-flex items-center gap-2 rounded-sm bg-black px-4 py-2 text-[10px] font-sans font-bold uppercase tracking-widest text-white shadow-sm hover:bg-black/80"
          >
            <Plus className="h-3 w-3" /> Add Zoom Case
          </button>
          <button
            type="button"
            onClick={duplicateCase}
            disabled={!selectedCase}
            className="inline-flex items-center gap-2 rounded-sm border border-[#8c7851]/20 bg-transparent px-4 py-2 text-[10px] font-sans font-bold uppercase tracking-widest text-[#4a3f35] hover:bg-[#8c7851]/5"
          >
            <Copy className="h-3 w-3" /> Duplicate
          </button>
        </div>
      </div>

      <div className="mb-5 flex flex-wrap gap-2 border-b border-[#8c7851]/10 pb-4 font-sans">
        {editorTabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              type="button"
              aria-pressed={editorTab === tab.id}
              onClick={() => setEditorTab(tab.id)}
              className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-bold transition ${
                editorTab === tab.id
                  ? "border-[#8c7851] bg-[#8c7851] text-white"
                  : "border-[#8c7851]/20 bg-white text-[#4a3f35] hover:bg-[#8c7851]/5"
              }`}
            >
              <Icon className="h-3.5 w-3.5" />
              {tab.label}
            </button>
          );
        })}
      </div>

      <div className="mb-5 rounded-lg border border-[#8c7851]/18 bg-white/65 p-3 font-sans">
        <div className="mb-3 flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-[#8c7851]">
          <RotateCcw className="h-3.5 w-3.5" />
          批量操作
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={onHideIncomplete}
            className="inline-flex items-center gap-2 rounded-full border border-[#8c7851]/20 bg-white px-4 py-2 text-xs font-bold text-[#4a3f35] transition hover:bg-[#8c7851]/5"
          >
            <EyeOff className="h-3.5 w-3.5" />
            隐藏未完成案例
          </button>
          <button
            type="button"
            onClick={onSortByCompletion}
            className="inline-flex items-center gap-2 rounded-full border border-[#8c7851]/20 bg-white px-4 py-2 text-xs font-bold text-[#4a3f35] transition hover:bg-[#8c7851]/5"
          >
            <ListChecks className="h-3.5 w-3.5" />
            按完成度排序
          </button>
          <button
            type="button"
            onClick={onShowShareReady}
            className="inline-flex items-center gap-2 rounded-full border border-[#8c7851]/20 bg-[#8c7851] px-4 py-2 text-xs font-bold text-white transition hover:bg-[#756443]"
          >
            <Share2 className="h-3.5 w-3.5" />
            只看可分享案例
          </button>
        </div>
      </div>

      {editorTab === "site" && (
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Top Badge" value={siteConfig.topBadge} onChange={(value: string) => updateSiteField("topBadge", value)} />
          <Field label="All Button Label" value={siteConfig.allTabLabel} onChange={(value: string) => updateSiteField("allTabLabel", value)} />
          <Field label="Hero Title" value={siteConfig.heroTitle} onChange={(value: string) => updateSiteField("heroTitle", value)} multiline />
          <Field label="Description" value={siteConfig.heroDesc} onChange={(value: string) => updateSiteField("heroDesc", value)} multiline />
          <Field label="Process Steps" value={siteConfig.processSteps.join("\n")} onChange={updateProcessSteps} multiline />
          <Field label="Tip Text" value={siteConfig.tipText} onChange={(value: string) => updateSiteField("tipText", value)} multiline />
          <div className="md:col-span-2">
            <Field label="Footer Text" value={siteConfig.footerText} onChange={(value: string) => updateSiteField("footerText", value)} />
          </div>
        </div>
      )}

      {editorTab === "case" && (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 font-sans">
            <div className="text-[10px] font-bold uppercase tracking-widest text-[#8c7851]">Current Case Content</div>
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => moveCase(-1)}
                disabled={selectedCaseIndex <= 0}
                className="inline-flex items-center gap-1 rounded-full border border-[#8c7851]/20 bg-white px-3 py-1.5 text-xs font-bold text-[#4a3f35] transition hover:bg-[#8c7851]/5 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ArrowUp className="h-3.5 w-3.5" />
                上移
              </button>
              <button
                type="button"
                onClick={() => moveCase(1)}
                disabled={selectedCaseIndex < 0 || selectedCaseIndex >= cases.length - 1}
                className="inline-flex items-center gap-1 rounded-full border border-[#8c7851]/20 bg-white px-3 py-1.5 text-xs font-bold text-[#4a3f35] transition hover:bg-[#8c7851]/5 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ArrowDown className="h-3.5 w-3.5" />
                下移
              </button>
              <button
                type="button"
                onClick={toggleCaseHidden}
                disabled={!selectedCase}
                className={`inline-flex items-center gap-1 rounded-full border px-3 py-1.5 text-xs font-bold transition disabled:cursor-not-allowed disabled:opacity-40 ${
                  selectedCase?.hidden
                    ? "border-[#9d4447]/25 bg-[#9d4447]/10 text-[#9d4447]"
                    : "border-[#2f3b35]/20 bg-white text-[#2f3b35] hover:bg-[#2f3b35]/5"
                }`}
              >
                {selectedCase?.hidden ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                {selectedCase?.hidden ? "已隐藏" : "公开"}
              </button>
              <label className="flex items-center gap-2 text-xs text-[#4a3f35]/60">
                案例
                <select
                  value={selectedCase?.id || ""}
                  onChange={(event) => setSelectedCaseId(event.target.value)}
                  className="rounded-md border border-[#8c7851]/20 bg-white px-2 py-1.5 text-xs text-[#4a3f35] outline-none"
                >
                  {cases.map((item: any) => (
                    <option key={item.id} value={item.id}>
                      {item.navLabel || item.title}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          </div>

          {selectedCase && (
            <div className="grid gap-4 md:grid-cols-2">
              <div className="grid gap-3 md:grid-cols-2">
                <Field label="Nav Label" value={selectedCase.navLabel} onChange={(value: string) => updateCaseField("navLabel", value)} />
                <Field label="Case Tag" value={selectedCase.tag} onChange={(value: string) => updateCaseField("tag", value)} />
              </div>
              <div className="md:col-span-2">
                <Field label="Case Title" value={selectedCase.title} onChange={(value: string) => updateCaseField("title", value)} />
              </div>
              <Field label="Subtitle" value={selectedCase.subtitle} onChange={(value: string) => updateCaseField("subtitle", value)} />
              <Field label="Description" value={selectedCase.desc} onChange={(value: string) => updateCaseField("desc", value)} multiline />
              <Field label="Chips (one per line)" value={selectedCase.chips.join("\n")} onChange={updateCaseChips} multiline />

              <div className="grid gap-3">
                <label className="block space-y-1.5">
                  <span className="block text-[10px] font-sans uppercase font-bold opacity-50">Theme Color</span>
                  <select
                    value={selectedCase.theme}
                    onChange={(event) => updateCaseField("theme", event.target.value)}
                    className="w-full bg-white border border-[#8c7851]/20 rounded-md p-2 text-xs focus:ring-1 focus:ring-[#8c7851] outline-none transition"
                  >
                    {Object.entries(themeMap).map(([key, theme]) => (
                      <option key={key} value={key}>
                        {theme.label}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
            </div>
          )}
        </div>
      )}

      {editorTab === "images" && (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 font-sans">
            <div className="text-[10px] font-bold uppercase tracking-widest text-[#8c7851]">Image Pairing</div>
            <select
              value={selectedCase?.id || ""}
              onChange={(event) => setSelectedCaseId(event.target.value)}
              className="rounded-md border border-[#8c7851]/20 bg-white px-2 py-1.5 text-xs text-[#4a3f35] outline-none"
            >
              {cases.map((item: any) => (
                <option key={item.id} value={item.id}>
                  {item.navLabel || item.title}
                </option>
              ))}
            </select>
          </div>

          <div className="rounded-lg border border-[#8c7851]/18 bg-white/65 p-3 font-sans">
            <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
              <div className="text-[10px] font-bold uppercase tracking-widest text-[#8c7851]">缺图管理</div>
              <div className="rounded-full bg-[#8c7851]/10 px-3 py-1 text-[10px] font-bold text-[#8c7851]">
                {missingSlots.length} 个待补图位
              </div>
            </div>
            {missingSlots.length > 0 ? (
              <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-3">
                {missingSlots.slice(0, 12).map(({ block, image, imageIndex }: any) => (
                  <button
                    key={`${block.id}-${image.id || imageIndex}`}
                    type="button"
                    onClick={() => setSelectedCaseId(block.id)}
                    className={`rounded-md border px-3 py-2 text-left transition ${
                      selectedCase?.id === block.id
                        ? "border-[#8c7851] bg-[#8c7851]/10"
                        : "border-[#8c7851]/15 bg-white hover:bg-[#8c7851]/5"
                    }`}
                  >
                    <div className="truncate text-xs font-bold text-[#4a3f35]">{block.navLabel || block.title}</div>
                    <div className="mt-1 text-[10px] text-[#4a3f35]/55">
                      第 {Math.floor(imageIndex / 2) + 1} 组 · {image.label || `图片 ${imageIndex + 1}`}
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <div className="rounded-md border border-dashed border-[#8c7851]/18 bg-[#8c7851]/5 px-4 py-5 text-center text-xs text-[#4a3f35]/55">
                当前没有缺图位
              </div>
            )}
          </div>

          {selectedCase && (
            <>
              <div className="grid gap-3 md:grid-cols-2">
                <label className="block space-y-1.5">
                  <span className="block text-[10px] font-sans uppercase font-bold opacity-50">Layout</span>
                  <select
                    value={selectedCase.layout}
                    onChange={(event) => updateCaseField("layout", event.target.value)}
                    className="w-full rounded-md border border-[#8c7851]/20 bg-white p-2 text-xs outline-none transition focus:ring-1 focus:ring-[#8c7851]"
                  >
                    {layoutOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </label>
                <div className="rounded-md border border-[#8c7851]/20 bg-white/70 p-3 font-sans text-xs text-[#4a3f35]/60">
                  <div className="font-bold text-[#4a3f35]">{getCompletePairCount(selectedCase.images)} 组完整对比</div>
                  <div className="mt-1">{getUploadProgress(selectedCase.images).uploaded}/{getUploadProgress(selectedCase.images).total} 张图片已上传</div>
                </div>
              </div>

              <div className="grid gap-3 md:grid-cols-2">
                {getImagePairs(selectedCase.images || []).map((pair: any, pairIndex: number) => {
                  const beforeReady = hasImageUrl(pair.before);
                  const afterReady = hasImageUrl(pair.after);
                  return (
                    <div key={`${selectedCase.id}-pair-${pairIndex}`} className="rounded-md border border-[#8c7851]/20 bg-white/65 p-3">
                      <div className="mb-3 flex items-center justify-between gap-3 font-sans text-[10px] font-bold uppercase tracking-widest text-[#4a3f35]/55">
                        <span>Pair {pairIndex + 1}</span>
                        <span className={beforeReady && afterReady ? "text-[#2f7a4f]" : "text-[#9d6a2b]"}>
                          {beforeReady && afterReady ? "已配对" : "待补图"}
                        </span>
                      </div>
                      <div className="grid gap-2">
                        {pair.before && (
                          <input
                            value={pair.before.label}
                            onChange={(event) => updateImageLabel(pair.beforeIndex, event.target.value)}
                            className="w-full rounded-md border border-[#8c7851]/20 bg-white px-2 py-1.5 text-xs text-[#4a3f35] outline-none"
                            placeholder={`Before ${pairIndex + 1}`}
                          />
                        )}
                        {pair.after && (
                          <input
                            value={pair.after.label}
                            onChange={(event) => updateImageLabel(pair.afterIndex, event.target.value)}
                            className="w-full rounded-md border border-[#8c7851]/20 bg-white px-2 py-1.5 text-xs text-[#4a3f35] outline-none"
                            placeholder={`After ${pairIndex + 1}`}
                          />
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              <button
                type="button"
                onClick={removeCase}
                disabled={!selectedCase || cases.length <= 1}
                className="flex items-center justify-center gap-2 mt-4 rounded-sm border border-red-900/20 bg-transparent px-4 py-2 text-[10px] font-sans font-bold uppercase tracking-widest text-[#9d2b2f] transition hover:bg-red-900/5 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <Trash2 className="h-3 w-3" /> Remove Case
              </button>
            </>
          )}
        </div>
      )}
    </section>
  );
}

export default function App() {
  // Check if the app is running in the shared preview environment
  const isSharedPreview = typeof window !== "undefined" && window.location.hostname.includes("ais-pre");

  // Keep the showcase as the first impression; editing is always one click away for local users.
  const [isEditMode, setIsEditMode] = useState(false);
  const [siteConfig, setSiteConfig] = useState<any>(null);
  const [cases, setCases] = useState<any[]>([]);
  const [activeCategory, setActiveCategory] = useState("all");
  const [progressFilter, setProgressFilter] = useState("all");
  const [shareMode, setShareMode] = useState(false);
  const [posterMode, setPosterMode] = useState(false);
  const [comparisonMode, setComparisonMode] = useState<"slider" | "layout" | "cards">("slider");
  const [clientMode, setClientMode] = useState(false);
  const [presentationMode, setPresentationMode] = useState(false);
  const [presentationIndex, setPresentationIndex] = useState(0);
  const [lightbox, setLightbox] = useState<any>(null);
  const [selectedCaseId, setSelectedCaseId] = useState("");
  const [isDataReady, setIsDataReady] = useState(false);
  const appEnv = ((import.meta as any).env || {}) as { BASE_URL?: string; VITE_STATIC_SITE?: string };
  const staticSiteMode = appEnv.VITE_STATIC_SITE === "true";
  const staticBasePath = appEnv.BASE_URL || "/";
  const staticDataUrl = `${staticBasePath.replace(/\/$/, "")}/data.json`.replace(/^\/data\.json$/, "/data.json");
  const [isApiAvailable, setIsApiAvailable] = useState(!staticSiteMode);
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const lastSavedJsonRef = useRef("");

  useEffect(() => {
    // Prevent global drag/drop to avoid browser opening the image inadvertently
    function handleGlobalDrag(e: DragEvent) {
      e.preventDefault();
      e.stopPropagation();
    }
    window.addEventListener("dragover", handleGlobalDrag);
    window.addEventListener("drop", handleGlobalDrag);
    return () => {
      window.removeEventListener("dragover", handleGlobalDrag);
      window.removeEventListener("drop", handleGlobalDrag);
    };
  }, []);

  useEffect(() => {
    async function loadData() {
      try {
        let text = "";
        let loadedFromApi = false;

        if (!staticSiteMode) {
          try {
            const apiRes = await fetch("/api/data", { cache: "no-store" });
            text = await apiRes.text();
            if (text.includes("Cookie check") && text.includes("authFlowTestCookie")) {
               window.location.reload();
               return;
            }
            if (!apiRes.ok || text.trim().startsWith("<")) {
              throw new Error(`API data unavailable: ${apiRes.status}`);
            }
            loadedFromApi = true;
          } catch (apiErr) {
            console.info("Using static data.json fallback:", apiErr);
          }
        }

        if (!loadedFromApi) {
          const staticRes = await fetch(staticDataUrl, { cache: "no-store" });
          text = await staticRes.text();
          if (!staticRes.ok || text.trim().startsWith("<")) {
            throw new Error(`Static data unavailable: ${staticRes.status}`);
          }
        }

        const data = JSON.parse(text);
        const nextCases = Array.isArray(data.cases) ? data.cases : [];
        const normalizedCases = loadedFromApi
          ? nextCases
          : nextCases.map((block: any) => ({
              ...block,
              images: (block.images || []).map((image: any) => ({
                ...image,
                url:
                  typeof image?.url === "string" && image.url.startsWith("/uploads/")
                    ? `${staticBasePath.replace(/\/$/, "")}${image.url}`
                    : image?.url || "",
              })),
            }));
        const nextSiteConfig = normalizeSiteConfig(data.siteConfig);
        lastSavedJsonRef.current = JSON.stringify({ cases: normalizedCases, siteConfig: nextSiteConfig });
        setSiteConfig(nextSiteConfig);
        setCases(normalizedCases);
        if (normalizedCases.length > 0) setSelectedCaseId(normalizedCases[0].id);
        setIsApiAvailable(loadedFromApi);
        if (!loadedFromApi) setIsEditMode(false);
        setIsDataReady(true);
      } catch (err) {
        console.error("Failed to load data:", err);
        lastSavedJsonRef.current = JSON.stringify({ cases: [], siteConfig: defaultSiteConfig });
        setIsApiAvailable(false);
        setIsEditMode(false);
        setSiteConfig(defaultSiteConfig);
        setCases([]);
        setIsDataReady(true);
      }
    }
    loadData();
  }, []);

  useEffect(() => {
    if (!siteConfig || !isDataReady || !isApiAvailable) return;
    const nextSnapshot = JSON.stringify({ cases, siteConfig });
    if (nextSnapshot === lastSavedJsonRef.current) return;
    const timeout = setTimeout(async () => {
      try {
        setSaveStatus("saving");
        const res = await fetch("/api/save", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ cases, siteConfig }),
        });
        const text = await res.text();
        if (text.includes("Cookie check") && text.includes("authFlowTestCookie")) {
           window.location.reload();
        }
        if (res.ok) {
          lastSavedJsonRef.current = nextSnapshot;
          setSaveStatus("saved");
        } else {
          setSaveStatus("error");
        }
      } catch (err) {
        console.error(err);
        setSaveStatus("error");
      }
    }, 500);
    return () => clearTimeout(timeout);
  }, [cases, siteConfig, isDataReady, isApiAvailable]);

  useEffect(() => {
    if (!clientMode) return;
    setIsEditMode(false);
    setShareMode(true);
    setProgressFilter("all");
  }, [clientMode]);

  const visibleCases = useMemo(() => {
    return isEditMode ? cases : cases.filter((block) => !block.hidden);
  }, [cases, isEditMode]);

  const filteredCases = useMemo(() => {
    return visibleCases.filter((block) => {
      const categoryId = getCaseCategoryId(block);
      if (activeCategory !== "all" && categoryId !== activeCategory) return false;
      if (progressFilter === "complete" && !isCaseComplete(block)) return false;
      if (progressFilter === "todo" && isCaseComplete(block)) return false;
      if (shareMode && getCompletePairCount(block.images) === 0) return false;
      return true;
    });
  }, [activeCategory, progressFilter, shareMode, visibleCases]);

  useEffect(() => {
    setPresentationIndex(0);
  }, [activeCategory, progressFilter, shareMode, filteredCases.length]);

  useEffect(() => {
    if (!presentationMode || filteredCases.length === 0) return;
    const current = filteredCases[presentationIndex % filteredCases.length];
    window.setTimeout(() => {
      document.getElementById(`case-${current.id}`)?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 120);
    const interval = window.setInterval(() => {
      setPresentationIndex((index) => (index + 1) % filteredCases.length);
    }, 5200);
    return () => window.clearInterval(interval);
  }, [filteredCases, presentationIndex, presentationMode]);

  const categoryCounts = useMemo(() => {
    return categoryOptions.reduce((acc: Record<string, number>, option) => {
      acc[option.id] =
        option.id === "all"
          ? visibleCases.length
          : visibleCases.filter((block) => getCaseCategoryId(block) === option.id).length;
      return acc;
    }, {});
  }, [visibleCases]);

  const completeCaseCount = useMemo(() => visibleCases.filter(isCaseComplete).length, [visibleCases]);
  const todoCaseCount = Math.max(0, visibleCases.length - completeCaseCount);
  const shareReadyCaseCount = useMemo(() => visibleCases.filter((block) => getCompletePairCount(block.images) > 0).length, [visibleCases]);
  const hiddenCaseCount = useMemo(() => cases.filter((block) => block.hidden).length, [cases]);
  const posterCases = useMemo(() => filteredCases.filter((block) => getCompletePairCount(block.images) > 0), [filteredCases]);

  const heroImage = useMemo(() => {
    const remoteImage = visibleCases
      .flatMap((block) => block.images || [])
      .find((image: any) => typeof image?.url === "string" && image.url.startsWith("http"));
    if (remoteImage?.url) return String(remoteImage.url).replace(/w=\d+/i, "w=1800").replace(/q=\d+/i, "q=85");

    let bestImage = "";
    let bestScore = 0;
    for (const block of visibleCases) {
      for (const image of block.images || []) {
        if (!image?.url) continue;
        const score = Number(image.width || 0) * Number(image.height || 0) || (image.url.startsWith("/uploads/") ? 1_000_000 : 1);
        if (score > bestScore) {
          bestImage = image.url;
          bestScore = score;
        }
      }
    }
    return bestImage;
  }, [visibleCases]);

  if (!siteConfig) {
    return <div className="flex h-screen items-center justify-center font-serif text-[#8c7851]">Loading...</div>;
  }

  function updateImage(blockId: string, imageIndex: number, imageData: any) {
    setCases((prev) =>
      prev.map((block) =>
        block.id === blockId
          ? {
              ...block,
              images: block.images.map((item, index) =>
                index === imageIndex
                  ? {
                      ...item,
                      url: imageData.url,
                      width: imageData.width,
                      height: imageData.height,
                      aspectRatio: imageData.aspectRatio,
                      aspectLabel: imageData.aspectLabel,
                    }
                  : item
              ),
            }
          : block
      )
    );
  }

  function removeImage(blockId: string, imageIndex: number) {
    setCases((prev) =>
      prev.map((block) =>
        block.id === blockId
          ? {
              ...block,
              images: block.images.map((item, index) =>
                index === imageIndex ? { ...item, url: "", width: undefined, height: undefined } : item
              ),
            }
          : block
      )
    );
  }

  function addPair(blockId: string) {
    setCases((prev) =>
      prev.map((block) =>
        block.id === blockId
          ? {
              ...block,
              images: [
                ...block.images,
                {
                  id: `${blockId}-before-${Date.now()}`,
                  label: "原图",
                  url: "",
                  aspectRatio: "",
                  aspectLabel: "",
                },
                {
                  id: `${blockId}-after-${Date.now()}`,
                  label: "AI成图",
                  url: "",
                  aspectRatio: "",
                  aspectLabel: "",
                },
              ],
            }
          : block
      )
    );
  }

  function shiftLightbox(direction: number) {
    setLightbox((prev: any) => {
      if (!prev?.images?.length) return prev;
      const nextIndex = (prev.index + direction + prev.images.length) % prev.images.length;
      return { ...prev, index: nextIndex };
    });
  }

  function printPoster() {
    setPosterMode(true);
    window.setTimeout(() => window.print(), 80);
  }

  function showShareReadyCases() {
    setActiveCategory("all");
    setProgressFilter("all");
    setShareMode(true);
    setClientMode(false);
    setPresentationMode(false);
  }

  function hideIncompleteCases() {
    setCases((prev) =>
      prev.map((block) => ({ ...block, hidden: getMissingSlotCount(block) > 0 ? true : block.hidden }))
    );
  }

  function sortByCompletion() {
    setCases((prev) =>
      [...prev].sort((a, b) => {
        const completeDelta = Number(isCaseComplete(b)) - Number(isCaseComplete(a));
        if (completeDelta !== 0) return completeDelta;
        return getCompletePairCount(b.images) - getCompletePairCount(a.images);
      })
    );
  }

  function enterClientMode() {
    setClientMode(true);
    setIsEditMode(false);
    setShareMode(true);
    setProgressFilter("all");
    setPosterMode(false);
  }

  function exitClientMode() {
    setClientMode(false);
    setPresentationMode(false);
  }

  return (
    <main className="min-h-screen bg-[#f4f1ea] text-[#342f2a] font-serif">
      {!isSharedPreview && !clientMode && isApiAvailable && (
        <div className="fixed right-4 top-4 z-50 flex items-center gap-2 rounded-full border border-black/10 bg-white/85 p-1 font-sans shadow-xl shadow-black/10 backdrop-blur-md md:right-8 md:top-8">
          <button
            type="button"
            onClick={() => setIsEditMode(false)}
            className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold transition-colors ${
              !isEditMode ? "bg-[#2f3b35] text-white" : "text-[#342f2a] hover:bg-black/5"
            }`}
          >
            <Eye className="h-3.5 w-3.5" />
            展示
          </button>
          <button
            type="button"
            onClick={() => setIsEditMode(true)}
            className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold transition-colors ${
              isEditMode ? "bg-[#8c7851] text-white" : "text-[#342f2a] hover:bg-black/5"
            }`}
          >
            <Pencil className="h-3.5 w-3.5" />
            编辑
          </button>
          {saveStatus !== "idle" && (
            <span className="hidden px-3 text-[10px] font-bold uppercase tracking-widest text-[#6b6258] md:inline">
              {saveStatus === "saving" ? "保存中" : saveStatus === "saved" ? "已保存" : "保存失败"}
            </span>
          )}
        </div>
      )}

      {clientMode && (
        <div className="fixed right-4 top-4 z-50 flex items-center gap-2 rounded-full border border-white/15 bg-[#181715]/86 p-1 font-sans text-white shadow-xl shadow-black/20 backdrop-blur-md md:right-8 md:top-8">
          <span className="hidden items-center gap-2 px-3 text-[10px] font-bold uppercase tracking-widest text-[#d0b783] md:inline-flex">
            <UserCheck className="h-3.5 w-3.5" />
            客户视角
          </span>
          <button
            type="button"
            onClick={() => setPresentationMode((value) => !value)}
            className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold transition-colors ${
              presentationMode ? "bg-[#d0b783] text-[#181715]" : "text-white hover:bg-white/10"
            }`}
          >
            {presentationMode ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
            {presentationMode ? "暂停演示" : "播放演示"}
          </button>
          <button
            type="button"
            onClick={exitClientMode}
            className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-white/10"
          >
            <X className="h-3.5 w-3.5" />
            退出
          </button>
        </div>
      )}

      {isEditMode && isApiAvailable && (
        <div className="px-4 pt-20 md:px-8">
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            className="mx-auto max-w-7xl"
          >
            <ContentEditor
              siteConfig={siteConfig}
              setSiteConfig={setSiteConfig}
              cases={cases}
              setCases={setCases}
              selectedCaseId={selectedCaseId}
              setSelectedCaseId={setSelectedCaseId}
              onShowShareReady={showShareReadyCases}
              onHideIncomplete={hideIncompleteCases}
              onSortByCompletion={sortByCompletion}
            />
          </motion.div>
        </div>
      )}

      <section className="relative isolate min-h-[72svh] overflow-hidden border-b border-black/10 bg-[#181715] px-4 py-16 text-white md:px-8 md:py-28">
        {heroImage && (
          <img
            src={heroImage}
            alt=""
            aria-hidden="true"
            className="absolute inset-0 -z-20 h-full w-full object-cover opacity-45"
          />
        )}
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(16,15,13,0.9),rgba(16,15,13,0.58)_48%,rgba(16,15,13,0.18))]" />
        <div className="mx-auto grid max-w-7xl gap-8 md:grid-cols-[minmax(0,1fr)_340px] md:items-end md:gap-12">
          <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55 }}>
            <span className="mb-5 block font-sans text-[11px] font-bold uppercase tracking-[0.35em] text-[#d0b783]">
              {siteConfig.topBadge}
            </span>
            <h1 className="max-w-4xl whitespace-pre-line text-[42px] font-light leading-[1.08] text-balance md:text-7xl">
              {siteConfig.heroTitle}
            </h1>
            <p className="mt-5 max-w-2xl font-sans text-base leading-7 text-white/72 md:mt-6 md:text-lg md:leading-8">
              {siteConfig.heroDesc}
            </p>

            <div className="mt-7 flex flex-wrap gap-2 md:mt-9 md:gap-3">
              {categoryOptions.map((item) => {
                const Icon = categoryIconMap[item.id] || FolderOpen;
                const label = item.id === "all" ? siteConfig.allTabLabel || item.label : item.label;
                return (
                  <button
                    key={item.id}
                    type="button"
                    aria-pressed={activeCategory === item.id}
                    title={item.description}
                    onClick={() => setActiveCategory(item.id)}
                    className={`inline-flex min-h-10 items-center gap-2 rounded-full border px-4 py-2 font-sans text-[11px] font-bold uppercase tracking-widest transition ${
                      activeCategory === item.id
                        ? "border-[#d0b783] bg-[#d0b783] text-[#181715]"
                        : "border-white/25 bg-white/10 text-white hover:bg-white/18"
                    }`}
                  >
                    <Icon className="h-3.5 w-3.5" />
                    <span>{label}</span>
                    {!clientMode && (
                      <span className={`rounded-full px-2 py-0.5 text-[10px] ${activeCategory === item.id ? "bg-black/10" : "bg-white/10"}`}>
                        {categoryCounts[item.id] || 0}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </motion.div>

          <motion.aside
            initial={{ opacity: 0, x: 18 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.55, delay: 0.08 }}
            className="border-l border-white/18 pl-5 font-sans md:pl-6"
          >
            <h3 className="mb-5 text-[11px] font-bold uppercase tracking-[0.35em] text-[#d0b783]">Process / 流程</h3>
            <div className="grid grid-cols-2 gap-3 md:block md:space-y-4">
              {siteConfig.processSteps.map((item: string, index: number) => (
                <div key={`${item}-${index}`} className="grid grid-cols-[32px_1fr] items-start gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full border border-white/20 bg-white/10 text-xs font-bold text-white">
                    {index + 1}
                  </div>
                  <div className="pt-1.5 text-sm leading-6 text-white/78">{item}</div>
                </div>
              ))}
            </div>
            <p className="mt-7 hidden border-t border-white/14 pt-5 text-xs leading-6 text-white/62 sm:block">{siteConfig.tipText}</p>
          </motion.aside>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-10 md:px-8 md:py-14">
        {!clientMode && (
          <OverviewStats
            total={visibleCases.length}
            complete={completeCaseCount}
            todo={todoCaseCount}
            shareReady={shareReadyCaseCount}
            hidden={hiddenCaseCount}
            clientMode={clientMode}
          />
        )}

        {!clientMode && (
        <section className="mb-8 rounded-lg border border-[#8c7851]/20 bg-white/72 p-4 font-sans shadow-sm shadow-black/5 backdrop-blur md:p-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-[#8c7851]">
                <Filter className="h-3.5 w-3.5" />
                状态
              </span>
              {progressFilterOptions.map((option) => (
                <button
                  key={option.id}
                  type="button"
                  aria-pressed={progressFilter === option.id}
                  onClick={() => setProgressFilter(option.id)}
                  className={`rounded-full border px-4 py-2 text-xs font-bold transition ${
                    progressFilter === option.id
                      ? "border-[#2f3b35] bg-[#2f3b35] text-white"
                      : "border-[#8c7851]/20 bg-white text-[#4a3f35] hover:bg-[#8c7851]/5"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-[#8c7851]">
                <SlidersHorizontal className="h-3.5 w-3.5" />
                对比
              </span>
              {[
                { id: "slider", label: "滑杆" },
                { id: "layout", label: "原布局" },
                { id: "cards", label: "双图" },
              ].map((option) => (
                <button
                  key={option.id}
                  type="button"
                  aria-pressed={comparisonMode === option.id}
                  onClick={() => setComparisonMode(option.id as "slider" | "layout" | "cards")}
                  className={`rounded-full border px-4 py-2 text-xs font-bold transition ${
                    comparisonMode === option.id
                      ? "border-[#8c7851] bg-[#8c7851] text-white"
                      : "border-[#8c7851]/20 bg-white text-[#4a3f35] hover:bg-[#8c7851]/5"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>

            <div className="flex flex-wrap items-center gap-2 text-xs text-[#4a3f35]/70">
              <span className="inline-flex items-center gap-2 rounded-full border border-[#8c7851]/15 bg-[#8c7851]/5 px-3 py-2">
                <ListChecks className="h-3.5 w-3.5 text-[#8c7851]" />
                {completeCaseCount}/{visibleCases.length} 已完成
              </span>
              {isEditMode && hiddenCaseCount > 0 && (
                <span className="inline-flex items-center gap-2 rounded-full border border-[#9d4447]/15 bg-[#9d4447]/5 px-3 py-2">
                  <EyeOff className="h-3.5 w-3.5 text-[#9d4447]" />
                  {hiddenCaseCount} 个隐藏
                </span>
              )}
              <span className="inline-flex items-center gap-2 rounded-full border border-[#8c7851]/15 bg-[#8c7851]/5 px-3 py-2">
                <Images className="h-3.5 w-3.5 text-[#8c7851]" />
                {shareReadyCaseCount} 个可分享案例
              </span>
              <button
                type="button"
                aria-pressed={shareMode}
                onClick={() => setShareMode((value) => !value)}
                className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-bold transition ${
                  shareMode
                    ? "border-[#8c7851] bg-[#8c7851] text-white"
                    : "border-[#8c7851]/20 bg-white text-[#4a3f35] hover:bg-[#8c7851]/5"
                }`}
              >
                <Share2 className="h-3.5 w-3.5" />
                导出视图
              </button>
              <button
                type="button"
                aria-pressed={posterMode}
                onClick={() => setPosterMode((value) => !value)}
                className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-bold transition ${
                  posterMode
                    ? "border-[#15130f] bg-[#15130f] text-white"
                    : "border-[#8c7851]/20 bg-white text-[#4a3f35] hover:bg-[#8c7851]/5"
                }`}
              >
                <Download className="h-3.5 w-3.5" />
                长图海报
              </button>
              <button
                type="button"
                aria-pressed={presentationMode}
                onClick={() => setPresentationMode((value) => !value)}
                className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-bold transition ${
                  presentationMode
                    ? "border-[#2f3b35] bg-[#2f3b35] text-white"
                    : "border-[#8c7851]/20 bg-white text-[#4a3f35] hover:bg-[#8c7851]/5"
                }`}
              >
                {presentationMode ? <Pause className="h-3.5 w-3.5" /> : <Presentation className="h-3.5 w-3.5" />}
                {presentationMode ? "暂停演示" : "演示播放"}
              </button>
              <button
                type="button"
                onClick={enterClientMode}
                className="inline-flex items-center gap-2 rounded-full border border-[#15130f]/15 bg-[#15130f] px-4 py-2 text-xs font-bold text-white transition hover:bg-[#2f2a24]"
              >
                <UserCheck className="h-3.5 w-3.5" />
                客户视角
              </button>
            </div>
          </div>
        </section>
        )}

        <CoverWall cases={filteredCases} isEditMode={isEditMode} clientMode={clientMode} />

        {posterMode && (
          <LongPosterPreview
            cases={posterCases}
            onClose={() => setPosterMode(false)}
            onPrint={printPoster}
          />
        )}

        <div className={`grid gap-8 ${clientMode ? "" : "lg:grid-cols-[260px_minmax(0,1fr)]"}`}>
          {!clientMode && (
          <aside className="hidden md:block">
            <div className={`sticky top-0 flex h-screen flex-col border-r border-[#e8e5e0] bg-white font-sans`}>
              {/* Sidebar header */}
              <div className="flex-none border-b border-[#e8e5e0] px-5 py-4">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#8c7851] text-white">
                    <Images className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-[#2f3b35]">AI 案例馆</div>
                    <div className="text-[10px] text-[#9a9186]">{cases.length} 个案例</div>
                  </div>
                </div>
              </div>
              {/* Scrollable nav */}
              <nav className="flex-1 overflow-y-auto px-3 py-3">
                <a
                  href="#"
                  onClick={(e) => { e.preventDefault(); setActiveCategory("all"); }}
                  className={`mb-1 flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-all duration-150 ${activeCategory === "all" ? "bg-blue-50 font-semibold text-blue-600 shadow-sm" : "text-[#5a5550] hover:bg-[#f5f3f0] hover:text-[#2f3b35]"}`}>
                    <div className={`flex h-7 w-7 flex-none items-center justify-center rounded-md ${activeCategory === "all" ? "bg-blue-100 text-blue-600" : "bg-[#f0eeeb] text-[#9a9186]"}`}>
                      <Images className="h-3.5 w-3.5" />
                    </div>
                    <span className="flex-1">全部案例</span>
                    <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${activeCategory === "all" ? "bg-blue-100 text-blue-600" : "bg-[#f0eeeb] text-[#9a9186]"}`}>
                      {visibleCases.length}
                    </span>
                </a>
                <div className="my-2 border-t border-[#f0eeeb]" />
                {categoryOptions.filter(c => c.id !== "all").map((cat) => {
                  const Icon = categoryIconMap[cat.id] || FolderOpen;
                  const groupCases = cases.filter((b) => getCaseCategoryId(b) === cat.id);
                  const isActive = activeCategory === cat.id;
                  return (
                    <div key={cat.id} className="mb-1">
                      <button
                        type="button"
                        onClick={() => setActiveCategory(cat.id)}
                        className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition-all duration-150 ${isActive ? "bg-blue-50 font-semibold text-blue-600 shadow-sm" : "text-[#5a5550] hover:bg-[#f5f3f0] hover:text-[#2f3b35]"}`}>
                          <div className={`flex h-7 w-7 flex-none items-center justify-center rounded-md ${isActive ? "bg-blue-100 text-blue-600" : "bg-[#f0eeeb] text-[#9a9186]"}`}>
                            <Icon className="h-3.5 w-3.5" />
                          </div>
                          <span className="flex-1 font-medium">{cat.label}</span>
                          <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${isActive ? "bg-blue-100 text-blue-600" : "bg-[#f0eeeb] text-[#9a9186]"}`}>
                            {groupCases.length}
                          </span>
                        </button>
                        {isActive && groupCases.length > 0 && (
                          <div className="ml-4 mt-0.5 space-y-0.5 border-l-2 border-[#e8e5e0] pl-3">
                            {groupCases.map((block: any) => {
                              const completePairs = getCompletePairCount(block.images);
                              const isHidden = block.hidden;
                              const isFilteredOut = !isEditMode && isHidden;
                              return (
                                <div
                                  key={block.id}
                                  className={`group flex items-center gap-2 rounded-md px-3 py-1.5 text-xs transition-all duration-150 ${isFilteredOut ? "opacity-40 hover:opacity-60" : "hover:bg-[#f5f3f0]"}`}>
                                  <a href={`#case-${block.id}`}
                                    className="flex flex-1 items-center gap-2 min-w-0 text-[#6b6258] hover:text-[#2f3b35]"
                                  >
                                    <span className={`flex-none w-5 h-5 rounded text-[9px] font-bold flex items-center justify-center ${isHidden ? "bg-red-50 text-red-400" : "bg-[#f0eeeb] text-[#9a9186]"}`}>
                                      {isHidden ? <EyeOff className="h-2.5 w-2.5" /> : completePairs}
                                    </span>
                                    <span className={`flex-1 truncate ${isHidden ? "line-through text-[#b0a89e]" : ""}`}>
                                      {block.navLabel || block.title}
                                    </span>
                                  </a>
                                  {isEditMode && (
                                    <button
                                      type="button"
                                      onClick={(e) => { e.preventDefault(); toggleCaseHiddenById(block.id); }}
                                      className={`flex-none rounded p-0.5 transition ${isHidden ? "text-red-400 hover:bg-red-50" : "text-[#c0b8ae] opacity-0 group-hover:opacity-100 hover:bg-[#f0eeeb] hover:text-[#8c7851]"}`}>
                                        {isHidden ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
                                    </button>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        )}
                    </div>
                  );
                })}
              </nav>
              {/* Sidebar footer */}
              {!clientMode && isApiAvailable && (
                <div className="flex-none border-t border-[#e8e5e0] px-4 py-3">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setIsEditMode(false)}
                      className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg py-2 text-xs font-semibold transition ${!isEditMode ? "bg-[#2f3b35] text-white" : "bg-[#f5f3f0] text-[#6b6258] hover:bg-[#ebe8e3]"}`}>
                      <Eye className="h-3 w-3" /> 展示</button>
                    <button
                      type="button"
                      onClick={() => setIsEditMode(true)}
                      className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg py-2 text-xs font-semibold transition ${isEditMode ? "bg-[#8c7851] text-white" : "bg-[#f5f3f0] text-[#6b6258] hover:bg-[#ebe8e3]"}`}>
                      <Pencil className="h-3 w-3" /> 编辑</button>
                  </div>
                  {saveStatus !== "idle" && (
                    <div className="mt-2 text-center text-[10px] font-bold uppercase tracking-widest text-[#9a9186]">
                      {saveStatus === "saving" ? "保存中..." : saveStatus === "saved" ? "已保存" : "保存失败"}
                    </div>
                  )}
                </div>
              )}
            </div>
          </aside>

          )}

          <div className="space-y-10">
            {filteredCases.length > 0 ? (
              filteredCases.map((block) => (
                <CaseCard
                  key={block.id}
                  block={block}
                  siteConfig={siteConfig}
                  isEditMode={isEditMode}
                  shareMode={shareMode}
                  comparisonMode={comparisonMode}
                  onOpenLightbox={setLightbox}
                  onUpdateImage={updateImage}
                  onRemoveImage={removeImage}
                  onAddPair={addPair}
                />
              ))
            ) : (
              <div className="rounded-lg border border-dashed border-[#8c7851]/25 bg-white/70 px-6 py-14 text-center font-sans text-sm text-[#4a3f35]/60">
                当前筛选暂无案例
              </div>
            )}
          </div>
        </div>
      </div>
      <ImageLightbox
        preview={lightbox}
        onClose={() => setLightbox(null)}
        onShift={shiftLightbox}
      />
    </main>
  );
}
