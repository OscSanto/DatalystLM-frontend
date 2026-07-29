import { socialIcons } from "./Icons";

const cols = [
  {
    head: "Practice",
    links: ["Machine Learning", "SQL & Databases", "Statistics", "Python", "All Topics"],
  },
  {
    head: "Product",
    links: ["How It Works", "Voice Analytics", "AI Feedback", "Pricing", "Beta Access"],
    newAt: "Beta Access",
  },
  {
    head: "More",
    links: ["FAQ", "GitHub", "Create Account", "Sign In", "Contact"],
  },
];

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-top">
          <div>
            <a href="#" className="nav-logo">
              Datalyst<b>LM</b>
            </a>
            <p style={{ marginTop: "1rem", fontSize: ".9rem", color: "var(--tone-medium)", maxWidth: "22ch", lineHeight: 1.6 }}>
              AI-powered data science interview prep. Practice out loud. Get real feedback.
            </p>
          </div>
          <div className="footer-cols">
            {cols.map((c) => (
              <div className="footer-col" key={c.head}>
                <h6>{c.head}</h6>
                {c.links.map((l) => (
                  <a href="#" key={l}>
                    {l}
                    {c.newAt === l && <span className="new">Beta</span>}
                  </a>
                ))}
              </div>
            ))}
          </div>
        </div>

        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} DatalystLM — built with Spring Boot, React, Claude AI & Docker</span>
          <div className="footer-social">
            <a href="#" aria-label="X">{socialIcons.x}</a>
            <a href="#" aria-label="LinkedIn">{socialIcons.in}</a>
            <a href="#" aria-label="Instagram">{socialIcons.ig}</a>
            <a href="#" aria-label="GitHub">{socialIcons.fb}</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
