/**
 * DocSearch / Docusaurus v2+ v3 compatible index settings.
 * Plus custom facets for this site's product × firmware-version scope.
 */
const DOCSEARCH_INDEX_SETTINGS = {
  searchableAttributes: [
    'unordered(hierarchy.lvl0)',
    'unordered(hierarchy.lvl1)',
    'unordered(hierarchy.lvl2)',
    'unordered(hierarchy.lvl3)',
    'unordered(hierarchy.lvl4)',
    'unordered(hierarchy.lvl5)',
    'unordered(hierarchy.lvl6)',
    'content',
  ],
  attributesForFaceting: [
    'type',
    'lang',
    'language',
    'version',
    'docusaurus_tag',
    'filterOnly(product)',
    'filterOnly(doc_version)',
    'filterOnly(doc_scope)',
  ],
  attributesToRetrieve: [
    'hierarchy',
    'content',
    'anchor',
    'url',
    'url_without_anchor',
    'type',
    'product',
    'doc_version',
    'doc_scope',
  ],
  attributesToHighlight: ['hierarchy', 'content'],
  attributesToSnippet: ['content:10'],
  camelCaseAttributes: ['hierarchy', 'content'],
  distinct: true,
  attributeForDistinct: 'url',
  customRanking: [
    'desc(weight.pageRank)',
    'desc(weight.level)',
    'asc(weight.position)',
  ],
  ranking: [
    'words',
    'filters',
    'typo',
    'attribute',
    'proximity',
    'exact',
    'custom',
  ],
  highlightPreTag: '<span class="algolia-docsearch-suggestion--highlight">',
  highlightPostTag: '</span>',
  minWordSizefor1Typo: 3,
  minWordSizefor2Typos: 7,
  allowTyposOnNumericTokens: false,
  minProximity: 1,
  ignorePlurals: true,
  advancedSyntax: true,
  attributeCriteriaComputedByMinProximity: true,
  removeWordsIfNoResults: 'allOptional',
  separatorsToIndex: '_',
};

module.exports = {DOCSEARCH_INDEX_SETTINGS};
