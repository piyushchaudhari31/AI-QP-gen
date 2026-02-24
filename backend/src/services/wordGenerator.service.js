const { Document, Packer, Paragraph, TextRun, AlignmentType } = require("docx");
const fs = require("fs");
const path = require("path");

async function generateQuestionPaperWord(paper) {
  const children = [];

  children.push(
    new Paragraph({
      children: [new TextRun({ text: "UKA TARSADIA UNIVERSITY", bold: true, size: 32 })],
      alignment: AlignmentType.CENTER,
    }),
    new Paragraph({
      text: "B.Tech (CE/AI&DS/ICT) (3rd Semester)",
      alignment: AlignmentType.CENTER,
    }),
    new Paragraph({
      text: "Subject Name: Object Oriented Programming with JAVA (CE4102)",
      alignment: AlignmentType.CENTER,
    }),
    new Paragraph({
      text: "Internal Assessment - II",
      alignment: AlignmentType.CENTER,
      spacing: { after: 300 },
    }),
    new Paragraph("Duration: 1 Hour 30 Minutes        Max. Marks: " + paper.totalMarks),
    new Paragraph("Instructions:"),
    new Paragraph("1. Attempt all questions."),
    new Paragraph("2. Write each section in a separate answer book."),
    new Paragraph("3. Figures to the right indicate full marks."),
    new Paragraph("4. Draw diagrams wherever necessary."),
    new Paragraph("")
  );

  // ===== GROUP QUESTIONS BY MARKS =====
  const grouped = {};
  paper.questions.forEach((q) => {
    if (!grouped[q.marks]) grouped[q.marks] = [];
    grouped[q.marks].push(q.questionText);
  });

  // 🔥 ORDER: 2 → 3 → 5 → 6
  const orderedMarks = Object.keys(grouped)
    .map(Number)
    .sort((a, b) => a - b);

  let qNo = 1;
  let sectionNo = 1;

  orderedMarks.forEach((marks) => {
    // ===== SECTION HEADING =====
    children.push(
      new Paragraph({
        children: [
          new TextRun({
            text: `Q-${sectionNo} Answer the following (${marks} Marks each)`,
            bold: true,
          }),
          new TextRun({
            text: `        [${marks}]`,
            bold: true,
          }),
        ],
        spacing: { before: 300, after: 200 },
      })
    );

    // ===== QUESTIONS =====
    grouped[marks].forEach((question) => {
      children.push(
        new Paragraph({
          text: `${qNo}. ${question}`,
          spacing: { after: 100 },
        })
      );
      qNo++;
    });

    sectionNo++;
  });

  // ===== CREATE DOC =====
  const doc = new Document({
    sections: [{ children }],
  });

  const dir = path.join(__dirname, "../../downloads");
  if (!fs.existsSync(dir)) fs.mkdirSync(dir);

  const filePath = path.join(dir, `question-paper-${paper._id}.docx`);
  const buffer = await Packer.toBuffer(doc);
  fs.writeFileSync(filePath, buffer);

  return filePath;
}

module.exports = generateQuestionPaperWord;
