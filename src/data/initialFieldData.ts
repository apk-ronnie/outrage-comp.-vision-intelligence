import { FieldPlant, FieldStatistics } from '../types/agrilens';

const rows = ['A', 'B', 'C', 'D'];
const rowSpacing = 4.2;
const colSpacing = 2.8;

export function generateInitialFieldPlants(): FieldPlant[] {
  const plants: FieldPlant[] = [];

  for (let r = 0; r < 4; r++) {
    const rowLetter = rows[r];
    for (let c = 0; c < 8; c++) {
      const colNum = c + 1;
      const id = `PLT-${rowLetter}${colNum < 10 ? '0' : ''}${colNum}`;

      // Center the grid in 3D coordinate space
      const x = (c - 3.5) * colSpacing;
      const z = (r - 1.5) * rowSpacing;

      let healthCategory: FieldPlant['healthCategory'] = 'healthy';
      let linkedDiagnosisId: string | null = null;
      let notes = 'Foliage inspected during morning scouting. Normal turgor.';
      let moisturePercent = 68 + Math.floor(Math.sin(r + c) * 12);

      // Distribute realistic agronomic scenarios across the field:
      if (id === 'PLT-B03') {
        healthCategory = 'suspected';
        linkedDiagnosisId = 'demo_case_01';
        notes = 'Lower foliage showing concentric target spots. Early Blight suspected.';
        moisturePercent = 74;
      } else if (id === 'PLT-C06') {
        healthCategory = 'suspected';
        linkedDiagnosisId = 'demo_case_02';
        notes = 'Spindle lesions with grey centers noted on leaf midrib.';
        moisturePercent = 82;
      } else if (id === 'PLT-D02') {
        healthCategory = 'priority';
        linkedDiagnosisId = 'demo_case_03';
        notes = 'Rapid water-soaked dark blotch observed. Urgent containment recommended.';
        moisturePercent = 88;
      } else if (id === 'PLT-A05') {
        healthCategory = 'observation';
        linkedDiagnosisId = 'demo_case_04';
        notes = 'Upward leaf curling and vein thickening observed. Whitefly vector check needed.';
        moisturePercent = 65;
      } else if (id === 'PLT-A01') {
        healthCategory = 'healthy';
        linkedDiagnosisId = 'demo_case_05';
        notes = 'Healthy control specimen. Vigorous vegetative growth.';
        moisturePercent = 71;
      } else if (id === 'PLT-B04' || id === 'PLT-B02') {
        healthCategory = 'observation';
        notes = 'Adjacent to suspected patch B03. Monitored for secondary spore transmission.';
        moisturePercent = 72;
      } else if (id === 'PLT-D03') {
        healthCategory = 'observation';
        notes = 'Adjacent to patch D02. Preventive biological barrier applied.';
        moisturePercent = 84;
      }

      plants.push({
        id,
        row: r,
        col: c,
        x,
        z,
        cropType: r < 2 ? 'Tomato (Solanum lycopersicum)' : 'Field Crops (Rotational Bed)',
        variety: r < 2 ? 'Pusa Ruby Hybrid' : 'Swarna Improved',
        healthCategory,
        moisturePercent,
        plantedDate: '2026-09-12',
        lastInspected: '2026-10-30',
        linkedDiagnosisId,
        notes,
      });
    }
  }

  return plants;
}

export function calculateFieldStatistics(plants: FieldPlant[]): FieldStatistics {
  let healthy = 0;
  let observation = 0;
  let suspected = 0;
  let priority = 0;
  let analysed = 0;

  plants.forEach((p) => {
    if (p.healthCategory === 'healthy') healthy++;
    else if (p.healthCategory === 'observation') observation++;
    else if (p.healthCategory === 'suspected') suspected++;
    else if (p.healthCategory === 'priority') priority++;

    if (p.linkedDiagnosisId) analysed++;
  });

  return {
    totalPlants: plants.length,
    healthyCount: healthy,
    observationCount: observation,
    suspectedCount: suspected,
    priorityCount: priority,
    analysedCount: analysed,
    lastObservationDate: 'Oct 30, 2026',
  };
}
