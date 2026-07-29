import { useState } from "react";

const faqs = [
  {
    q: "What topics does DatalystLM cover?",
    a: "Currently Machine Learning, SQL & Databases, Statistics, and Python — with 24 questions across easy, medium, and hard difficulties. More questions and topics are added regularly.",
  },
  {
    q: "How does the speech recognition work?",
    a: "DatalystLM uses the Web Speech API built into your browser — no third-party transcription service, no audio sent to external servers. Chrome gives the best results. Your voice stays on your device.",
  },
  {
    q: "Which AI provides the feedback?",
    a: "Feedback is powered by Claude (Anthropic). You can also run DatalystLM with a local Ollama model if you prefer full offline privacy — just set the LLM_PROVIDER environment variable.",
  },
  {
    q: "How is this different from just reading a study guide?",
    a: "Reading activates recognition memory. Saying an answer out loud activates recall — the same process you use in an actual interview. Research consistently shows that active recall produces better retention and reduces anxiety under pressure.",
  },
  {
    q: "Is my data private?",
    a: "Your transcribed answers are sent to Claude for evaluation but are not stored beyond the session. Practice sessions and scores are saved to your account for progress tracking.",
  },
  {
    q: "Is DatalystLM free?",
    a: "The beta is free with full access to all topics and questions. Paid plans will add session history, progress dashboards, and additional topic packs.",
  },
];

export default function FAQ() {
  const [open, setOpen] = useState(0);
  return (
    <section id="faq" className="section container">
      <div className="faq-grid">
        <div className="reveal">
          <h2>
            Questions?
            <br />
            We've got answers.
          </h2>
        </div>
        <div className="reveal">
          {faqs.map((f, i) => (
            <div className={`faq-item${open === i ? " open" : ""}`} key={f.q}>
              <button
                className="faq-q"
                onClick={() => setOpen(open === i ? -1 : i)}
              >
                {f.q}
                <span className="pm" />
              </button>
              <div className="faq-a">
                <p>{f.a}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
