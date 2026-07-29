import { Arrow } from "./Icons";
import { SpeakWidget, FeedbackWidget, VoiceWidget } from "./Widgets";

const rows = [
  {
    tag: "Speech-First",
    cls: "sky",
    emoji: "🎙",
    title: "Practice out loud, not just in your head",
    body: "Typing answers is nothing like a real interview. DatalystLM captures your voice, transcribes it live, and evaluates how you actually explain concepts — not how you write them.",
    cta: "Try a question",
    media: <SpeakWidget />,
  },
  {
    tag: "AI Feedback",
    cls: "green",
    emoji: "🤖",
    title: "Claude grades your answer like a real interviewer would",
    body: "Not just right or wrong. Claude checks whether you covered the key concepts, spots what you missed, identifies inaccuracies, and gives you one concrete tip to improve your next attempt.",
    cta: "See example feedback",
    media: <FeedbackWidget />,
  },
  {
    tag: "Voice Analytics",
    cls: "peach",
    emoji: "📊",
    title: "Know if you're rushing, rambling, or saying 'um' too much",
    body: "Your content score is only half the picture. Voice analytics measures words per minute, filler word count, confidence, and pause patterns — the delivery skills interviewers notice but rarely mention.",
    cta: "See voice metrics",
    media: <VoiceWidget />,
  },
];

export default function FeatureSections() {
  return (
    <section id="features" className="section container">
      {rows.map((r) => (
        <div className="feature-row" key={r.tag}>
          <div className="feature-copy reveal">
            <span className="tag">
              <span className={`tag-ico ${r.cls}`} style={{ fontSize: ".9rem" }}>{r.emoji}</span>
              {r.tag}
            </span>
            <h2>{r.title}</h2>
            <p className="lead">{r.body}</p>
            <a href="#" className="btn btn--secondary" style={{ marginTop: "1.4rem" }}>
              {r.cta} <Arrow />
            </a>
          </div>
          <div className="feature-media reveal">{r.media}</div>
        </div>
      ))}
    </section>
  );
}
