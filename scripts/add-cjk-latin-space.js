/**
 * 在中文 Markdown 正文中，为中文与英文/数字相邻处补空格。
 * 跳过：front matter、围栏代码块、行内代码、URL、Markdown 链接目标、HTML/JSX 标签、
 * ::: 指令属性块等固定内容。
 *
 * Usage:
 *   node scripts/add-cjk-latin-space.js           # write
 *   node scripts/add-cjk-latin-space.js --dry-run # report only
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..', 'docs');
const DRY = process.argv.includes('--dry-run');
const PLACEHOLDER_PREFIX = '\uE000PROT';
const PLACEHOLDER_SUFFIX = '\uE001';

function walkMdFiles(dir, out = []) {
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, ent.name);
    if (ent.isDirectory()) walkMdFiles(p, out);
    else if (ent.isFile() && ent.name.endsWith('.md')) out.push(p);
  }
  return out;
}

function addCjkLatinSpaces(text) {
  // CJK ↔ Latin/digit（含常见全角兼容区）
  const cjk = '\\u3400-\\u9FFF\\uF900-\\uFAFF';
  let s = text;
  s = s.replace(new RegExp(`([${cjk}])([A-Za-z0-9])`, 'g'), '$1 $2');
  s = s.replace(new RegExp(`([A-Za-z0-9])([${cjk}])`, 'g'), '$1 $2');
  return s;
}

function processMarkdown(content) {
  const bags = [];
  const protect = (match) => {
    const id = bags.length;
    bags.push(match);
    return `${PLACEHOLDER_PREFIX}${id}${PLACEHOLDER_SUFFIX}`;
  };

  let s = content;

  // YAML front matter
  s = s.replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n/, protect);

  // Fenced code blocks
  s = s.replace(/```[\s\S]*?```/g, protect);
  s = s.replace(/~~~[\s\S]*?~~~/g, protect);

  // Inline code
  s = s.replace(/`[^`\n]+`/g, protect);

  // HTML comments
  s = s.replace(/<!--[\s\S]*?-->/g, protect);

  // HTML / JSX tags first（整标签含 href，避免与 URL 占位嵌套）
  s = s.replace(/<\/?[A-Za-z][^>\n]*>/g, protect);

  // Autolink <http...> / <mailto...>
  s = s.replace(/<(?:https?:\/\/|mailto:)[^>\s]+>/g, protect);

  // :::directive{attrs} — protect attribute object
  s = s.replace(/\{[^{}\n]*\}/g, protect);

  // Markdown link/image destinations: ](url) and ][ref]
  s = s.replace(/\]\([^)]*\)/g, protect);
  s = s.replace(/\]\[[^\]]*\]/g, protect);

  // Reference-style definitions: [id]: url
  s = s.replace(/^\s*\[[^\]]+\]:\s*\S+.*$/gm, protect);

  // Remaining raw URLs in prose
  s = s.replace(/https?:\/\/[^\s<>)"'\]]+/g, protect);
  s = s.replace(/ftp:\/\/[^\s<>)"'\]]+/g, protect);

  s = addCjkLatinSpaces(s);

  // 逆序还原，防止嵌套占位残留
  for (let i = bags.length - 1; i >= 0; i -= 1) {
    const token = `${PLACEHOLDER_PREFIX}${i}${PLACEHOLDER_SUFFIX}`;
    s = s.split(token).join(bags[i]);
  }

  return s;
}

function main() {
  const files = walkMdFiles(ROOT);
  let changedFiles = 0;
  let totalDiffChars = 0;
  let leftover = 0;
  const samples = [];

  for (const file of files) {
    const before = fs.readFileSync(file, 'utf8');
    const after = processMarkdown(before);
    if (after.includes(PLACEHOLDER_PREFIX)) {
      leftover += 1;
      console.error('leftover placeholder:', file);
    }
    if (after === before) continue;
    changedFiles += 1;
    totalDiffChars += Math.abs(after.length - before.length);
    if (samples.length < 8) {
      samples.push(path.relative(path.join(__dirname, '..'), file));
    }
    if (!DRY) {
      fs.writeFileSync(file, after, 'utf8');
    }
  }

  console.log(
    `${DRY ? '[dry-run] ' : ''}files scanned: ${files.length}, would/changed: ${changedFiles}, size delta chars: ${totalDiffChars}, leftover: ${leftover}`,
  );
  if (samples.length) {
    console.log('examples:', samples.join(', '));
  }

  // spot-check download.md URL + spacing
  const dl = path.join(ROOT, '01_Quick_start', 'download.md');
  const src = DRY ? processMarkdown(fs.readFileSync(dl, 'utf8')) : fs.readFileSync(dl, 'utf8');
  const url =
    'https://archive.d-robotics.cc/downloads/sdk/LNX6.1.83_PL5.1_V1.1.2/board_support_package/platform_source_code.tar.gz';
  console.log('spot-check url intact:', src.includes(url));
  console.log('spot-check spaced text:', src.includes('SDK 源码包') && src.includes('基于 Buildroot'));
}

main();
