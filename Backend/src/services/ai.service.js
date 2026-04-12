const { GoogleGenAI, Behavior } = require("@google/genai");
const { z } = require("zod");
const { zodToJsonSchema } = require("zod-to-json-schema");
const { sanitizeReport, isEmptyReport } = require("./ai.sanitizer.js");
const puppeteer = require("puppeteer");

const ai = new GoogleGenAI({
  apiKey: process.env.Google_GenAI_API_KEY,
});

const interviewReportSchema = z.object({
  title: z
    .string()
    .describe(
      "The title of the job for which the interview report is generated",
    ),
  matchScore: z
    .number()
    .min(0)
    .max(100)
    .describe(
      "A score between 0 and 100 indicating how well the candidate's profile matches the job description",
    ),
  technicalQuestions: z
    .array(
      z.object({
        question: z
          .string()
          .describe("The technical qestions can be asked in the interview"),
        intention: z
          .string()
          .describe("The intention of interviewer behind asking the question"),
        answer: z
          .string()
          .describe(
            "How to answer this question, what points to cover, what approach to take, etc",
          ),
      }),
    )
    .max(10)
    .describe(
      "Technical questions that can be asked in the interview along with their intention and how",
    ),

  behavioralQuestions: z
    .array(
      z.object({
        question: z
          .string()
          .describe("The technical qestions can be asked in the interview"),
        intention: z
          .string()
          .describe("The intention of interviewer behind asking the question"),
        answer: z
          .string()
          .describe(
            "How to answer this question, what points to cover, what approach to take, etc",
          ),
      }),
    )
    .max(10)
    .describe(
      "Behavioral questions that can be asked in the interview along with their intention and how",
    ),

  skillGaps: z
    .array(
      z.object({
        skill: z.string().describe("The skill which candidate is lacking"),
        severity: z
          .enum(["low", "medium", "high"])
          .describe(
            "The severity of this skill gap, i.e. how important is this skill for the job applying",
          ),
      }),
    )
    .max(30)
    .describe(
      "List of skill gaps in the candidate's profile along with their severity",
    ),

  preparationPlan: z
    .array(
      z.object({
        day: z
          .number()
          .describe("The day number in the preparation plan, starting from 1"),
        focus: z
          .string()
          .describe(
            "The main focus of this day in the preparation plan, e.g. data structures, system design, mock interview, etc",
          ),
        tasks: z
          .array(z.string())
          .describe(
            "List of tasks to be done on this day to follow the preparation plan, e.g. read a specific book or practice the specific problem",
          ),
      }),
    )
    .describe(
      "A day-wise preparation plan for the candidate to follow in order to prepare for the interview effectively",
    ),
});

async function generateInterviewReport({
  resume,
  selfDescription,
  jobDescription,
  retries = 3,
}) {
  const prompt = `
  Return ONLY valid JSON. No text. No explanation.

  STRICT FORMAT:

  {
    "title": string,
    "matchScore": number,
    "technicalQuestions": [
      {
        "question": string,
        "intention": string,
        "answer": string
      }
    ],
    "behavioralQuestions": [
      {
        "question": string,
        "intention": string,
        "answer": string
      }
    ],
    "skillGaps": [
      {
        "skill": string,
        "severity": "low" | "medium" | "high"
      }
    ],
    "preparationPlan": [
      {
        "day": number,
        "focus": string,
        "tasks": [string]
      }
    ]
  }

  RULES:
  - DO NOT return extra fields
  - DO NOT return strings inside arrays
  - ALWAYS return objects
  - ALL fields are required
  - Max 10 questions
  - Max 30 days plan

  Input:
  Resume: ${resume}
  Self Description: ${selfDescription}
  Job Description: ${jobDescription}
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseJsonSchema: zodToJsonSchema(interviewReportSchema),
      },
    });

    let parsed;
    try {
      parsed = JSON.parse(response.text);
    } catch (e) {
      throw new Error("Invalid JSON from AI");
    }

    const cleaned = sanitizeReport(parsed);
    const result = interviewReportSchema.safeParse(cleaned);

    if (!result.success) {
      console.log("Validation failed:", result.error);
      throw new Error("Invalid AI structure");
    }

    if (isEmptyReport(result.data)) {
      throw new Error("Empty AI response");
    }

    return result.data;
  } catch (err) {
    const shouldRetry =
      retries > 0 &&
      (err.status === 503 ||
        err.message === "Invalid JSON from AI" ||
        err.message === "Invalid AI structure" ||
        err.message === "Empty AI response");

    if (shouldRetry) {
      console.log("Retrying...", retries);

      await new Promise((res) => setTimeout(res, 1000));

      return generateInterviewReport({
        resume,
        selfDescription,
        jobDescription,
        retries: retries - 1,
      });
    }

    console.log("AI Error:", err.message);

    throw err;
  }
}

async function generatePdfFromHtml(htmlContent) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setContent(htmlContent, { waitUntil: "networkidle0" });

  const pdfBuffer = await page.pdf({
    format: "A4",
    margin: {
      top: "20mm",
      bottom: "20mm",
      left: "15mm",
      right: "15mm",
    },
  });

  await browser.close();

  return pdfBuffer;
}

async function generateResumePdf({
  resume,
  selfDescription,
  jobDescription,
  retries = 3,
}) {
  try {
    const resumePdfSchema = z.object({
      html: z
        .string()
        .describe(
          "The HTML content of the resume which can be converted to PDF using any library like puppeteer",
        ),
    });

    const prompt = `Generate resume for a candidate with the following details:
                        Resume: ${resume}
                        Self Description: ${selfDescription}
                        Job Description: ${jobDescription}

                        the response should be a JSON object with a single field "html" which contains the HTML content of the resume which can be converted to PDF using any library like puppeteer.
                        The resume should be tailored for the given job description and should highlight the candidate's strengths and relevant experience. The HTML content should be well-formatted and structured, making it easy to read and visually appealing.
                        The content of resume should be not sound like it's generated by AI and should be as close as possible to a real human-written resume.
                        you can highlight the content using some colors or different font styles but the overall design should be simple and professional.
                        The content should be ATS friendly, i.e. it should be easily parsable by ATS systems without losing important information.
                        The resume should not be so lengthy, it should ideally be 1-2 pages long when converted to PDF. Focus on quality rather than quantity and make sure to include all the relevant information that can increase the candidate's chances of getting an interview call for the given job description.
                    `;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: zodToJsonSchema(resumePdfSchema),
      },
    });

    let jsonContent;
    try {
      jsonContent = JSON.parse(response.text);
    } catch (e) {
      throw new Error("Invalid JSON from AI");
    }

    const result = resumePdfSchema.safeParse(jsonContent);

    if (!result.success) {
      console.log("Validation failed:", result.error);
      throw new Error("Invalid AI structure");
    }

    const pdfBuffer = await generatePdfFromHtml(result.data.html);

    return pdfBuffer;
  } catch (err) {
    const shouldRetry =
      retries > 0 &&
      (err.status === 503 ||
        err.message === "Invalid JSON from AI" ||
        err.message === "Invalid AI structure");

    if (shouldRetry) {
      console.log("Retrying...", retries);

      await new Promise((res) => setTimeout(res, 1000));

      return generateResumePdf({
        resume,
        selfDescription,
        jobDescription,
        retries: retries - 1,
      });
    }

    console.log("AI Error:", err.message);

    throw err;
  }
}

module.exports = { generateInterviewReport, generateResumePdf };
