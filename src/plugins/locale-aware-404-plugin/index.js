const fs = require('fs');
const path = require('path');

const MARKER = 'data-locale-aware-404';

/**
 * 静态托管（GitHub Pages、nginx try_files、docusaurus serve）只会使用站点根目录的
 * 404.html，因此英文（/en/xxx）等非默认语言的未命中请求会拿到中文 404 页面。
 *
 * Docusaurus 按语言逐个构建（默认语言先构建，非默认语言输出到 <outDir>/<locale>），
 * 所以这里在非默认语言构建完成后，往站点根 404.html 的 <head> 最前面注入一段脚本：
 * 请求路径命中该语言前缀时跳转到该语言自己的 404 页面（如 /rdk_x_doc/en/404.html），
 * 保证提示文案与页面语言一致。
 *
 * @type {import('@docusaurus/types').PluginModule}
 */
function localeAware404Plugin() {
  return {
    name: 'locale-aware-404-plugin',

    async postBuild({ outDir, i18n, siteConfig }) {
      const currentLocale = i18n?.currentLocale;
      const defaultLocale = i18n?.defaultLocale;
      if (!currentLocale || currentLocale === defaultLocale) {
        return;
      }

      // 该语言构建时 siteConfig.baseUrl 已带语言前缀（如 /rdk_x_doc/en/）。
      const localeBaseUrl = siteConfig?.baseUrl;
      const localePath =
        i18n.localeConfigs?.[currentLocale]?.path || currentLocale;
      const localeSegments = String(localePath).split('/').filter(Boolean);
      if (!localeBaseUrl || localeSegments.length === 0) {
        return;
      }

      // 单语言构建（--locale en）不会把输出放进 <outDir>/<locale>，此时 404 本身
      // 已经是目标语言，无需处理。
      const outDirSegments = outDir.split(/[\\/]/).filter(Boolean);
      if (outDirSegments.length < localeSegments.length) {
        return;
      }
      const outDirTail = outDirSegments.slice(-localeSegments.length);
      if (!localeSegments.every((segment, index) => outDirTail[index] === segment)) {
        return;
      }

      const siteOutDir = path.resolve(
        outDir,
        ...localeSegments.map(() => '..'),
      );
      const root404Path = path.join(siteOutDir, '404.html');
      const locale404Path = path.join(outDir, '404.html');

      if (!fs.existsSync(root404Path) || !fs.existsSync(locale404Path)) {
        return;
      }

      let html = fs.readFileSync(root404Path, 'utf8');
      const marker = `${MARKER}="${currentLocale}"`;
      if (html.includes(marker)) {
        return;
      }

      const script =
        `<script ${marker}>` +
        '(function(){' +
        `var path=window.location.pathname;var base=${JSON.stringify(localeBaseUrl)};` +
        'var target=base+"404.html";' +
        'if(path===base.replace(/\\/$/,"")||path.indexOf(base)===0){' +
        'if(path!==target){window.location.replace(target);}' +
        '}' +
        '})();' +
        '</script>';

      const headTagMatch = html.match(/<head(\s[^>]*)?>/i);
      if (!headTagMatch) {
        return;
      }

      html = html.replace(headTagMatch[0], `${headTagMatch[0]}${script}`);
      fs.writeFileSync(root404Path, html, 'utf8');
    },
  };
}

module.exports = localeAware404Plugin;
