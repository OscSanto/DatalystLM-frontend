import { Arrow } from "./Icons";

export default function CTA() {
  return (
    <section className="section container">
      <div className="cta reveal">
        <h2>Ready to answer with confidence?</h2>
        <p style={{ color: "rgba(255,255,255,.7)", marginTop: "1rem", fontSize: "1.1rem" }}>
          Stop studying. Start speaking. Your next interview is practice.
        </p>
        <div className="hero-cta" style={{ marginTop: "2rem" }}>
          <a href="#" className="btn btn--coral">
            Start Practicing Free <Arrow />
          </a>
          <a
            href="#features"
            className="btn btn--secondary"
            style={{ color: "#fff", borderColor: "rgba(255,255,255,.25)" }}
          >
            See how it works
          </a>
        </div>
      </div>
    </section>
  );
}
