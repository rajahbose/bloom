import { NextRequest, NextResponse } from 'next/server';
import { PlantConfig } from '@/lib/types/plant';

export async function POST(req: NextRequest) {
  try {
    const { prompt, currentConfig } = await req.json();

    if (!prompt || typeof prompt !== 'string') {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }

    const apiKey = process.env.GEMINIAPI || process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json({
        fallback: true,
        message: 'GEMINIAPI environment variable not configured, using fallback parser.',
      });
    }

    const systemPrompt = `You are the AI Geometry Architect for "Bloom", a procedural CAD botanical symbol generator.
Your job is to translate natural language user descriptions into structured parameters for procedural plant generation.

Select the best "growthProfile" from:
1. "radial_rosette" (Agave, Yucca, Aloe, Succulents - rotational sword blades from anchor)
2. "excurrent_tower" (Conifers, Pines, Firs, Spruces - conical envelope along main axis)
3. "decurrent_canopy" (Maples, Oaks, Birches, Broadleaf trees - sympodial spreading branches)
4. "columnar_spire" (Italian Cypress, Lombardy Poplar, Junipers - steep high-angle branches in capsule)
5. "basal_fountain" (Ornamental Grasses, Ferns, Bamboo - arched Bezier curves from base anchor)

You must return ONLY a JSON object matching this schema:
{
  "growthProfile": "radial_rosette" | "excurrent_tower" | "decurrent_canopy" | "columnar_spire" | "basal_fountain",
  "name": "Species name",
  "description": "Short description",
  "rosetteLeafCount": number (12-70),
  "rosetteLeafLength": number (40-220),
  "rosetteCurl": number (-1 to 1),
  "rosetteLayers": number (1-5),
  "spireWidth": number (30-220),
  "spireBranchAngle": number (60-88),
  "fountainBladeCount": number (20-150),
  "fountainArchFactor": number (0.2-2.0),
  "fountainBladeLength": number (50-240),
  "fountainSeedHeadDensity": number (0-100),
  "maxDepth": number (1-7),
  "baseAngle": number (10-75),
  "angleJitter": number (0-1),
  "lengthRatio": number (0.5-0.88),
  "taperRatio": number (0.5-0.95),
  "trunkLength": number (60-250),
  "trunkThickness": number (3-35),
  "gravity": number (-1 to 1),
  "splitsPerNode": number (2 or 3),
  "foliageType": "deciduous" | "conifer" | "weeping" | "palm" | "broadleaf" | "architectural_circle" | "hatch" | "blade" | "none",
  "foliageDensity": number (0-100),
  "foliageSize": number (3-25),
  "foliageOpacity": number (0.1-1.0),
  "colorPalette": "emerald" | "maple_red" | "autumn_gold" | "blueprint" | "architectural_monochrome" | "pine_dark" | "bonsai_mint",
  "lineWeight": number (0.5-4.0),
  "explanation": "Short 1-2 sentence explanation of the botanical model choices."
}`;

    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

    const response = await fetch(geminiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            role: 'user',
            parts: [
              {
                text: `${systemPrompt}\n\nUser Request: "${prompt}"\nCurrent Plant Config ID: "${currentConfig?.id || 'default'}"`,
              },
            ],
          },
        ],
        generationConfig: {
          temperature: 0.7,
          responseMimeType: 'application/json',
        },
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error('Gemini API Error:', errText);
      return NextResponse.json({
        fallback: true,
        error: `Gemini API HTTP Error ${response.status}`,
      });
    }

    const data = await response.json();
    const candidateText = data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!candidateText) {
      return NextResponse.json({ fallback: true, error: 'Empty response from Gemini' });
    }

    const parsedConfig = JSON.parse(candidateText);

    return NextResponse.json({
      success: true,
      config: parsedConfig,
      explanation: parsedConfig.explanation || `Customized botanical symbol based on prompt: "${prompt}".`,
      source: 'gemini-2.0-flash',
    });
  } catch (error: any) {
    console.error('Error in translate API route:', error);
    return NextResponse.json(
      { fallback: true, error: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}
