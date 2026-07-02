const { GoogleGenAI } = require("@google/genai");

const verifyWasteImage = async (imageBase64) => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        {
          role: "user",
          parts: [
            {
              inlineData: {
                data: imageBase64,
                mimeType: "image/jpeg",
              },
            },
            {
              text: `Analyze this image and determine if it contains garbage, waste, or a dump site.
Return a JSON object with the following structure:
{
  "isGarbage": boolean,
  "confidence": number (from 0 to 100),
  "message": "A short validation message",
  "detectedItems": ["item1", "item2"]
}
Only return the JSON object, nothing else.`,
            },
          ],
        },
      ],
      config: {
        responseMimeType: "application/json",
      },
    });

    const resultText = response.text || "";
    if (!resultText) {
      throw new Error("No response from AI");
    }

    const jsonMatch = resultText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("Invalid AI response format");
    }

    return JSON.parse(jsonMatch[0]);
  } catch (error) {
    console.error("AI Validation Error:", error);
    throw new Error("Failed to validate image with AI");
  }
};

module.exports = { verifyWasteImage };
