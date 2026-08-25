// @ts-check
// `@type` JSDoc annotations allow editor autocompletion and type checking
// (when paired with `@ts-check`).
// There are various equivalent ways to declare your Docusaurus config.
// See: https://docusaurus.io/docs/api/docusaurus-config
import "dotenv/config";
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

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: "RDK X3/X5 DOC",
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
          alt: "地瓜机器人社区 logo",
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
                label: "BiLiBiLi",
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
        appId: "1VU781LYTV",
        apiKey: "fb65c6e54a52ce6fba0645bd2630e79b",
        indexName: "rdk_x_doc",
        contextualSearch: true,
        searchPagePath: "search",
      },
    }),
  themes: ["@docusaurus/theme-mermaid"],
};

export default config;
