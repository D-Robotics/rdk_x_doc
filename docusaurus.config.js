// @ts-check
// `@type` JSDoc annotations allow editor autocompletion and type checking
// (when paired with `@ts-check`).
// There are various equivalent ways to declare your Docusaurus config.
// See: https://docusaurus.io/docs/api/docusaurus-config
import "dotenv/config";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { themes as prismThemes } from "prism-react-renderer";

import remarkDirective from "remark-directive";
import remarkDocScope from "./src/remark/remark-doc-scope.js";


const buildProduct = process.env.DOC_BUILD_PRODUCT?.trim() || "";
const buildVersion = process.env.DOC_BUILD_VERSION?.trim() || "";
const COPYRIGHT_START_YEAR = 2024;
const currentYear = new Date().getFullYear();
const copyrightYearLabel =
  currentYear > COPYRIGHT_START_YEAR
    ? `${COPYRIGHT_START_YEAR}-${currentYear}`
    : `${COPYRIGHT_START_YEAR}`;

const isEnglishBuild = process.env.DOCUSAURUS_CURRENT_LOCALE === "en";
const localePrefix = isEnglishBuild ? "/en" : "";

// 目录索引页的默认 URL 由中文 label slug 化而来（如 /category/37-配件使用说明）。
// Docusaurus 不支持按语言覆盖 _category_.json，这里在英文构建时用英文 label
// 重新生成 slug，保证英文站 URL 中不出现中文；中文构建的逻辑保持原样。
/** @returns {Record<string, string>} */
function loadEnglishCategoryLabels() {
  try {
    const translationsPath = fileURLToPath(
      new URL(
        "./i18n/en/docusaurus-plugin-content-docs/current.json",
        import.meta.url,
      ),
    );
    const messages = JSON.parse(readFileSync(translationsPath, "utf8"));
    const labels = /** @type {Record<string, string>} */ ({});
    for (const [key, value] of Object.entries(messages)) {
      const match = key.match(/^sidebar\.[^.]+\.category\.(.+)$/);
      if (!match || match[1].includes(".link.") || !value?.message) {
        continue;
      }
      labels[match[1]] = value.message;
    }
    return labels;
  } catch {
    return /** @type {Record<string, string>} */ ({});
  }
}

/** @type {Record<string, string>} */
const englishCategoryLabels = isEnglishBuild
  ? loadEnglishCategoryLabels()
  : {};

/** @param {string} label */
function slugifyLabel(label) {
  return String(label)
    .trim()
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s-]/gu, "")
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * @param {any[]} items
 * @returns {any[]}
 */
function applyEnglishCategorySlugs(items) {
  return items.map((item) => {
    if (item.type !== "category") {
      return item;
    }
    const nextItems = Array.isArray(item.items)
      ? applyEnglishCategorySlugs(item.items)
      : item.items;
    const englishLabel = englishCategoryLabels[item.label];
    if (
      englishLabel &&
      item.link?.type === "generated-index" &&
      !item.link.slug
    ) {
      const slug = slugifyLabel(englishLabel);
      if (slug) {
        return {
          ...item,
          link: { ...item.link, slug: `/category/${slug}` },
          items: nextItems,
        };
      }
    }
    return nextItems === item.items ? item : { ...item, items: nextItems };
  });
}

/** @type {import('@docusaurus/types').Config} */
const config = {
  title:
    process.env.DOCUSAURUS_CURRENT_LOCALE === "en"
      ? "RDK X3/X5 User Manual"
      : "RDK X3/X5 用户手册",
  // tagline: 'Dinosaurs are cool',
  favicon: "img/logo.png",
  // Set the production url of your site here
  // url: "https://developer.d-robotics.cc",
  url: "https://developer.d-robotics.cc",
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: "/rdk_x_doc/",
  customFields: {
    docBuildScope:
      buildProduct && buildVersion
        ? {
            enabled: true,
            product: buildProduct,
            version: buildVersion,
          }
        : {
            enabled: false,
          },

          feedbackFloat: {
            enabled: true,
                questionnaireUrl: "https://horizonrobotics.feishu.cn/share/base/form/shrcnLQ9OfYQO03cebdkNfOmkCh",
                questionnaireUrlByLocale: {
                  "zh-Hans": "https://horizonrobotics.feishu.cn/share/base/form/shrcnLQ9OfYQO03cebdkNfOmkCh",
                  en: "https://horizonrobotics.feishu.cn/share/base/form/shrcnrLwiznJOrzZkV75fYD92He",
            },
            // 站点内路径规则（基于 baseUrl 之后的路径）：
            // - "/" 精确匹配中文首页
            // - "/en" 精确匹配英文首页
            // - "/*" 匹配全部页面
            // - "/en/*" 匹配英文全部页面
            showOnPathRules: ["/*"],
            hideOnPathRules: [],
          },
  },

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: "D-Robotics", // Usually your GitHub org/user name.
  projectName: "rdk_x_doc", // Usually your repo name.

  // onBrokenLinks: 'throw',

  //add by xgs for build reduce bug
  onBrokenLinks: "warn", // 临时启用以检查失效链接（检查后改回 ignore）
  onBrokenMarkdownLinks: "warn",

  //add vy xgs for analysis
  scripts: [
    {
      src: "https://hm.baidu.com/hm.js?24dd63cad43b63889ea6bede5fd1ab9e",
      async: true,
    },
    // Dify Chatbot Configuration
    {
      src: "/rdk_x_doc/js/dify-config.js",
    },
    {
      src: `/rdk_x_doc${localePrefix}/js/umami-events.js`,
      defer: true,
    },
    {
      src: "https://rdk.d-robotics.cc/embed.min.js",
      id: "rJYrxmxmjOkjEx2c",
      defer: true,
    },
  ],
  headTags: [
    {
      tagName: "meta",
      attributes: {
        name: "algolia-site-verification",
        content: "7D2FA77E12885A7C",
      },
    },
    {
      tagName: "script",
      attributes: {
        defer: "defer",
        src: "https://cloud.umami.is/script.js",
        "data-website-id": "b0c771b8-947e-4fa4-8880-606ecab89c36",
      },
    },
  ],

  // add by xgs for translate
  i18n: {
    defaultLocale: "zh-Hans",
    locales: ["zh-Hans", "en"],
    localeConfigs: {
      en: {
        label: "EN",
        htmlLang: "en",
      },
      "zh-Hans": {
        label: "CN",
        htmlLang: "zh-Hans",
      },
    },
  },

  presets: [
    [
      "classic",
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          path: process.env.DOCS_OVERRIDE_DIR || "docs",
          routeBasePath: "/", // 修改默认文档路径
          sidebarPath: "./sidebars.js",
          showLastUpdateTime: true,
          remarkPlugins: [remarkDirective, remarkDocScope],
          sidebarItemsGenerator: async (generatorArgs) => {
            const { defaultSidebarItemsGenerator, ...args } =
              /** @type {any} */ (generatorArgs);
            const items = await defaultSidebarItemsGenerator({
              defaultSidebarItemsGenerator,
              ...args,
            });
            return isEnglishBuild ? applyEnglishCategorySlugs(items) : items;
          },
        },
        blog: { showReadingTime: true },
        pages: { exclude: ["/imager/**", "**/dl/**"] },
        theme: { customCss: "./src/css/custom.css" },
        sitemap: { lastmod: "date" },
      }),
    ],
  ],
  plugins:  [
    require.resolve("./src/plugins/sidebar-scope-config-plugin"),
    require.resolve("./src/plugins/locale-aware-404-plugin"),
    "docusaurus-plugin-image-zoom",
    [
      "docusaurus-plugin-copy-page-button",
      {
        // Match the requested dropdown actions in screenshot.
        enabledActions: ["copy", "view", "claude"],
        // Static .md routes are incompatible with OSS "append /index.html" rules.
        generateMarkdownRoutes: false,
      },
    ],
    [
      "@docusaurus/plugin-client-redirects",
      {
        // 烧录手册从 install_os/<product> 迁到 system-burn 后，旧 URL 兜底重定向。
        // from/to 都是 baseUrl（/rdk_x_doc/）之后的相对路径。i18n 下每个 locale 单独
        // build，plugin 用各自 baseUrl（zh=/rdk_x_doc/、en=/rdk_x_doc/en/）拼 from/to，
        // 故一份配置自动落 zh/en 两处，勿手写 /en/ 前缀。
        // 旧 URL 分三类：
        // - 目录索引页（_category_.json 显式 slug=/install_os/<product>）
        // - 正文页（数字前缀剥离后 /Quick_start/install_os/<product>/<file>）
        // - 02 文件名历史上由 nand_flash_firmware 改名为 burn，两个旧 URL 都兜底。
        redirects: [
          // 目录索引页
          { from: "/install_os/rdk_x5", to: "/Quick_start/system-burn/overview" },
          { from: "/install_os/rdk_x5_module", to: "/Quick_start/system-burn/overview" },
          // RDK X5 正文页
          { from: "/Quick_start/install_os/rdk_x5/system_burn", to: "/Quick_start/system-burn/burn-sd-card" },
          { from: "/Quick_start/install_os/rdk_x5/nand_flash_firmware", to: "/Quick_start/system-burn/upgrade-miniboot" },
          { from: "/Quick_start/install_os/rdk_x5/burn", to: "/Quick_start/system-burn/upgrade-miniboot" },
          { from: "/Quick_start/install_os/rdk_x5/boot_system", to: "/Quick_start/system-burn/burn-sd-card" },
          { from: "/Quick_start/install_os/rdk_x5/FAQ", to: "/Quick_start/system-burn/faq" },
          // RDK X5 Module 正文页
          { from: "/Quick_start/install_os/rdk_x5_module/system_burn", to: "/Quick_start/system-burn/burn-sd-card" },
          { from: "/Quick_start/install_os/rdk_x5_module/nand_flash_firmware", to: "/Quick_start/system-burn/upgrade-miniboot" },
          { from: "/Quick_start/install_os/rdk_x5_module/burn", to: "/Quick_start/system-burn/upgrade-miniboot" },
          { from: "/Quick_start/install_os/rdk_x5_module/boot_system", to: "/Quick_start/system-burn/burn-sd-card" },
          { from: "/Quick_start/install_os/rdk_x5_module/FAQ", to: "/Quick_start/system-burn/faq" },
          // 英文目录索引页 slug 改为英文后，旧的中文 slug URL 兜底（仅英文构建）。
          ...(isEnglishBuild
            ? [
                { from: "/category/37-配件使用说明", to: "/category/37-accessory-instructions" },
                { from: "/category/371-配件使用说明", to: "/category/371-accessory-instructions" },
              ]
            : []),
          // Bing 大小写 404（小写→大写），2026-09-20
          { from: "/rdk", to: "/RDK" },
          { from: "/10_release_note", to: "/10_Release_Note" },
          // GSC 404 尾巴（2026-10）：.md 源文件 URL，301 到正确页面
          { from: "/03_Basic_Application/03_40pin_user_guide/40pin_define.md", to: "/Basic_Application/01_40pin_user_sample/40pin_define" },
          { from: "/Quick_start/09_RDK_Studio/04_flashing.md", to: "/Quick_start/rdk_studio" },
          { from: "/05_Robot_development/03_boxs/spatial/stereo_imu_cam.md", to: "https://developer.d-robotics.cc/tros_doc/en/boxs/spatial/stereo_imu_cam" },
          // GSC 404 尾巴（2026-10）：版本号写成点号，实际页面用下划线
          { from: "/Advanced_development/toolchain_development/rdk_x5/oe_toolchain_v1.2.8", to: "/Advanced_development/toolchain_development/rdk_x5/oe_toolchain_v1_2_8" },
          { from: "/Advanced_development/toolchain_development/rdk_x3/oe_toolchain_v2.6.6", to: "/Advanced_development/toolchain_development/rdk_x3/oe_toolchain_v2_6_6" },
        ],
      },
    ],
  ],
  markdown: {
    mermaid: true,
  },
  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      // Replace with your project's social card
      image: "img/docusaurus-social-card.jpg",
      zoom: {
        selector: ".markdown img",
        background: {
          light: "rgba(255, 255, 255, 0.95)",
          dark: "rgba(50, 50, 50, 0.95)",
        },
        config: {
          margin: 24,
          scrollOffset: 80,
        },
      },
      // ✅ 新增：支持 h2 ~ h5 add by xgs for table of contents
    tableOfContents: {
      minHeadingLevel: 2,
      maxHeadingLevel: 5,
    },
      navbar: {
        title: "D-Robotics",
        logo: {
          alt: "地瓜 logo",
          src: "img/logo.png",
          href: "https://d-robotics.cc/", // 修改为文档根路径
        },
        items: [
          {
            type: 'custom-DocScopeSelectors',
            position: 'left',
          },

          {
            href:
              process.env.DOCUSAURUS_CURRENT_LOCALE === "en"
                ? "https://developer.d-robotics.cc/en"
                : "https://developer.d-robotics.cc/",
            label: "Community",
            position: "left",
          },

          {
            href: "https://github.com/D-Robotics",
            label: "GitHub",
            position: "right",
            className: "navbar-github-link",
          },
          // add by xgs for translate show
          {
            type: "localeDropdown",
            position: "right",
            className: "navbar-locale-switch",
          },
        ],
      },
      footer: {
        style: "dark",
        links: [
          {
            title: "友情链接",
            items: [
              {
                label: "古月居",
                href: "https://www.guyuehome.com/",
              },
            ],
          },
          {
            title: "联系我们",
            items: [
              {
                label: "GitHub",
                href: "https://github.com/D-Robotics",
              },
              {
                label: "Bilibili",
                href: (() => {
                  if (process.env.DOCUSAURUS_CURRENT_LOCALE === "en") {
                    return "https://www.youtube.com/@D-Robotics";
                  }
                  return "https://space.bilibili.com/437998606";
                })(),
              },
            ],
          },
        ],
        copyright: `Copyright © ${copyrightYearLabel} D-Robotics.`,
      },
      prism: {
        theme: prismThemes.github,
        darkTheme: prismThemes.dracula,
      },
      algolia: {
        appId: process.env.ALGOLIA_APP_ID || "1VU781LYTV",
        apiKey: process.env.ALGOLIA_SEARCH_API_KEY || "fb65c6e54a52ce6fba0645bd2630e79b",
        indexName: process.env.ALGOLIA_INDEX_NAME || "rdk_x_doc",
        contextualSearch: true,
        searchPagePath: "search",
      },
    }),
  themes: ["@docusaurus/theme-mermaid"],
};

export default config;
