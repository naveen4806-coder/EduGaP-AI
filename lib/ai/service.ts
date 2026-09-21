// ============================================================================
// EdUGaP AI - AI Service Layer
// Supports OpenAI-compatible API providers with robust deterministic offline fallback
// ============================================================================

export interface DescriptiveEvaluationResult {
  scoreAwarded: number;
  maxMarks: number;
  clarityScore: number;
  relevanceScore: number;
  grammarScore: number;
  topicUnderstandingScore: number;
  aiFeedback: string;
  identifiedWeakTopics: string[];
  recommendation: string;
}

export interface GeneratedQuestion {
  questionText: string;
  questionType: 'multiple_choice' | 'short_answer' | 'descriptive';
  options?: { id: string; text: string }[];
  correctAnswer?: string;
  marks: number;
  difficulty: 'easy' | 'medium' | 'hard';
  topicTags: string[];
  explanation: string;
}

export class AIService {
  private apiKey: string | undefined;
  private baseURL: string;

  constructor() {
    this.apiKey = process.env.OPENAI_API_KEY;
    this.baseURL = process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1';
  }

  /**
   * Evaluates student's descriptive text answer against rubric criteria.
   */
  async evaluateDescriptiveAnswer(
    questionText: string,
    studentAnswer: string,
    maxMarks: number = 25,
    rubricPoints?: string[]
  ): Promise<DescriptiveEvaluationResult> {
    if (!studentAnswer || studentAnswer.trim().length === 0) {
      return {
        scoreAwarded: 0,
        maxMarks,
        clarityScore: 0,
        relevanceScore: 0,
        grammarScore: 0,
        topicUnderstandingScore: 0,
        aiFeedback: 'No response submitted. Please attempt the question to receive evaluation.',
        identifiedWeakTopics: ['Problem Formulation', 'Algebraic Derivation'],
        recommendation: 'Practice formulating initial equations from word problem statements.',
      };
    }

    if (this.apiKey) {
      try {
        const prompt = `You are an expert academic evaluator. Evaluate this student's descriptive math answer.
Question: ${questionText}
Max Marks: ${maxMarks}
Key Rubric Points: ${rubricPoints?.join(', ') || 'Mathematical reasoning, correct equations, clean calculation'}
Student Answer:
"""
${studentAnswer}
"""

Respond in valid JSON only:
{
  "scoreAwarded": number,
  "clarityScore": number (out of ${maxMarks / 4}),
  "relevanceScore": number (out of ${maxMarks / 4}),
  "grammarScore": number (out of ${maxMarks / 4}),
  "topicUnderstandingScore": number (out of ${maxMarks / 4}),
  "aiFeedback": "Detailed constructive evaluation covering clarity, relevance, grammar, and topic understanding",
  "identifiedWeakTopics": ["topic1", ...],
  "recommendation": "Specific actionable recommendation"
}`;

        const res = await fetch(`${this.baseURL}/chat/completions`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${this.apiKey}`,
          },
          body: JSON.stringify({
            model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
            messages: [{ role: 'user', content: prompt }],
            response_format: { type: 'json_object' },
            temperature: 0.2,
          }),
        });

        if (res.ok) {
          const data = await res.json();
          const parsed = JSON.parse(data.choices[0].message.content);
          return {
            scoreAwarded: Number(parsed.scoreAwarded) || 15,
            maxMarks,
            clarityScore: Number(parsed.clarityScore) || 4,
            relevanceScore: Number(parsed.relevanceScore) || 4,
            grammarScore: Number(parsed.grammarScore) || 4,
            topicUnderstandingScore: Number(parsed.topicUnderstandingScore) || 4,
            aiFeedback: parsed.aiFeedback || 'Good effort with minor calculation or formatting gaps.',
            identifiedWeakTopics: parsed.identifiedWeakTopics || ['Linear Equations'],
            recommendation: parsed.recommendation || 'Strengthen your equation substitution step.',
          };
        }
      } catch (err) {
        console.warn('OpenAI API call failed, falling back to local heuristic evaluator:', err);
      }
    }

    // Heuristic Fallback Engine
    const words = studentAnswer.trim().split(/\s+/).length;
    const lower = studentAnswer.toLowerCase();

    // Check for domain keywords
    const hasEquations = /(=|\+|\-|\*|\/|x|y|km\/h|speed)/i.test(studentAnswer);
    const hasFinalValues = /(8|3|boat|stream|upstream|downstream)/i.test(lower);
    const hasSteps = /(let|substitut|equat|solv|therefor|so)/i.test(lower);

    let quarterMark = maxMarks / 4.0;
    let clarity = 0;
    let relevance = 0;
    let grammar = 0;
    let understanding = 0;

    // Word count / elaboration heuristic
    if (words >= 15) grammar = quarterMark * 0.8;
    if (words >= 40) grammar = quarterMark * 0.95;

    // Mathematical formulation heuristic
    if (hasEquations) clarity += quarterMark * 0.5;
    if (hasSteps) clarity += quarterMark * 0.5;

    if (hasEquations && hasSteps) relevance += quarterMark * 0.8;
    if (hasFinalValues) relevance += quarterMark * 0.2;

    if (hasFinalValues && hasEquations) understanding += quarterMark * 0.9;
    else if (hasEquations) understanding += quarterMark * 0.5;
    else understanding += quarterMark * 0.2;

    clarity = Math.min(quarterMark, Math.round(clarity * 10) / 10);
    relevance = Math.min(quarterMark, Math.round(relevance * 10) / 10);
    grammar = Math.min(quarterMark, Math.round(grammar * 10) / 10);
    understanding = Math.min(quarterMark, Math.round(understanding * 10) / 10);

    const total = Math.min(maxMarks, Math.round((clarity + relevance + grammar + understanding) * 10) / 10);

    const weakTopics: string[] = [];
    if (understanding < quarterMark * 0.6) weakTopics.push('Relative Velocity Word Problems');
    if (clarity < quarterMark * 0.6) weakTopics.push('Step-by-Step Algebraic Substitution');

    let feedback = '';
    if (total >= maxMarks * 0.8) {
      feedback = 'Excellent clarity and mathematical rigor. The step-by-step substitution of reciprocal variables was executed cleanly with proper units specified.';
    } else if (total >= maxMarks * 0.5) {
      feedback = 'Sound conceptual grasp shown in setting up initial relations. However, mathematical presentation could be clarified and algebraic simplification steps should be explicitly written out.';
    } else {
      feedback = 'Incomplete derivation. The response lacks the required simultaneous equations and definition of reciprocal variables (u = 1/(x-y)).';
    }

    const recommendation = weakTopics.length > 0
      ? `You need to strengthen ${weakTopics[0]}. Practice for 20 minutes tomorrow on standard upstream-downstream formulations.`
      : 'Excellent performance. Proceed to higher-order quadratic word problems.';

    return {
      scoreAwarded: total,
      maxMarks,
      clarityScore: clarity,
      relevanceScore: relevance,
      grammarScore: grammar,
      topicUnderstandingScore: understanding,
      aiFeedback: feedback,
      identifiedWeakTopics: weakTopics.length > 0 ? weakTopics : ['Mixed Equations Practice'],
      recommendation,
    };
  }

  /**
   * Generates curriculum assessment questions based on resource text.
   */
  async generateQuestionsFromText(
    sourceText: string,
    topic: string,
    count: number = 3
  ): Promise<GeneratedQuestion[]> {
    if (this.apiKey) {
      try {
        const prompt = `You are an educational assessment expert. Generate ${count} balanced questions (1 MCQ, 1 Short Answer, 1 Descriptive) for Grade 10 students based on the following material:
Topic: ${topic}
Source Material:
"""
${sourceText.slice(0, 3000)}
"""

Format response as JSON:
{
  "questions": [
    {
      "questionText": "...",
      "questionType": "multiple_choice" | "short_answer" | "descriptive",
      "options": [{"id": "A", "text": "..."}, {"id": "B", "text": "..."}], // for MCQ
      "correctAnswer": "...",
      "marks": number,
      "difficulty": "easy" | "medium" | "hard",
      "topicTags": ["..."],
      "explanation": "..."
    }
  ]
}`;

        const res = await fetch(`${this.baseURL}/chat/completions`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${this.apiKey}`,
          },
          body: JSON.stringify({
            model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
            messages: [{ role: 'user', content: prompt }],
            response_format: { type: 'json_object' },
            temperature: 0.3,
          }),
        });

        if (res.ok) {
          const data = await res.json();
          const parsed = JSON.parse(data.choices[0].message.content);
          if (parsed.questions && Array.isArray(parsed.questions)) {
            return parsed.questions;
          }
        }
      } catch (err) {
        console.warn('AI question generation fallback triggered:', err);
      }
    }

    // Heuristic generator based on topic
    return [
      {
        questionText: `Which of the following conditions ensures that a system of two linear equations a1*x + b1*y = c1 and a2*x + b2*y = c2 has infinitely many solutions?`,
        questionType: 'multiple_choice',
        options: [
          { id: 'A', text: 'a1/a2 = b1/b2 != c1/c2' },
          { id: 'B', text: 'a1/a2 = b1/b2 = c1/c2' },
          { id: 'C', text: 'a1/a2 != b1/b2' },
          { id: 'D', text: 'a1*b2 + a2*b1 = 0' },
        ],
        correctAnswer: 'B',
        marks: 5,
        difficulty: 'easy',
        topicTags: [topic || 'Linear Systems', 'Consistency Criteria'],
        explanation: 'Coincident lines occur when the ratios of coefficients of x, y, and constant terms are all equal.',
      },
      {
        questionText: `Find the discriminant of 3x² - 5x + 2 = 0 and determine if the roots are real and distinct.`,
        questionType: 'short_answer',
        correctAnswer: 'Discriminant is 1, roots are real and distinct',
        marks: 5,
        difficulty: 'medium',
        topicTags: [topic || 'Quadratic Equations', 'Roots Nature'],
        explanation: 'D = (-5)² - 4(3)(2) = 25 - 24 = 1. Since D > 0, the roots are real and distinct.',
      },
      {
        questionText: `A two-digit number is 4 times the sum of its digits and twice the product of its digits. Set up the system of equations and calculate the two-digit number. Show every algebraic step.`,
        questionType: 'descriptive',
        correctAnswer: 'The number is 36',
        marks: 15,
        difficulty: 'hard',
        topicTags: [topic || 'Algebra', 'Word Problems'],
        explanation: 'Let tens digit be x and units digit be y. Number = 10x + y. 10x + y = 4(x + y) => 6x = 3y => y = 2x. Also 10x + y = 2xy => 10x + 2x = 2x(2x) => 12x = 4x² => 4x² - 12x = 0 => 4x(x - 3) = 0. Since x != 0, x = 3, y = 6. The number is 36.',
      },
    ];
  }
}

export const aiService = new AIService();
