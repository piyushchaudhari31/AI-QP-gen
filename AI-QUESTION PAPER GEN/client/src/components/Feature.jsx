import { Brain, FileText, BarChart3, BookOpen } from "lucide-react";
import '../style/feature.css';

const Features = () => {
  return (
    <section className="features-section">
      <div className="features-row">
        <div className="feature-card">
          <Brain size={34} />
          <h3>AI-Powered Generation</h3>
          <p>
            Generate intelligent question papers with AI-predicted difficulty
            and smart content distribution.
          </p>
        </div>

        <div className="feature-card">
          <FileText size={34} />
          <h3>Blueprint-Based Exams</h3>
          <p>
            Create papers using exam blueprints with unit-wise weightage and
            taxonomy alignment.
          </p>
        </div>

        <div className="feature-card">
          <BarChart3 size={34} />
          <h3>Analytics & Insights</h3>
          <p>
            Track performance, view detailed reports, and analyze topic-wise
            student progress.
          </p>
        </div>

        <div className="feature-card">
          <BookOpen size={34} />
          <h3>Question Bank</h3>
          <p>
            Manage a centralized question bank categorized by topic, difficulty,
            and marks.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Features;
