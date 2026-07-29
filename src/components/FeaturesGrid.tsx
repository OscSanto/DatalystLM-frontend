import { QuestionWidget, FeedbackWidget, VoiceWidget } from "./Widgets";

const cards = [
  {
    widget: <QuestionWidget />,
    lead: "24 questions across ML, SQL, Statistics, and Python",
    rest: " — easy, medium, and hard, seeded and ready to practice.",
  },
  {
    widget: <FeedbackWidget />,
    lead: "Claude evaluates every answer in seconds",
    rest: " — concepts covered, what's missing, and one actionable improvement tip.",
  },
  {
    widget: <VoiceWidget />,
    lead: "Voice metrics that persist across sessions",
    rest: " — watch your WPM stabilize and filler words disappear over time.",
  },
];

export default function FeaturesGrid() {
  return (
    <section className="section container">
      <div style={{ textAlign: "center", marginBottom: "3rem", maxWidth: "24ch", marginInline: "auto" }} className="reveal">
        <h2>Everything you need to interview with confidence</h2>
      </div>
      <div className="feat-cards">
        {cards.map((c, i) => (
          <div className="feat-card reveal" key={i}>
            {c.widget}
            <p>
              {c.lead}
              <span className="tone-medium">{c.rest}</span>
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
