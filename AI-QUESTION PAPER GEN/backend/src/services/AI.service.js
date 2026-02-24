const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const model = genAI.getGenerativeModel({
  model: "gemini-3-flash-preview",
});

function buildPrompt({ subjectName, topic, type, count }) {
  if (type === "MCQ") {
  return `
You are a college teacher preparing an INTERNAL exam.

Generate ${count} VERY EASY MCQ questions.
  
Subject: ${subjectName}
Topic: ${topic}

Rules:
- Immediately return success response
- Do not repeat the question 
- Questions must be VERY SIMPLE
- Basic concept questions only
- Avoid technical or difficult words
- Use student-friendly language
- No tricky or analytical questions
- Options must be short and clear
- Each question is of 1 MARK
- Only 1 correct answer
- Correct answer MUST be from given options

Return ONLY JSON:
[
 {
   "questionText": "string",
   "questionType": "MCQ",
   "marks": 1,
   "options": ["A","B","C","D"],
   "correctAnswer": "one of the options exactly"
 }
]
`;
}


  return `
You are preparing an EASY internal exam paper.

Generate ${count} ${type} questions.

Subject: ${subjectName}
Topic: ${topic}

Rules:
- VERY SIMPLE questions
- Not repeat the question
- Focus on definitions, meaning, uses
- Use easy English
- Avoid difficult terminology
- No case studies or analytical questions
- Questions should be answerable in basic level

Use question starters like:
- What is
- Define
- Explain in simple words
- List the types
- State the importance

Return ONLY JSON:
[
 {
   "questionText": "string",
   "questionType": "${type}"
 }
]
`;
}

module.exports = { model, buildPrompt };
