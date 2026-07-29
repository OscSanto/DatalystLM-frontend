const items = [
  {
    logo: "Meta",
    quote: "I'd been studying from flashcards for weeks but couldn't explain anything clearly in mock interviews. Two weeks on DatalystLM and I was articulate, calm, and on-point. Got the L4 offer.",
    name: "Priya Sharma",
    role: "Data Scientist · Meta",
    initials: "PS",
  },
  {
    logo: "Amazon",
    quote: "The voice analytics were eye-opening. I was speaking at 195 WPM — no wonder interviewers looked confused. Slowing down and cutting filler words changed everything.",
    name: "Marcus Chen",
    role: "Data Engineer · Amazon",
    initials: "MC",
  },
  {
    logo: "Stripe",
    quote: "Claude's feedback is brutally honest in the best way. It told me I covered regression but completely glossed over bias-variance tradeoff every single time. Fixed.",
    name: "Lena Fischer",
    role: "Analytics Engineer · Stripe",
    initials: "LF",
  },
  {
    logo: "Airbnb",
    quote: "Being scored on keywords while also getting voice coaching is a combination I haven't seen anywhere else. It's the closest thing to a real interview short of actually doing one.",
    name: "Jordan Williams",
    role: "ML Engineer · Airbnb",
    initials: "JW",
  },
];

function Card({ t }: { t: (typeof items)[number] }) {
  return (
    <div className="tcard">
      <div className="logo-word">{t.logo}</div>
      <p>"{t.quote}"</p>
      <div className="who">
        <span className="avatar">{t.initials}</span>
        <div>
          <div className="name">{t.name}</div>
          <div className="tone-medium" style={{ fontSize: ".85rem" }}>{t.role}</div>
        </div>
      </div>
    </div>
  );
}

export default function Testimonials() {
  const loop = [...items, ...items];
  return (
    <section className="section">
      <div className="container">
        <div style={{ textAlign: "center", marginBottom: "3rem" }} className="reveal">
          <span className="eyebrow">
            <span className="dot" /> Success Stories
          </span>
          <h2 style={{ marginTop: "1rem" }}>
            Candidates who practiced out loud, landed the role
          </h2>
        </div>
      </div>
      <div className="marquee" style={{ padding: "0.5rem 0" }}>
        <div className="marquee-track" style={{ gap: "1.5rem" }}>
          {loop.map((t, i) => (
            <Card key={i} t={t} />
          ))}
        </div>
      </div>
    </section>
  );
}
