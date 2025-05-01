// Use Genkit Flow instead of direct API route for better structure
// This file will be deprecated and functionality moved to a flow.
// For now, updating to use ai.generate and correct input structure.

import { NextRequest, NextResponse } from 'next/server';
import { ai } from '@/ai/ai-instance'; // Import the pre-configured Genkit instance
import { z } from 'zod';

// Define input schema for validation
const InputSchema = z.object({
  productName: z.string().min(1, "Product name is required."),
  features: z.array(z.string().min(1)).min(1, "At least one feature is required."),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Validate input using Zod
    const validationResult = InputSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json({ error: validationResult.error.errors.map(e => e.message).join(', ') }, { status: 400 });
    }

    const { productName, features } = validationResult.data;

    // Construct a more detailed prompt for better results
    const prompt = `Generate an engaging and concise product description for a product named "${productName}".
Highlight the following key features:
${features.map(f => `- ${f}`).join('\n')}

Keep the description under 150 words. Focus on benefits over just listing features.`;

    // Use the configured Genkit AI instance
    const { text, finishReason, usage } = await ai.generate({
      // Using the default model configured in ai-instance.ts (gemini-2.0-flash)
      prompt: prompt,
      config: {
        maxOutputTokens: 200, // Limit the output length slightly more
        temperature: 0.7, // Add a bit of creativity
      },
      // Optional: Add safety settings if needed
      // safetySettings: [{ category: HarmCategory.HARASSMENT, threshold: BlockThreshold.MEDIUM_AND_ABOVE }]
    });

     // Log usage and finish reason for debugging/monitoring
     console.log("Genkit Usage:", usage);
     console.log("Genkit Finish Reason:", finishReason);

    if (finishReason !== 'stop') {
        // Handle cases where generation didn't complete successfully (e.g., safety blocked)
         let errorMessage = 'Failed to generate description due to an unexpected issue.';
         if (finishReason === 'safety') {
           errorMessage = 'Generation stopped due to safety settings.';
         } else if (finishReason === 'length') {
           errorMessage = 'Generation stopped because the maximum length was reached.';
         }
         console.error('Description generation incomplete:', finishReason);
         return NextResponse.json({ error: errorMessage }, { status: 500 });
    }


    const description = text; // Access text directly with Genkit 1.x

    if (!description) {
      // This case might be less likely with ai.generate unless finishReason indicates an issue
      return NextResponse.json({ error: 'Failed to generate description (empty response).' }, { status: 500 });
    }

    return NextResponse.json({ description });

  } catch (error) {
    console.error('Error in /api/generate-description:', error);
    // Provide a specific error message if the API key is likely missing/invalid
    let errorMessage = 'Internal server error during description generation.';
    if (error instanceof Error) {
        console.error("Detailed Error:", error.message);
        // Check if the error message suggests an API key issue
        if (/API key/i.test(error.message)) {
            errorMessage = 'Invalid or missing Google Generative AI API Key. Please check server configuration (GOOGLE_GENAI_API_KEY).';
        } else if (error.message.includes('fetch failed')) {
             errorMessage = 'Network error communicating with the AI service. Please check connectivity.';
        }
        // Add more specific checks if needed based on potential errors
    }
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
