import "../style/testimonials.css";
import { Star } from "lucide-react";
import img1 from '../assets/dixit.jpeg'
import img2 from '../assets/dinesh.png'
import img3 from '../assets/Tirth.png'

const Testimonials = () => {
    return (
        <section className="testimonials-section">
            <h2>Loved by Creators</h2>
            <p className="subtitle">
                Don't just take our word for it. Here's what our users are saying.
            </p>

            <div className="testimonials-grid">
                <div className="testimonial-card">
                    <div className="stars">
                        {[...Array(4)].map((_, i) => (
                            <Star key={i} size={18} fill="#6366f1" stroke="#6366f1" />
                        ))}
                        <Star size={18} stroke="#c7d2fe" />
                    </div>

                    <p className="quote">
                        "AI QPG has revolutionized our exam workflow. The quality of question
                        papers is outstanding and it saves hours every week."
                    </p>

                    <div className="user">
                        <div className="avatar">
                            <img src={img1} alt="user" />
                        </div>
                        <div>
                            <h4>Pawar Dikshit</h4>
                            <span>B.Tech 3rd-Year</span>
                        </div>
                    </div>
                </div>

                {/* Card 2 */}
                <div className="testimonial-card">
                    <div className="stars">
                        {[...Array(5)].map((_, i) => (
                            <Star key={i} size={18} fill="#6366f1" stroke="#6366f1" />
                        ))}
                    </div>

                    <p className="quote">
                        "AI QPG has made question paper creation effortless. The AI tools help
                        us generate high-quality exams faster than ever."
                    </p>

                    <div className="user">
                        <div className="avatar">
                            <img src={img2} alt="user" />
                        </div>
                        <div>
                            <h4>Jena Dinesh</h4>
                            <span>B.Tech 3rd-Year</span>
                        </div>
                    </div>
                </div>

                {/* Card 3 */}
                <div className="testimonial-card">
                    <div className="stars">
                        {[...Array(4)].map((_, i) => (
                            <Star key={i} size={18} fill="#6366f1" stroke="#6366f1" />
                        ))}
                        <Star size={18} stroke="#c7d2fe" />
                    </div>

                    <p className="quote">
                        "AI QPG transformed how students practice exams. Analytics and model
                        answers make learning more effective."
                    </p>

                    <div className="user">
                        <div className="avatar">
                            <img src={img3} alt="user" />
                        </div>
                        <div>
                            <h4>Jariwala Tirth</h4>
                            <span>B.Tech 3rd-Year</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Testimonials;
