# AI 图片处理案例展示页

这是一个可本地编辑、可静态发布的 AI 图片处理前后对比案例页。

本地运行时支持上传图片、编辑案例、保存到 `data.json`。部署到 GitHub Pages 时会自动切换为只读展示模式，读取静态 `data.json` 和 `public/uploads` 图片。

## 本地编辑

```bash
npm install
npm run dev
```

默认地址：

```text
http://localhost:3000
```

本地编辑会使用 Express 接口：

- `/api/data` 读取根目录 `data.json`
- `/api/save` 保存案例内容
- `/api/upload-base64` 上传图片到 `public/uploads`

## 上线前检查

```bash
npm run check:deploy
```

这个命令会检查：

- 案例数量
- 图片槽位完成度
- 可分享案例数量
- 隐藏案例数量
- 缺图、失效图片、0 B 图片、大图文件

如果想删除 0 B 上传文件，先 dry run：

```bash
npm run clean:uploads
```

确认无误后再手动执行：

```bash
node scripts/clean-zero-uploads.mjs --apply
```

## 构建 GitHub Pages 静态版本

```bash
npm run build:static
```

这个命令会：

1. 把根目录 `data.json` 同步到 `public/data.json`
2. 设置静态展示模式
3. 运行 Vite 构建
4. 输出到 `dist`

静态模式下不会显示编辑、上传、保存入口。

## 网站标题和分享信息

上线标题、SEO 描述、社交分享信息写在 `index.html`。

品牌资源在 `public` 目录：

- `favicon.svg`
- `favicon-32x32.png`
- `apple-touch-icon.png`
- `og-cover.png`
- `site.webmanifest`

如果后续想换分享封面图，替换 `public/og-cover.png` 即可，建议保持 `1200x630`。

## GitHub Pages 自动部署

项目已经包含 GitHub Actions：

```text
.github/workflows/deploy.yml
```

推送到 `main` 或 `master` 后会自动：

1. 安装依赖
2. 运行上线检查
3. 构建静态站点
4. 发布 `dist` 到 GitHub Pages

在 GitHub 仓库中设置：

1. 打开仓库 `Settings`
2. 进入 `Pages`
3. `Build and deployment` 选择 `GitHub Actions`
4. 推送代码到 `main` 或 `master`

如果仓库名是 `my-gallery`，GitHub Pages 地址通常是：

```text
https://你的用户名.github.io/my-gallery/
```

构建时会自动把资源路径设置为 `/<仓库名>/`。

## 常用命令

```bash
npm run lint
npm run build
npm run build:static
npm run check:deploy
```

`npm run build` 用于本地/服务器版本，包含 Express 生产入口。

`npm run build:static` 用于 GitHub Pages。
