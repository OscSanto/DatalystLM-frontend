import { Arrow } from "./Icons";
import { QuestionWidget, ScoreWidget, VoiceWidget } from "./Widgets";

const cards = [
  {
    color: "sky",
    emoji: "🧠",
    tag: "Machine Learning",
    title: "Classification, regression, overfitting, neural networks, model evaluation",
    media: <QuestionWidget />,
  },
  {
    color: "green",
    emoji: "🗄",
    tag: "SQL & Databases",
    title: "Joins, indexes, window functions, query optimization, schema design",
    media: <ScoreWidget />,
  },
  {
    color: "purple",
    emoji: "📐",
    tag: "Statistics",
    title: "Distributions, hypothesis testing, p-values, A/B testing, Bayesian basics",
    media: <VoiceWidget />,
  },
];

export default function Products() {
  return (
    <section className="section container">
      <div className="section-head">
        <div className="reveal">
          <span className="eyebrow">
            <span className="dot" /> Practice Topics
          </span>
          <h2 style={{ marginTop: "1rem" }}>
            Every topic data science interviews cover
          </h2>
        </div>
        <div className="actions reveal">
          <a href="#" className="btn">
            Start Practicing <Arrow />
          </a>
        </div>
      </div>

      <div className="cards-3">
        {cards.map((c) => (
          <div className="product-card reveal" key={c.tag}>
            <span className="tag">
              <span className={`tag-ico ${c.color}`} style={{ fontSize: ".9rem" }}>{c.emoji}</span>
              {c.tag}
            </span>
            <h5>{c.title}</h5>
            {c.media}
          </div>
        ))}
      </div>
    </section>
  );
}
