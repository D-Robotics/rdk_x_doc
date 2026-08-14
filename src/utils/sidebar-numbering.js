/**
 * 解析类似 "1.5 显示屏使用" / "1. 快速开始" 的标签。
 */
export function parseNumberedLabel(label) {
  if (typeof label !== 'string') return null;
  const trimmed = label.trim();
  const match = trimmed.match(/^(\d+(?:\.\d+)*)(?:\s*[.。．、-]\s*|\s+)(.+)$/);
  if (!match) return null;
  return {
    prefix: match[1],
    rest: match[2].trim(),
  };
}

/**
 * 去掉标题中的数字前缀。
 */
export function stripNumberPrefix(label) {
  const parsed = parseNumberedLabel(label);
  return parsed ? parsed.rest : label;
}

/**
 * 根据当前可见侧边栏项重排章节编号，避免过滤后出现断号（如 1.4 -> 1.6）。
 * 仅修改 label 显示，不影响文档路径与 docId。
 */
export function renumberVisibleItems(items, parentPrefix = '') {
  if (!Array.isArray(items)) return items;
  let serial = 0;

  return items.map((item) => {
    const next = { ...item };
    const parsed = parseNumberedLabel(item.label);

    let ownPrefix = parentPrefix;
    if (parsed) {
      serial += 1;
      ownPrefix = parentPrefix ? `${parentPrefix}.${serial}` : `${serial}`;
      next.label = `${ownPrefix} ${parsed.rest}`;
    }

    if (item.type === 'category' && Array.isArray(item.items)) {
      const childPrefix = parsed ? ownPrefix : parentPrefix;
      next.items = renumberVisibleItems(item.items, childPrefix);
    }

    return next;
  });
}

function normalizePermalink(path) {
  if (!path) return '';
  return String(path)
    .split('#')[0]
    .split('?')[0]
    .replace(/^https?:\/\/[^/]+/i, '')
    .replace(/\/+$/, '')
    .toLowerCase();
}

function normalizePermalinkTail(path) {
  const normalized = normalizePermalink(path);
  if (!normalized) return '';
  return normalized.replace(/^\/rdk_x_doc\//, '/').replace(/^\/en\//, '/');
}

function permalinkEquals(a, b) {
  if (!a || !b) return false;
  return (
    normalizePermalink(a) === normalizePermalink(b) ||
    normalizePermalinkTail(a) === normalizePermalinkTail(b)
  );
}

/**
 * 从（已重排编号的）侧边栏中获取当前文档显示编号。
 * 同时支持普通 link 文档，以及 category 通过 link.type=doc 挂载的入口文档。
 */
export function findDocDisplayNumber(items, targetDocId, targetPermalink) {
  if (!Array.isArray(items) || (!targetDocId && !targetPermalink)) return null;

  for (const item of items) {
    if (item.type === 'link' && targetDocId && item.docId === targetDocId) {
      const parsed = parseNumberedLabel(item.label);
      return parsed?.prefix ?? null;
    }

    if (item.type === 'category') {
      const categoryMatchesDoc =
        (targetDocId && item.docId === targetDocId) ||
        permalinkEquals(item.href, targetPermalink);

      // 当前页就是该 category 的入口文档时，直接使用 category 标签上的编号
      if (categoryMatchesDoc) {
        const parsed = parseNumberedLabel(item.label);
        return parsed?.prefix ?? null;
      }

      if (Array.isArray(item.items)) {
        const found = findDocDisplayNumber(
          item.items,
          targetDocId,
          targetPermalink,
        );
        if (found) return found;
      }
    }
  }
  return null;
}

function shouldFlattenParentWithSingleChild(parent, child) {
  if (!parent || !child) return false;
  if (parent.type !== 'category') return false;

  const p = parseNumberedLabel(parent.label);
  const c = parseNumberedLabel(child.label);
  if (!p || !c) return false;

  // 仅在明显是父子编号关系时扁平化，如 1.2 -> 1.2.1
  return c.prefix.startsWith(`${p.prefix}.`);
}

/**
 * 扁平化“只剩一个可见子项”的中间目录：
 * 例如过滤后 1.2 下只剩 1.2.1，则侧栏不展示 1.2，直接展示该子项。
 */
export function flattenSingleChildCategories(items) {
  if (!Array.isArray(items)) return items;
  const result = [];

  for (const item of items) {
    if (item.type === 'category' && Array.isArray(item.items)) {
      const flattenedChildren = flattenSingleChildCategories(item.items);
      if (flattenedChildren.length === 0) {
        continue;
      }

      const next = { ...item, items: flattenedChildren };
      if (flattenedChildren.length === 1) {
        const onlyChild = flattenedChildren[0];
        if (shouldFlattenParentWithSingleChild(next, onlyChild)) {
          result.push(onlyChild);
          continue;
        }
      }
      result.push(next);
      continue;
    }
    result.push(item);
  }

  return result;
}
