/**
 * 预构建脚本：扫描 docs / i18n 中的 _sidebar_scope.json 与 Front Matter，
 * 生成运行时侧边栏可见性配置到 .docusaurus/generated-sidebar-config.json。
 *
 * 注意：运行时通过 webpack alias `@generated/generated-sidebar-config.json`
 * 读取的是 .docusaurus 下的文件，不是 src/context/。
 */
const path = require('path');
const {
  getGeneratedSidebarConfigPath,
  buildAndWriteSidebarScopeConfig,
} = require('./lib/sidebar-scope-config-generator');

async function main() {
  const siteDir = path.join(__dirname, '..');
  const configFilePath = getGeneratedSidebarConfigPath(siteDir);
  const docsDir = path.join(siteDir, 'docs');
  const i18nEnDocsCurrentDir = path.join(
    siteDir,
    'i18n/en/docusaurus-plugin-content-docs/current',
  );

  await buildAndWriteSidebarScopeConfig({
    configFilePath,
    docsDir,
    i18nEnDocsCurrentDir,
    siteDir,
    verbose: true,
  });
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
