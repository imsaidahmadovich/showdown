'use server';

/**
 * @fileOverview A flow that provides increasingly detailed clues about a footballer.
 *
 * - generateSmartClue - A function that generates a clue about a footballer based on available information.
 * - SmartClueInput - The input type for the generateSmartClue function.
 * - SmartClueOutput - The return type for the generateSmartClue function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SmartClueInputSchema = z.object({
  knownStats: z
    .string()
    .describe('Known statistics about the footballer, such as weight, height, career goals, club.'),
  clueLevel: z
    .number()
    .describe('The level of clue to provide, with higher numbers indicating more detailed clues.'),
  footballerName: z
    .string()
    .describe('The name of the footballer to generate a clue for.'),
});
export type SmartClueInput = z.infer<typeof SmartClueInputSchema>;

const SmartClueOutputSchema = z.object({
  clue: z.string().describe('A clue about the footballer.'),
  isVisualClue: z
    .boolean()
    .describe('Whether the clue is visual (e.g., silhouette) or textual.'),
  visualClueDataUri: z
    .string()
    .optional()
    .describe(
      'If the clue is visual, this is the data URI of the image. Should be a data URI that must include a MIME type and use Base64 encoding. Expected format: \'data:<mimetype>;base64,<encoded_data>\'.'
    ),
});
export type SmartClueOutput = z.infer<typeof SmartClueOutputSchema>;

export async function generateSmartClue(input: SmartClueInput): Promise<SmartClueOutput> {
  return smartClueGenerationFlow(input);
}

// A dedicated prompt just for generating text clues.
const textCluePrompt = ai.definePrompt({
    name: 'textCluePrompt',
    input: { schema: z.object({ footballerName: z.string(), knownStats: z.string(), clueLevel: z.number() }) },
    output: { schema: z.string().describe("The generated clue text.") },
    prompt: `You are a football trivia expert. Generate a clue for the footballer {{{footballerName}}}.
    The current clue level is {{{clueLevel}}}.
    - Level 1: Give a vague hint about their play style or position.
    - Level 2: Give an interesting but not too obvious fact about their career.
    - Level 3: Give a more direct clue about a famous team they played for or a major award they won.
    Do not reveal the player's name in the clue. The clue should be a single, concise sentence.`
});

// A dedicated prompt just for creating an image generation prompt.
const visualClueImagePrompt = ai.definePrompt({
    name: 'visualClueImagePrompt',
    input: { schema: z.object({ footballerName: z.string() }) },
    output: { schema: z.string().describe("A detailed prompt for an image generation model.") },
    prompt: `Generate a detailed text prompt for an image generation AI. The goal is to create a minimalist, clean, artistic image of the national team football jersey of the player: {{{footballerName}}}.
    Describe the jersey's primary color, secondary colors, and any distinctive patterns. The jersey should be shown flat, as if laid on a surface. Do not include any text, names, numbers, or logos in your description.`
});


// The main flow orchestrator.
const smartClueGenerationFlow = ai.defineFlow(
  {
    name: 'smartClueGenerationFlow',
    inputSchema: SmartClueInputSchema,
    outputSchema: SmartClueOutputSchema,
  },
  async (input): Promise<SmartClueOutput> => {

    // VISUAL CLUE PATH
    if (input.clueLevel >= 4) {
      try {
        // 1. Generate the image prompt
        const { output: imagePrompt } = await visualClueImagePrompt({ footballerName: input.footballerName });

        if (!imagePrompt) {
          throw new Error("Failed to generate an image prompt.");
        }

        // 2. Generate the image itself
        const { media } = await ai.generate({
          model: 'googleai/imagen-4.0-fast-generate-001',
          prompt: imagePrompt,
        });

        // 3. If successful, return the visual clue
        if (media?.url) {
          return {
            clue: "A visual clue of this player's national team jersey.", // A static description for the visual clue
            isVisualClue: true,
            visualClueDataUri: media.url,
          };
        }
      } catch (error) {
          console.error("Visual clue generation failed, falling back to text.", error);
          // Fallback logic is handled below if image generation fails
      }
    }

    // TEXT CLUE PATH (and fallback for failed visual)
    try {
        const { output: textClue } = await textCluePrompt({
            ...input,
            // If we fell through from a failed visual attempt, force a high-level text clue
            clueLevel: input.clueLevel >= 4 ? 3 : input.clueLevel,
        });

        if (!textClue) {
          throw new Error("Failed to generate a text clue.");
        }
        return {
          clue: textClue,
          isVisualClue: false,
        };
    } catch (error) {
        console.error("Text clue generation failed.", error);
        // This is the final fallback. If this fails, the action.ts will catch it.
        // We can provide one last static fallback here to prevent that.
        return {
            clue: `This player is one of the most famous in the world and has played for ${input.knownStats.split('Club: ')[1].split(',')[0]}.`,
            isVisualClue: false
        };
    }
  }
);
