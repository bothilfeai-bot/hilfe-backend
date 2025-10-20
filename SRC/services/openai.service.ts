import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export class OpenAIService {
  static async chatCompletion(messages: any[], maxTokens: number = 1000) {
    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-4-turbo-preview",
        messages: messages,
        max_tokens: maxTokens,
        stream: true,
      });

      return completion;
    } catch (error) {
      console.error('OpenAI API Error:', error);
      throw new Error('Erreur lors de la génération de la réponse IA');
    }
  }

  static async shouldRedirectToExternalTool(message: string): Promise<boolean> {
    // Logique simple pour déterminer si redirection nécessaire
    const redirectKeywords = [
      'je ne sais pas', 'je ne peux pas', 'désolé', 'sorry',
      'je ne suis pas capable', 'je ne suis pas sûr', 'incapable'
    ];

    const lowerMessage = message.toLowerCase();
    return redirectKeywords.some(keyword => lowerMessage.includes(keyword));
  }

  static async getExternalToolUrl(): Promise<string> {
    return process.env.EXTERNAL_TOOL_URL || 'https://chat.openai.com';
  }
}
