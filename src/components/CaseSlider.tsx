import { useState } from "react";
import { Arrow } from "./Icons";

const cases = [
  {
    logo: "Meta · L4 Data Scientist",
    grad: "linear-gradient(135deg,#3a2f5c,#7c5cff)",
    title: "After 3 weeks of daily practice on DatalystLM, I could explain every ML concept clearly and confidently. Passed the ML design round on my first try.",
  },
  {
    logo: "Amazon · Data Engineer",
    grad: "linear-gradient(135deg,#1f4d3a,#38b48b)",
    title: "The voice analytics showed I was speaking at 210 WPM — way too fast. Two weeks of practice brought me down to 140 and I stopped rushing through answers.",
  },
  {
    logo: "Stripe · Analytics Engineer",
    grad: "linear-gradient(135deg,#5c3a2f,#ed7472)",
    title: "I used to freeze on statistics questions. Practicing out loud with real feedback completely changed how I approach probability and hypothesis testing.",
  },
  {
    logo: "Airbnb · ML Engineer",
    grad: "linear-gradient(135deg,#2f3a5c,#5c9bed)",
    title: "The keyword scoring made it obvious which concepts I was glossing over. I had to actually understand overfitting to stop missing 'regularization' every time.",
  },
];

export default function CaseSlider() {
  const [i, setI] = useState(0);
  const c = cases[i];
  const go = (d: number) => setI((p) => (p + d + cases.length) % cases.length);

  return (
    <section id="cases" className="section container">
      <div className="slider">
        <div className="case-card" style={{ background: c.grad }}>
          <span className="logo">{c.logo}</span>
          <div>
            <h3>"{c.title}"</h3>
            <a href="#" className="btn">
              Start your story <Arrow />
            </a>
          </div>
        </div>
        <div className="slider-nav">
          <button className="slider-btn" aria-label="Previous" onClick={() => go(-1)}>
            <span style={{ display: "grid", transform: "rotate(180deg)" }}>
              <Arrow />
            </span>
          </button>
          <button className="slider-btn" aria-label="Next" onClick={() => go(1)}>
            <Arrow />
          </button>
        </div>
      </div>
    </section>
  );
}
