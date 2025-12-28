import { GoogleGenerativeAI } from "@google/generative-ai";
import type { AIFeedback, AIErrorExplanation, MultipleChoiceExercise } from '../types';

// 使用环境变量获取 API KEY
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GOOGLE_API_KEY);
const DEFAULT_MODEL = "gemini-3-flash-preview";

export async function evaluateWriting(prompt: string, studentText: string): Promise<AIFeedback | null> {
    const systemInstruction = "你是一位充满爱心的中国小学语文老师，评价学生写作。语言简单、积极、具体。请给出褒奖、改进建议和一段优美的示范。必须按JSON格式输出。";
    const userPrompt = `题目: "${prompt}"\n学生回答: "${studentText}"`;

    try {
        const model = genAI.getGenerativeModel({ 
            model: DEFAULT_MODEL,
            systemInstruction: systemInstruction
        });

        const result = await model.generateContent({
            contents: [{ role: 'user', parts: [{ text: userPrompt }] }],
            generationConfig: {
                responseMimeType: "application/json",
            }
        });
        
        return JSON.parse(result.response.text());
    } catch (error) {
        console.error('Writing evaluation failed:', error);
        return {
            praise: "写得不错！能看到你在努力表达自己的想法。",
            suggestion: "如果能多运用一些好词好句，文章会更生动。",
            example: "例如：晨曦微露，小鸟在枝头欢快地歌唱，唤醒了沉睡的森林。"
        };
    }
}

export async function explainError(prompt: string, wrong: string, correct: string): Promise<AIErrorExplanation | null> {
    const systemInstruction = "你是耐心的小学语文老师，向8岁孩子解释错题原因。语言简明草亲切，像讲故事一样。";
    const userPrompt = `原题: "${prompt}"\n学生选的错误答案: "${wrong}"\n正确答案: "${correct}"`;

    try {
        const model = genAI.getGenerativeModel({ model: DEFAULT_MODEL, systemInstruction });
        const result = await model.generateContent({
            contents: [{ role: 'user', parts: [{ text: userPrompt }] }],
            generationConfig: { responseMimeType: "application/json" }
        });
        return JSON.parse(result.response.text());
    } catch (error) {
        return { explanation: `这道题选 ${correct} 是因为它更符合语境哦。继续加油！` };
    }
}

export async function generateTargetedPractice(prompt: string, wrong: string, correct: string): Promise<Partial<MultipleChoiceExercise>[] | null> {
    const systemInstruction = "你是一名教育专家。根据学生刚才做的这道语文题，生成2道同类型的练习题（包含题目、选项、正确答案）进行针对性强化练习。按JSON格式输出。";
    const userPrompt = `学生做错的题: ${prompt}\n错误答案: ${wrong}\n正确答案: ${correct}`;

    try {
        const model = genAI.getGenerativeModel({ model: DEFAULT_MODEL, systemInstruction });
        const result = await model.generateContent({
            contents: [{ role: 'user', parts: [{ text: userPrompt }] }],
            generationConfig: { responseMimeType: "application/json" }
        });
        const parsed = JSON.parse(result.response.text());
        return parsed.newQuestions || [];
    } catch (error) {
        return null;
    }
}
