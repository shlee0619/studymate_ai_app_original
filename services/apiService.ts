
import type { Item, SearchHit } from '../types';

const MOCK_DELAY = 1000;

export async function generateItems(baseUrl: string, rawText: string, k: number): Promise<Omit<Item, 'ef' | 'intervalDays' | 'reps' | 'nextReview'>[]> {
  // Mock implementation
  console.log(`Generating ${k} items from text at ${baseUrl}...`);
  await new Promise(res => setTimeout(res, MOCK_DELAY));
  
  if (rawText.includes("fail")) {
    throw new Error("Mock API Error: Generation failed.");
  }
  
  const concepts = [
    { text: "Photosynthesis", stem: "What is the primary purpose of photosynthesis?", options: ["To produce oxygen", "To convert light energy into chemical energy", "To consume water", "To create CO2"], answer: 1, difficulty: 0.2 },
    { text: "equation", stem: "Which is the correct chemical equation for photosynthesis?", options: ["6O2 + C6H12O6 → 6CO2 + 6H2O", "6CO2 + 6H2O → C6H12O6 + 6O2", "H2O + CO2 → O2", "C6H12O6 → O2 + H2O"], answer: 1, difficulty: 0.5 },
    { text: "stages", stem: "Where do the light-dependent reactions of photosynthesis occur?", options: ["Stroma", "Cytoplasm", "Thylakoid membranes", "Mitochondria"], answer: 2, difficulty: 0.8 },
    { text: "Calvin cycle", stem: "What is another name for the light-independent reactions?", options: ["Krebs cycle", "Glycolysis", "Electron Transport Chain", "Calvin cycle"], answer: 3, difficulty: 0.4 },
    { text: "ATP and NADPH", stem: "What are the energy-carrying molecules produced during light-dependent reactions?", options: ["ATP and NADPH", "Glucose and Oxygen", "CO2 and Water", "ADP and NADP+"], answer: 0, difficulty: 0.7 }
  ];

  const generated: Omit<Item, 'ef' | 'intervalDays' | 'reps' | 'nextReview'>[] = [];
  for (let i = 0; i < k; i++) {
    const concept = concepts[i % concepts.length];
    generated.push({
      id: `item_${Date.now()}_${i}`,
      stem: concept.stem,
      options: concept.options,
      answerIndex: concept.answer,
      difficulty: concept.difficulty,
      sourceRef: `doc_${Date.now()}`
    });
  }
  return generated;
}

export async function ingestChunks(baseUrl: string, docId: string, chunks: string[]): Promise<{ count: number }> {
  // Mock implementation
  console.log(`Ingesting ${chunks.length} chunks for doc ${docId} at ${baseUrl}...`);
  await new Promise(res => setTimeout(res, MOCK_DELAY));
  if (docId.includes("fail")) {
    throw new Error("Mock API Error: Ingestion failed.");
  }
  return { count: chunks.length };
}

export async function searchEvidence(baseUrl: string, query: string, topK: number): Promise<{ hits: SearchHit[] }> {
  // Mock implementation
  console.log(`Searching for "${query}" with topK=${topK} at ${baseUrl}...`);
  await new Promise(res => setTimeout(res, MOCK_DELAY / 2));
  if (query.toLowerCase().includes("fail")) {
    throw new Error("Mock API Error: Search failed.");
  }
  const hits: SearchHit[] = [
    { snippet: `...**Photosynthesis is a process used by plants**... to convert light energy into chemical energy...`, sourceUri: `doc_${Date.now()}` }
  ];
  return { hits };
}
