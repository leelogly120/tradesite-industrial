type JsonLd = Record<string, unknown>;

const manufacturer = {
  '@type': 'Organization',
  name: 'ARCLIFT Equipment Co., Ltd.',
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Xinxiang',
    addressRegion: 'Henan',
    addressCountry: 'CN',
  },
};

const brand = { '@type': 'Brand', name: 'ARCLIFT' };

function property(name: string, value: string) {
  return { '@type': 'PropertyValue', name, value };
}

function product(entry: {
  slug: string;
  name: string;
  model: string;
  description: string;
  image: string;
  category: string;
  properties: { name: string; value: string }[];
}): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: entry.name,
    model: entry.model,
    sku: entry.model,
    description: entry.description,
    brand,
    manufacturer,
    image: [`https://www.arclifteq.com${entry.image}`],
    url: `https://www.arclifteq.com/products/${entry.slug}/`,
    category: entry.category,
    additionalProperty: entry.properties.map(item => property(item.name, item.value)),
  };
}

const CATALOG_PRODUCT_JSONLD: Record<string, JsonLd> = {
  'arc-t18-truck-mounted-roll-forming-lift': product({
    slug: 'arc-t18-truck-mounted-roll-forming-lift',
    name: 'ARC-T18 Vehicle-Mounted Roof Panel Roll Former Lift',
    model: 'ARC-T18',
    description: 'Truck-mounted lift platform that raises a compatible roof-panel or standing-seam roll former toward roof level. Catalog height class 18.5m. Platform load, transport size, and chassis inclusion confirmed on RFQ.',
    image: '/images/editorial/truck-site-roll-forming-lift.webp',
    category: 'Roof panel roll former lift platform',
    properties: [
      { name: 'Height class (catalog reference)', value: '18.5m' },
      { name: 'Platform load', value: 'Confirm on RFQ' },
      { name: 'Transport size', value: 'Confirm on RFQ' },
      { name: 'Chassis included', value: 'Confirm on RFQ' },
      { name: 'Base type', value: 'Truck-mounted' },
    ],
  }),
  'arc-t25-truck-mounted-roll-forming-lift': product({
    slug: 'arc-t25-truck-mounted-roll-forming-lift',
    name: 'ARC-T25 Vehicle-Mounted Roof Panel Roll Former Lift',
    model: 'ARC-T25',
    description: 'Truck-mounted roof panel roll former lift platform. Catalog height class 25m. Load, transport, and chassis confirmed on RFQ.',
    image: '/images/editorial/truck-site-roll-forming-lift.webp',
    category: 'Roof panel roll former lift platform',
    properties: [
      { name: 'Height class (catalog reference)', value: '25m' },
      { name: 'Platform load', value: 'Confirm on RFQ' },
      { name: 'Transport size', value: 'Confirm on RFQ' },
      { name: 'Chassis included', value: 'Confirm on RFQ' },
      { name: 'Base type', value: 'Truck-mounted' },
    ],
  }),
  'arc-c25-crawler-roll-forming-lift': product({
    slug: 'arc-c25-crawler-roll-forming-lift',
    name: 'ARC-C25 Crawler Roof Panel Roll Former Lift Platform',
    model: 'ARC-C25',
    description: 'Crawler-mounted lift for positioning a roof-panel roll former on site. Catalog height class 25m. Low-bed transport and loads confirmed on RFQ.',
    image: '/images/hero/hero-2.webp',
    category: 'Crawler roof panel roll former lift',
    properties: [
      { name: 'Height class (catalog reference)', value: '25m' },
      { name: 'Platform load', value: 'Confirm on RFQ' },
      { name: 'Transport size', value: 'Confirm on RFQ' },
      { name: 'Chassis included', value: 'Confirm on RFQ' },
      { name: 'Base type', value: 'Crawler' },
    ],
  }),
  'arc-f25-crawler-ceiling-platform': product({
    slug: 'arc-f25-crawler-ceiling-platform',
    name: 'ARC-F25 Crawler Large-Deck Ceiling Work Platform',
    model: 'ARC-F25',
    description: 'Crawler large-deck platform for under-ceiling and wall-panel installation. Catalog height class 25m. Deck load and entry route confirmed on RFQ.',
    image: '/images/editorial/large-deck-steel-structure.webp',
    category: 'Crawler large-deck work platform',
    properties: [
      { name: 'Height class (catalog reference)', value: '25m' },
      { name: 'Deck / platform load', value: 'Confirm on RFQ' },
      { name: 'Transport size', value: 'Confirm on RFQ' },
      { name: 'Chassis included', value: 'Confirm on RFQ' },
      { name: 'Base type', value: 'Crawler large-deck' },
    ],
  }),
  'arc-rf8-roll-forming-machine': product({
    slug: 'arc-rf8-roll-forming-machine',
    name: 'ARC-RF8 Roof Panel / Standing Seam Roll Forming Line',
    model: 'ARC-RF8',
    description: 'Roll forming line for roof panels and standing-seam profiles. Sheet class 0.3–1.0mm catalog reference. Spec with matching ARCLIFT lift platform; mass and power confirmed on RFQ.',
    image: '/images/editorial/roll-forming-input-map.svg',
    category: 'Roof panel roll forming machine',
    properties: [
      { name: 'Sheet thickness class (catalog reference)', value: '0.3–1.0mm' },
      { name: 'Machine mass / mounting', value: 'Confirm on RFQ' },
      { name: 'Transport size', value: 'Confirm on RFQ' },
      { name: 'Chassis included', value: 'N/A — machine module; see lift models' },
      { name: 'Base type', value: 'Roll forming line' },
    ],
  }),
};

export function catalogProductJsonLd(slug: string): JsonLd | undefined {
  return CATALOG_PRODUCT_JSONLD[slug.replace(/\.md$/, '')];
}
