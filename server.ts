import express, { Request, Response } from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";

const app = express();
app.use(express.json({ limit: "10mb" }));

const PORT = 3000;

function getGenAIClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY environment variable is missing.");
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
}

// Health Check
app.get("/api/health", (req: Request, res: Response) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// 1. Generate Lesson Plan
app.post("/api/generate-lesson-plan", async (req: Request, res: Response) => {
  try {
    const { subject, gradeLevel, topic, duration, standards, learningObjectives, specialRequirements } = req.body;

    if (!topic || !gradeLevel) {
      return res.status(400).json({ error: "Topic and Grade Level are required." });
    }

    const ai = getGenAIClient();
    const prompt = `Create a comprehensive, highly pedagogical lesson plan for:
Subject: ${subject || "General Education"}
Grade Level: ${gradeLevel}
Topic: ${topic}
Duration: ${duration || "60 minutes"}
Educational Standards (e.g. Common Core/NGSS/Custom): ${standards || "Standard Curriculum"}
Learning Objectives: ${learningObjectives || "Core subject mastery"}
Additional Context/Requirements: ${specialRequirements || "None"}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
      config: {
        systemInstruction: "You are an expert instructional designer and veteran master teacher. Create structured, actionable, engaging, and standards-aligned lesson plans.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            subject: { type: Type.STRING },
            gradeLevel: { type: Type.STRING },
            duration: { type: Type.STRING },
            summary: { type: Type.STRING },
            standards: { type: Type.ARRAY, items: { type: Type.STRING } },
            learningObjectives: { type: Type.ARRAY, items: { type: Type.STRING } },
            essentialQuestions: { type: Type.ARRAY, items: { type: Type.STRING } },
            materialsNeeded: { type: Type.ARRAY, items: { type: Type.STRING } },
            vocabularyWords: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  word: { type: Type.STRING },
                  definition: { type: Type.STRING }
                },
                required: ["word", "definition"]
              }
            },
            procedure: {
              type: Type.OBJECT,
              properties: {
                hookMinutes: { type: Type.STRING },
                hookDescription: { type: Type.STRING },
                directInstructionMinutes: { type: Type.STRING },
                directInstructionDescription: { type: Type.STRING },
                guidedPracticeMinutes: { type: Type.STRING },
                guidedPracticeDescription: { type: Type.STRING },
                independentPracticeMinutes: { type: Type.STRING },
                independentPracticeDescription: { type: Type.STRING },
                closureMinutes: { type: Type.STRING },
                closureDescription: { type: Type.STRING }
              },
              required: [
                "hookMinutes", "hookDescription",
                "directInstructionMinutes", "directInstructionDescription",
                "guidedPracticeMinutes", "guidedPracticeDescription",
                "independentPracticeMinutes", "independentPracticeDescription",
                "closureMinutes", "closureDescription"
              ]
            },
            formativeAssessment: { type: Type.STRING },
            differentiationStrategies: {
              type: Type.OBJECT,
              properties: {
                supportForStruggling: { type: Type.STRING },
                extensionForAdvanced: { type: Type.STRING },
                ellAccommodations: { type: Type.STRING }
              },
              required: ["supportForStruggling", "extensionForAdvanced", "ellAccommodations"]
            },
            homeworkOrFollowUp: { type: Type.STRING }
          },
          required: [
            "title", "subject", "gradeLevel", "duration", "summary",
            "standards", "learningObjectives", "essentialQuestions",
            "materialsNeeded", "vocabularyWords", "procedure",
            "formativeAssessment", "differentiationStrategies"
          ]
        }
      }
    });

    const resultText = response.text || "{}";
    const lessonPlan = JSON.parse(resultText);
    res.json({ success: true, data: lessonPlan });
  } catch (error: any) {
    console.error("Error generating lesson plan:", error);
    res.status(500).json({ error: error.message || "Failed to generate lesson plan." });
  }
});

// 2. Generate Quiz / Worksheet
app.post("/api/generate-quiz", async (req: Request, res: Response) => {
  try {
    const { topic, gradeLevel, questionTypes, questionCount, difficulty, specialInstructions } = req.body;

    if (!topic || !gradeLevel) {
      return res.status(400).json({ error: "Topic and Grade Level are required." });
    }

    const ai = getGenAIClient();
    const prompt = `Generate an assessment/quiz for grade level ${gradeLevel} on topic: "${topic}".
Total questions requested: ${questionCount || 5}.
Target difficulty: ${difficulty || "Medium"}.
Question types included: ${(questionTypes || ["multiple_choice", "short_answer"]).join(", ")}.
Special instructions: ${specialInstructions || "Include clear instructions and answer key with detailed explanations."}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
      config: {
        systemInstruction: "You are an assessment expert creating high-quality, clear, pedagogically sound quizzes and tests for students.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            instructions: { type: Type.STRING },
            gradeLevel: { type: Type.STRING },
            topic: { type: Type.STRING },
            questions: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.INTEGER },
                  type: { type: Type.STRING }, // multiple_choice, short_answer, true_false, essay, fill_blank
                  questionText: { type: Type.STRING },
                  options: { type: Type.ARRAY, items: { type: Type.STRING } }, // Optional for MC/TF
                  correctAnswer: { type: Type.STRING },
                  explanation: { type: Type.STRING },
                  points: { type: Type.INTEGER }
                },
                required: ["id", "type", "questionText", "correctAnswer", "explanation", "points"]
              }
            }
          },
          required: ["title", "instructions", "gradeLevel", "topic", "questions"]
        }
      }
    });

    const quiz = JSON.parse(response.text || "{}");
    res.json({ success: true, data: quiz });
  } catch (error: any) {
    console.error("Error generating quiz:", error);
    res.status(500).json({ error: error.message || "Failed to generate quiz." });
  }
});

// 3. Generate Assessment Rubric
app.post("/api/generate-rubric", async (req: Request, res: Response) => {
  try {
    const { assignmentTitle, gradeLevel, subject, scale, criteriaList, promptDetails } = req.body;

    if (!assignmentTitle) {
      return res.status(400).json({ error: "Assignment Title is required." });
    }

    const ai = getGenAIClient();
    const prompt = `Create a detailed grading rubric matrix for:
Assignment: ${assignmentTitle}
Subject: ${subject || "General Education"}
Grade Level: ${gradeLevel || "Middle School"}
Rating Scale: ${scale || "4-Point Scale (Exemplary, Proficient, Developing, Novice)"}
Specific Criteria to include: ${(criteriaList && criteriaList.length > 0) ? criteriaList.join(", ") : "Content Knowledge, Organization & Structure, Clarity & Mechanics, Critical Thinking / Originality"}
Assignment Details: ${promptDetails || "Standard class assignment"}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
      config: {
        systemInstruction: "You are an expert educational evaluator creating clear, objective, and constructive grading rubrics.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            assignmentDescription: { type: Type.STRING },
            gradeLevel: { type: Type.STRING },
            scaleLevels: { type: Type.ARRAY, items: { type: Type.STRING } },
            criteria: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  categoryName: { type: Type.STRING },
                  weight: { type: Type.STRING },
                  descriptors: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        levelName: { type: Type.STRING },
                        score: { type: Type.NUMBER },
                        description: { type: Type.STRING }
                      },
                      required: ["levelName", "score", "description"]
                    }
                  }
                },
                required: ["categoryName", "weight", "descriptors"]
              }
            }
          },
          required: ["title", "assignmentDescription", "scaleLevels", "criteria"]
        }
      }
    });

    const rubric = JSON.parse(response.text || "{}");
    res.json({ success: true, data: rubric });
  } catch (error: any) {
    console.error("Error generating rubric:", error);
    res.status(500).json({ error: error.message || "Failed to generate rubric." });
  }
});

// 4. Grade Assignment & Feedback Generator
app.post("/api/grade-assignment", async (req: Request, res: Response) => {
  try {
    const { assignmentPrompt, studentSubmission, rubricOrCriteria, maxScore } = req.body;

    if (!studentSubmission) {
      return res.status(400).json({ error: "Student submission text is required." });
    }

    const ai = getGenAIClient();
    const prompt = `Grade and provide feedback for the following student submission:

Assignment Prompt / Context:
${assignmentPrompt || "General student assignment"}

Grading Rubric / Criteria:
${rubricOrCriteria || "Standard grading based on correctness, effort, structure, and clarity."}

Max Score Possible: ${maxScore || 100}

Student Submission:
"""
${studentSubmission}
"""`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
      config: {
        systemInstruction: "You are a supportive, fair, and encouraging veteran teacher. Grade the student's submission accurately according to the criteria, highlight key strengths, identify areas for growth, and draft constructive student-facing feedback.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            assignedScore: { type: Type.NUMBER },
            maxScore: { type: Type.NUMBER },
            percentage: { type: Type.NUMBER },
            overallGradeLetter: { type: Type.STRING },
            summaryAssessment: { type: Type.STRING },
            keyStrengths: { type: Type.ARRAY, items: { type: Type.STRING } },
            areasForImprovement: { type: Type.ARRAY, items: { type: Type.STRING } },
            actionableNextSteps: { type: Type.ARRAY, items: { type: Type.STRING } },
            criterionBreakdown: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  criterion: { type: Type.STRING },
                  scoreObtained: { type: Type.NUMBER },
                  maxCriterionScore: { type: Type.NUMBER },
                  comments: { type: Type.STRING }
                },
                required: ["criterion", "scoreObtained", "maxCriterionScore", "comments"]
              }
            },
            studentFacingNote: { type: Type.STRING }
          },
          required: [
            "assignedScore", "maxScore", "percentage", "overallGradeLetter",
            "summaryAssessment", "keyStrengths", "areasForImprovement",
            "actionableNextSteps", "criterionBreakdown", "studentFacingNote"
          ]
        }
      }
    });

    const output = JSON.parse(response.text || "{}");
    res.json({ success: true, data: output });
  } catch (error: any) {
    console.error("Error grading assignment:", error);
    res.status(500).json({ error: error.message || "Failed to grade assignment." });
  }
});

// 5. Differentiate Instruction Content
app.post("/api/differentiate-content", async (req: Request, res: Response) => {
  try {
    const { originalTextOrConcept, gradeLevel, targetSubject, additionalNeeds } = req.body;

    if (!originalTextOrConcept) {
      return res.status(400).json({ error: "Original text or concept is required." });
    }

    const ai = getGenAIClient();
    const prompt = `Differentiate the following learning material/concept for Grade Level: ${gradeLevel || "General"}:

Original Content:
"""
${originalTextOrConcept}
"""

Additional Needs/Focus: ${additionalNeeds || "Standard differentiation"}

Provide 4 distinct tiered adaptations:
1. Below Grade Level / Tier 1 Support (simplified sentence structure, core vocabulary glossary, step-by-step scaffolds)
2. On Grade Level (standard grade-appropriate text with check-in questions)
3. Above Grade Level / Enrichment (advanced analytical questions, deeper inquiry extension)
4. English Language Learners (ELL / ESL) (visual cues/glossary, sentence frames, dual-language support tips)`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
      config: {
        systemInstruction: "You are an expert special education and differentiation specialist. Adapt text and lessons to ensure accessibility for all learning profiles without lowering academic rigor.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            originalSummary: { type: Type.STRING },
            tier1Support: {
              type: Type.OBJECT,
              properties: {
                levelName: { type: Type.STRING },
                adaptedContent: { type: Type.STRING },
                vocabularyGlossary: { type: Type.ARRAY, items: { type: Type.STRING } },
                scaffoldsAndPrompts: { type: Type.ARRAY, items: { type: Type.STRING } }
              },
              required: ["levelName", "adaptedContent", "vocabularyGlossary", "scaffoldsAndPrompts"]
            },
            tier2OnLevel: {
              type: Type.OBJECT,
              properties: {
                levelName: { type: Type.STRING },
                adaptedContent: { type: Type.STRING },
                comprehensionQuestions: { type: Type.ARRAY, items: { type: Type.STRING } }
              },
              required: ["levelName", "adaptedContent", "comprehensionQuestions"]
            },
            tier3Enrichment: {
              type: Type.OBJECT,
              properties: {
                levelName: { type: Type.STRING },
                adaptedContent: { type: Type.STRING },
                extensionActivities: { type: Type.ARRAY, items: { type: Type.STRING } }
              },
              required: ["levelName", "adaptedContent", "extensionActivities"]
            },
            ellSupport: {
              type: Type.OBJECT,
              properties: {
                levelName: { type: Type.STRING },
                adaptedContent: { type: Type.STRING },
                sentenceFrames: { type: Type.ARRAY, items: { type: Type.STRING } },
                visualSupportIdeas: { type: Type.ARRAY, items: { type: Type.STRING } }
              },
              required: ["levelName", "adaptedContent", "sentenceFrames", "visualSupportIdeas"]
            }
          },
          required: ["originalSummary", "tier1Support", "tier2OnLevel", "tier3Enrichment", "ellSupport"]
        }
      }
    });

    const result = JSON.parse(response.text || "{}");
    res.json({ success: true, data: result });
  } catch (error: any) {
    console.error("Error differentiating content:", error);
    res.status(500).json({ error: error.message || "Failed to differentiate content." });
  }
});

// 6. Draft Parent Communication Email
app.post("/api/draft-parent-email", async (req: Request, res: Response) => {
  try {
    const { studentName, parentName, reasonCategory, keyDetails, desiredOutcome, tone } = req.body;

    if (!studentName || !reasonCategory) {
      return res.status(400).json({ error: "Student Name and Communication Reason are required." });
    }

    const ai = getGenAIClient();
    const prompt = `Draft a professional parent communication email:
Student Name: ${studentName}
Parent/Guardian Name: ${parentName || "Parent/Guardian"}
Category/Purpose: ${reasonCategory} (e.g., Academic Praise, Missing Homework, Behavioral Issue, IEP Progress, Upcoming Field Trip)
Key Details to Mention: ${keyDetails || "No specific details specified"}
Desired Outcome/Next Steps: ${desiredOutcome || "Open communication and collaboration"}
Tone requested: ${tone || "Professional, empathetic, and collaborative"}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
      config: {
        systemInstruction: "You are an experienced educator skilled in constructive, respectful, warm, and professional school-home communication.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            subjectLine: { type: Type.STRING },
            emailBody: { type: Type.STRING },
            followUpSuggestions: { type: Type.ARRAY, items: { type: Type.STRING } },
            phoneScriptBrief: { type: Type.STRING }
          },
          required: ["subjectLine", "emailBody", "followUpSuggestions", "phoneScriptBrief"]
        }
      }
    });

    const emailData = JSON.parse(response.text || "{}");
    res.json({ success: true, data: emailData });
  } catch (error: any) {
    console.error("Error drafting email:", error);
    res.status(500).json({ error: error.message || "Failed to draft parent email." });
  }
});

// 7. Student Accommodations & Strategy Planner (IEP / 504 Support)
app.post("/api/iep-accommodations", async (req: Request, res: Response) => {
  try {
    const { studentProfile, learningChallenge, subjectArea, gradeLevel } = req.body;

    if (!learningChallenge) {
      return res.status(400).json({ error: "Learning challenge or IEP focus area is required." });
    }

    const ai = getGenAIClient();
    const prompt = `Generate evidence-based classroom accommodations and intervention strategies for:
Student Profile: ${studentProfile || "General Student"}
Grade Level: ${gradeLevel || "Middle School"}
Subject Area: ${subjectArea || "General"}
Primary Need / Diagnosis / Challenge: ${learningChallenge} (e.g. ADHD, Dyslexia, Executive Functioning, Anxiety, Hearing Impairment, Processing Speed)`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
      config: {
        systemInstruction: "You are an expert special education coordinator and behavior intervention specialist.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            categoryTitle: { type: Type.STRING },
            overview: { type: Type.STRING },
            instructionalAccommodations: { type: Type.ARRAY, items: { type: Type.STRING } },
            environmentalModifications: { type: Type.ARRAY, items: { type: Type.STRING } },
            assessmentAccommodations: { type: Type.ARRAY, items: { type: Type.STRING } },
            behaviorAndFocusStrategies: { type: Type.ARRAY, items: { type: Type.STRING } },
            teacherSelfChecklist: { type: Type.ARRAY, items: { type: Type.STRING } }
          },
          required: [
            "categoryTitle", "overview", "instructionalAccommodations",
            "environmentalModifications", "assessmentAccommodations",
            "behaviorAndFocusStrategies", "teacherSelfChecklist"
          ]
        }
      }
    });

    const output = JSON.parse(response.text || "{}");
    res.json({ success: true, data: output });
  } catch (error: any) {
    console.error("Error generating accommodations:", error);
    res.status(500).json({ error: error.message || "Failed to generate accommodations." });
  }
});

// 8. General AI Co-Pilot Chat
app.post("/api/chat", async (req: Request, res: Response) => {
  try {
    const { messages, context } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: "Messages array is required." });
    }

    const ai = getGenAIClient();
    
    // Format conversation history
    const formattedContents = messages.map((m: any) => ({
      role: m.role === "user" ? "user" : "model",
      parts: [{ text: m.content }]
    }));

    const systemInstruction = `You are "Teacher Co-Pilot", an enthusiastic, deeply knowledgeable, and supportive AI Teacher Assistant built to save educators hours of planning and administrative time.
Provide structured, highly practical, pedagogical advice. Use Markdown formatting with bolding, bullet points, headers, and clean code or exercise blocks when appropriate.
${context ? `Current Context: ${JSON.stringify(context)}` : ""}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: formattedContents,
      config: {
        systemInstruction
      }
    });

    res.json({ success: true, reply: response.text });
  } catch (error: any) {
    console.error("Error in AI chat:", error);
    res.status(500).json({ error: error.message || "Failed to generate AI chat response." });
  }
});

// Setup Vite development server or production static serving
async function setupServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`AI Teacher Assistant server running at http://0.0.0.0:${PORT}`);
  });
}

setupServer();
