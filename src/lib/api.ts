import {
  LessonPlanData,
  QuizData,
  RubricData,
  GradingData,
  DifferentiationData,
  ParentEmailData,
  AccommodationData,
  ChatMessage
} from '../types';

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || `Server error (${res.status})`);
  }
  const json = await res.json();
  if (!json.success && json.error) {
    throw new Error(json.error);
  }
  return json.data ?? json;
}

export async function generateLessonPlan(params: {
  subject: string;
  gradeLevel: string;
  topic: string;
  duration: string;
  standards?: string;
  learningObjectives?: string;
  specialRequirements?: string;
}): Promise<LessonPlanData> {
  const res = await fetch('/api/generate-lesson-plan', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });
  return handleResponse<LessonPlanData>(res);
}

export async function generateQuiz(params: {
  topic: string;
  gradeLevel: string;
  questionTypes: string[];
  questionCount: number;
  difficulty: string;
  specialInstructions?: string;
}): Promise<QuizData> {
  const res = await fetch('/api/generate-quiz', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });
  return handleResponse<QuizData>(res);
}

export async function generateRubric(params: {
  assignmentTitle: string;
  gradeLevel?: string;
  subject?: string;
  scale?: string;
  criteriaList?: string[];
  promptDetails?: string;
}): Promise<RubricData> {
  const res = await fetch('/api/generate-rubric', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });
  return handleResponse<RubricData>(res);
}

export async function gradeAssignment(params: {
  assignmentPrompt: string;
  studentSubmission: string;
  rubricOrCriteria?: string;
  maxScore?: number;
}): Promise<GradingData> {
  const res = await fetch('/api/grade-assignment', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });
  return handleResponse<GradingData>(res);
}

export async function differentiateContent(params: {
  originalTextOrConcept: string;
  gradeLevel?: string;
  targetSubject?: string;
  additionalNeeds?: string;
}): Promise<DifferentiationData> {
  const res = await fetch('/api/differentiate-content', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });
  return handleResponse<DifferentiationData>(res);
}

export async function draftParentEmail(params: {
  studentName: string;
  parentName?: string;
  reasonCategory: string;
  keyDetails?: string;
  desiredOutcome?: string;
  tone?: string;
}): Promise<ParentEmailData> {
  const res = await fetch('/api/draft-parent-email', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });
  return handleResponse<ParentEmailData>(res);
}

export async function generateAccommodations(params: {
  studentProfile?: string;
  learningChallenge: string;
  subjectArea?: string;
  gradeLevel?: string;
}): Promise<AccommodationData> {
  const res = await fetch('/api/iep-accommodations', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });
  return handleResponse<AccommodationData>(res);
}

export async function sendChatMessage(messages: ChatMessage[], context?: any): Promise<string> {
  const res = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ messages, context }),
  });
  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.error || 'Failed to send message');
  }
  return data.reply;
}
