'use server';

import {
  generateSmartClue,
  type SmartClueInput,
  type SmartClueOutput,
} from '@/ai/flows/smart-clue-generation';

export async function getSmartClueAction(
  input: SmartClueInput
): Promise<SmartClueOutput> {
  // In a real app, you would add validation, authentication, and error handling here.
  try {
    const output = await generateSmartClue(input);
    return output;
  } catch (error) {
    console.error('Error generating smart clue:', error);
    // Return a structured error to the client
    return {
      clue: 'Sorry, I couldn\'t think of a clue right now. Please try again.',
      isVisualClue: false,
    };
  }
}
