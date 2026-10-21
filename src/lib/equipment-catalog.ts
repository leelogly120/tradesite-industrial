export type EquipmentCatalogItem = {
  id: string;
  name: string;
  shortName: string;
  description: string;
  features: string[];
  image: { src: string; width: number; height: number; alt: string; caption: string };
  referenceFamilyId?: string;
};

// Application routes are separate from the retained model-reference mapping.
export const EQUIPMENT_CATALOG: EquipmentCatalogItem[] = [
  {
    id: 'truck-mounted-roll-forming-lifts',
    name: 'Truck-Mounted Roll Forming Lifts',
    shortName: 'Truck roof-forming lifts',
    description: 'A vehicle-mounted lifting system that carries a compatible roof-panel roll former close to the installation level. The lifting arm positions the forming equipment, with the truck, stabilisers and machine layout selected together.',
    features: ['Vehicle-mounted equipment layout', 'Elevated forming-machine platform', 'Folding and telescoping lift structure', 'Optional coil-handling arrangement'],
    image: {
      src: '/images/equipment/coil-real-cover.webp', width: 680, height: 562,
      alt: 'Truck-mounted lifting equipment with a steel coil suspended beside the vehicle',
      caption: 'Truck-mounted equipment with a coil-handling arrangement.',
    },
    referenceFamilyId: 'truck-mounted-roll-forming-lifts',
  },
  {
    id: 'crawler-roll-forming-lifts',
    name: 'Crawler Roll Forming Lifts',
    shortName: 'Crawler roof-forming lifts',
    description: 'A tracked lifting system for positioning a roof-panel roll former around the worksite. The crawler base, folding lift structure and equipment platform bring the forming machine close to the planned panel output position.',
    features: ['Crawler base', 'Folding equipment structure', 'Stabiliser-supported setup', 'Low-bed transport arrangement'],
    image: {
      src: '/images/equipment/transport-real-stowed.webp', width: 637, height: 374,
      alt: 'Folded red crawler equipment in a yard with tracks and deployed stabilisers visible',
      caption: 'Crawler equipment folded with stabilisers deployed.',
    },
    referenceFamilyId: 'crawler-roll-forming-lifts',
  },
  {
    id: 'crawler-ceiling-platforms',
    name: 'Crawler Large-Deck Work Platforms',
    shortName: 'Crawler work platforms',
    description: 'A broad work deck for ceiling and wall-panel installation tasks. The deck layout, access position and crawler base are configured around the building and the required working area.',
    features: ['Broad working deck', 'Under-ceiling access', 'Workface-specific deck layout', 'Crawler-based positioning'],
    image: {
      src: '/images/equipment/entry-real-cover.webp', width: 838, height: 622,
      alt: 'Red large-deck platform positioned beneath the roof steelwork of a building',
      caption: 'Large work platform positioned beneath roof steelwork.',
    },
    referenceFamilyId: 'crawler-ceiling-platforms',
  },
  {
    id: 'truck-mounted-work-platforms',
    name: 'Truck-Mounted Work Platforms',
    shortName: 'Truck work platforms',
    description: 'An integrated truck-mounted lifting structure paired with a working deck for installation tasks. The vehicle, deck layout, stabilisers and control arrangement are specified together around the work area and travel route.',
    features: ['Integrated vehicle and lift arrangement', 'Task-specific working deck', 'Stabiliser-supported setup', 'Project-matched controls and handling options'],
    image: {
      src: '/images/equipment/entry-real-interior.webp', width: 874, height: 656,
      alt: 'Yellow working platform with people beneath a steel-frame roof',
      caption: 'Working-deck reference scene beneath a steel-frame roof.',
    },
  },
];

export const RELATED_FORMING_EQUIPMENT: EquipmentCatalogItem = {
  id: 'roll-forming-machines',
  name: 'Roll Forming Machines',
  shortName: 'Forming-machine integration',
  description: 'The forming machine defines the panel profile and the interfaces with the lift. Discuss the rollers and tooling, coil material, cutting and output arrangement, machine mass, mounting layout, power and controls as one system.',
  features: ['Profile-specific forming tooling', 'Material feed and panel output', 'Lift mounting and control interfaces'],
  image: {
    src: '/images/equipment/coil-real-module.webp', width: 607, height: 563,
    alt: 'Blue machine module suspended beside a red crawler lifting structure',
    caption: 'A machine module beside the lifting structure; shown for equipment-interface context.',
  },
  referenceFamilyId: 'roll-forming-machines',
};
