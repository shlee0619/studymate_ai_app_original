import type { AiFeedback, Attempt, Item } from "../types";

interface AiTutorRequest {
  baseUrl: string;
  item: Item;
  attempt: Attempt;
  selectedOption: number;
  errorTagIds: string[];
}

const buildFallbackFeedback = (item: Item, selectedOption: number): AiFeedback => {
  const correctAnswer = item.options[item.answerIndex];
  const chosen = item.options[selectedOption];
  return {
    explanation: `The correct answer is "${correctAnswer}". Compare it with your choice "${chosen}" and focus on how the question cues the required concept.`,
    focusConcepts: [item.stem.slice(0, 40).trim(), correctAnswer],
    suggestedResources: [
      "Review your notes for this concept",
      "Summarize the core idea in your own words",
    ],
    followUpPrompt: "Try to restate the concept without looking at the options.",
    createdAt: new Date().toISOString(),
  };
};

export const fetchAiFeedback = async ({
  baseUrl,
  item,
  attempt,
  selectedOption,
  errorTagIds,
}: AiTutorRequest): Promise<AiFeedback> => {
  if (!baseUrl) {
    return buildFallbackFeedback(item, selectedOption);
  }

  try {
    const response = await fetch(`${baseUrl.replace(/\/$/, "")}/ai/explain`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        item,
        attempt: {
          id: attempt.id,
          correct: attempt.correct,
          confidence: attempt.confidence,
          latencyMs: attempt.latencyMs,
          errorTagIds,
          createdAt: attempt.createdAt,
        },
        selectedOption,
      }),
    });

    if (!response.ok) {
      throw new Error(`AI tutor request failed with status ${response.status}`);
    }

    const payload = await response.json();
    const explanation: string = payload.explanation ?? payload.message ?? "";
    const focusConcepts: string[] = Array.isArray(payload.focusConcepts)
      ? payload.focusConcepts
      : [item.stem];
    const suggestedResources: string[] = Array.isArray(payload.suggestedResources)
      ? payload.suggestedResources
      : ["Revisit the source material linked to this item"];

    if (!explanation) {
      return buildFallbackFeedback(item, selectedOption);
    }

    return {
      explanation,
      focusConcepts,
      suggestedResources,
      followUpPrompt: payload.followUpPrompt,
      createdAt: new Date().toISOString(),
    };
  } catch (error) {
    console.warn("AI feedback generation failed:", error);
    return buildFallbackFeedback(item, selectedOption);
  }
};
