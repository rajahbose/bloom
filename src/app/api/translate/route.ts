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

    const systemPrompt = `You are the Lead Botanical CAD Geometry Architect & Creative Director for "Bloom", a state-of-the-art procedural botanical symbol generator for architects and landscape designers.

Your goal is to translate natural language user prompts into rich, expressive, highly realistic procedural botanical definitions.

You have access to 5 Core Growth Profiles:
1. "radial_rosette": Agaves, Yuccas, Aloes, Succulents (rotational sword blades with 3D bevels and terminal spines).
2. "excurrent_tower": Conifers, Pines, Spruces, Firs, Redwoods (monopodial central axis with tiered whorled boughs within a conical envelope).
3. "decurrent_canopy": Broadleaf trees, Oaks, Maples, Birches, Bonsai, Weeping Willows, Cherries, Jacarandas (sympodial spreading limbs, root buttress flare, bark fissures, canopy foliage masses).
4. "columnar_spire": Italian Cypress, Lombardy Poplar, Columnar Junipers (dense interlocking vertical boughs in a narrow capsule envelope).
5. "basal_fountain": Ornamental Grasses, Palms (Canary Island Date Palm), Ferns, Bamboo (graceful arched Bezier blades, variegated midribs, plumose seed plumes).

You can also choose from 4 Render Techniques:
- "botanical_vector": Rich layered multi-tone vector graphic with organic shading and 3D leaf depth.
- "architectural_ink": Professional hand-drafted elevation ink with stipple and cross-hatching.
- "blueprint": Precision cyan CAD technical vector drafting.
- "watercolor_wash": Soft translucent watercolor foliage wash over crisp architectural contour lines.

Return ONLY a JSON object matching this schema:
{
  "growthProfile": "radial_rosette" | "excurrent_tower" | "decurrent_canopy" | "columnar_spire" | "basal_fountain",
  "renderTechnique": "botanical_vector" | "architectural_ink" | "blueprint" | "watercolor_wash",
  "name": "Botanical and Common species name (e.g. Japanese Maple (Acer palmatum))",
  "description": "Botanical morphology summary",
  
  "trunkLength": number (60 to 260),
  "trunkThickness": number (3 to 45),
  "rootFlare": number (0.0 to 1.5 - ground root buttress flare spread),
  "barkFissures": number (0.0 to 1.0 - density of longitudinal bark fissure lines),
  "windDrift": number (-1.0 to 1.0 - natural wind sway lean),
  "asymmetry": number (0.0 to 1.0 - biological irregularity),

  "maxDepth": number (1 to 7 - recursion depth for canopy/tower),
  "baseAngle": number (10 to 75 - branching spread angle in degrees),
  "angleJitter": number (0.0 to 1.0),
  "lengthRatio": number (0.5 to 0.88),
  "taperRatio": number (0.5 to 0.95),
  "gravity": number (-1.0 to 1.0 - negative for weeping droop, positive for upright),
  "splitsPerNode": number (2 or 3),

  "rosetteLeafCount": number (12 to 70),
  "rosetteLeafLength": number (40 to 220),
  "rosetteCurl": number (-1.0 to 1.0),
  "rosetteLayers": number (1 to 5),

  "spireWidth": number (20 to 180),
  "spireBranchAngle": number (60 to 88),

  "fountainBladeCount": number (20 to 150),
  "fountainArchFactor": number (0.2 to 2.0),
  "fountainBladeLength": number (50 to 240),
  "fountainSeedHeadDensity": number (0 to 100),

  "foliageType": "deciduous" | "conifer" | "weeping" | "palm" | "broadleaf" | "architectural_circle" | "hatch" | "blade" | "blossom" | "none",
  "foliageDensity": number (0 to 100),
  "foliageSize": number (3 to 28),
  "foliageOpacity": number (0.1 to 1.0),
  "blossomDensity": number (0 to 100 - flowering blossom density),
  "blossomColor": string (hex color like "#f472b6" for Sakura or "#ffffff" for Magnolia),
  
  "colorPalette": "emerald" | "maple_red" | "autumn_gold" | "cherry_blossom" | "blueprint" | "architectural_monochrome" | "pine_dark" | "bonsai_mint",
  "lineWeight": number (0.5 to 4.0),
  "explanation": "Engaging 1-2 sentence explanation of the botanical morphology decisions."
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
                text: `${systemPrompt}\n\nUser Request: "${prompt}"\nCurrent Botanical Specimen: "${currentConfig?.name || 'Default'}"`,
              },
            ],
          },
        ],
        generationConfig: {
          temperature: 0.75,
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
      explanation: parsedConfig.explanation || `Crafted custom botanical model for "${prompt}".`,
      source: 'Gemini 2.0 Botanical Architect',
    });
  } catch (error: any) {
    console.error('Error in translate API route:', error);
    return NextResponse.json(
      { fallback: true, error: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}
