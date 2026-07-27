export type ActiveTool =
  | 'lesson_plan'
  | 'quiz'
  | 'rubric'
  | 'grader'
  | 'differentiation'
  | 'parent_email'
  | 'accommodation'
  | 'chat'
  | 'library';

export interface VocabularyItem {
  word: string;
  definition: string;
}

export interface LessonProcedure {
  hookMinutes: string;
  hookDescription: string;
  directInstructionMinutes: string;
  directInstructionDescription: string;
  guidedPracticeMinutes: string;
  guidedPracticeDescription: string;
  independentPracticeMinutes: string;
  independentPracticeDescription: string;
  closureMinutes: string;
  closureDescription: string;
}

export interface LessonPlanData {
  id?: string;
  createdAt?: string;
  title: string;
  subject: string;
  gradeLevel: string;
  duration: string;
  summary: string;
  standards: string[];
  learningObjectives: string[];
  essentialQuestions: string[];
  materialsNeeded: string[];
  vocabularyWords: VocabularyItem[];
  procedure: LessonProcedure;
  formativeAssessment: string;
  differentiationStrategies: {
    supportForStruggling: string;
    extensionForAdvanced: string;
    ellAccommodations: string;
  };
  homeworkOrFollowUp?: string;
}

export interface QuizQuestion {
  id: number;
  type: string;
  questionText: string;
  options?: string[];
  correctAnswer: string;
  explanation: string;
  points: number;
}

export interface QuizData {
  id?: string;
  createdAt?: string;
  title: string;
  instructions: string;
  gradeLevel: string;
  topic: string;
  questions: QuizQuestion[];
}

export interface RubricDescriptor {
  levelName: string;
  score: number;
  description: string;
}

export interface RubricCategory {
  categoryName: string;
  weight: string;
  descriptors: RubricDescriptor[];
}

export interface RubricData {
  id?: string;
  createdAt?: string;
  title: string;
  assignmentDescription: string;
  gradeLevel?: string;
  scaleLevels: string[];
  criteria: RubricCategory[];
}

export interface CriterionBreakdown {
  criterion: string;
  scoreObtained: number;
  maxCriterionScore: number;
  comments: string;
}

export interface GradingData {
  id?: string;
  createdAt?: string;
  assignedScore: number;
  maxScore: number;
  percentage: number;
  overallGradeLetter: string;
  summaryAssessment: string;
  keyStrengths: string[];
  areasForImprovement: string[];
  actionableNextSteps: string[];
  criterionBreakdown: CriterionBreakdown[];
  studentFacingNote: string;
}

export interface DifferentiationTier1 {
  levelName: string;
  adaptedContent: string;
  vocabularyGlossary: string[];
  scaffoldsAndPrompts: string[];
}

export interface DifferentiationTier2 {
  levelName: string;
  adaptedContent: string;
  comprehensionQuestions: string[];
}

export interface DifferentiationTier3 {
  levelName: string;
  adaptedContent: string;
  extensionActivities: string[];
}

export interface DifferentiationELL {
  levelName: string;
  adaptedContent: string;
  sentenceFrames: string[];
  visualSupportIdeas: string[];
}

export interface DifferentiationData {
  id?: string;
  createdAt?: string;
  originalSummary: string;
  tier1Support: DifferentiationTier1;
  tier2OnLevel: DifferentiationTier2;
  tier3Enrichment: DifferentiationTier3;
  ellSupport: DifferentiationELL;
}

export interface ParentEmailData {
  id?: string;
  createdAt?: string;
  subjectLine: string;
  emailBody: string;
  followUpSuggestions: string[];
  phoneScriptBrief: string;
  studentName?: string;
}

export interface AccommodationData {
  id?: string;
  createdAt?: string;
  categoryTitle: string;
  overview: string;
  instructionalAccommodations: string[];
  environmentalModifications: string[];
  assessmentAccommodations: string[];
  behaviorAndFocusStrategies: string[];
  teacherSelfChecklist: string[];
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export interface SavedAsset {
  id: string;
  title: string;
  type: ActiveTool;
  createdAt: string;
  data: any;
}
