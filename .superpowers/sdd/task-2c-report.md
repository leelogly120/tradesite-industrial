# Task 2c 审查修复报告

- 日期：2026-07-25
- 范围：公开身份与来源防回归、案例匿名化、案例死链、404 SEO、图片证据分类
- 分支：`codex/task-2c`
- 基线：`68f747e`
- 推送：未推送

## TDD 证据

1. 基线 `npm run test:content`：85/85 通过。
2. 先新增回归测试并运行 `npx vitest run tests/brand-identity.test.mjs`：19 项中 8 项按预期失败，覆盖具名身份、客户/地点/署名、产品图片分类、T12/T25 跨型号重复、20 个 `/solutions/` 死链、博客目录和 404 canonical。
3. 实施最小修复后，定向测试 19/19 通过。
4. 最终 `npm run test:content`：88/88 通过。

## 实施结果

- `tests/brand-identity.test.mjs` 递归扫描 `src/pages`、`src/layouts`、`src/components`、产品、案例和博客公开文本源。
- 防回归覆盖 ARCLIFT 工厂/制造商身份声明、具名客户/项目/人员、私有路径、原始相机文件名和 Manifest 私有来源键。
- 20 个带身份字段的案例统一使用匿名项目描述、`location: "Undisclosed"` 和 `Archived project note` 署名；另外两处通用角色署名也改为相同限定。
- 20 个不存在的 `/solutions/.../` 链接按产品族改到真实 `/products/` 锚点；新增静态内部链接目标校验。
- 404 使用 `canonical={false}`；实际构建的 `dist/404.html` 有 `noindex,nofollow`，无 canonical、hreflang 和 `og:url`。
- Manifest 中 15 个产品记录全部由 `evidence` 降为 `editorial`；Hero/Banner 保持 `editorial`。
- 新增 SHA-256 跨 slug 重复检测。T12 与 T25 首图哈希相同：`DB36CF021C0A7F6D1F1518305CD34A54EA7F3818300C2F51DB5FA398781E7303`，因此不能作为型号证据。
- 创建 `src/content/blog/.gitkeep`，未添加文章或占位文章。
- 私有 Evidence Ledger 已在仓库和 public 之外同步降级理由、重复哈希和重新升级为 evidence 的条件。

## 最终验证

- `npm run test:content`：88/88 通过。
- `npm run build`：成功，51 个页面。
- 身份/来源 `rg` 扫描：0 命中。
- `/solutions/` `rg` 扫描：0 命中。
- `git diff --check`：通过。
- Contact 写集扫描：未修改 `InquiryForm`、`contact`、worker 或 Contact Playwright 测试。

## 已知非阻塞项

Astro 构建仍提示博客 collection 为空。目录已存在但没有 Markdown；这是五篇正式文章写入前的预期状态，没有用假文章消除警告。
