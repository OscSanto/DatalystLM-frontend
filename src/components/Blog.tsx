const posts = [
  {
    cat: "Guide",
    news: false,
    title: "How to explain overfitting to any interviewer — even non-technical ones",
    date: "July 2026",
  },
  {
    cat: "Tips",
    news: false,
    title: "The 5 SQL questions every data science interview asks — and what they're testing",
    date: "July 2026",
  },
  {
    cat: "Science",
    news: true,
    title: "Why practicing out loud improves recall more than reading notes",
    date: "July 2026",
  },
];

export default function Blog() {
  return (
    <section id="blog" className="section container">
      <div style={{ marginBottom: "3rem" }} className="reveal">
        <span className="eyebrow">
          <span className="dot" /> Resources
        </span>
        <h2 style={{ marginTop: "1rem", maxWidth: "20ch" }}>
          Sharpen your interview instincts
        </h2>
      </div>
      <div className="blog-grid">
        {posts.map((p) => (
          <a href="#" className="blog-card reveal" key={p.title}>
            <div className="blog-thumb" />
            <div className="blog-body">
              <span className={`chip ${p.news ? "news" : ""}`}>{p.cat}</span>
              <h5>{p.title}</h5>
              <span className="blog-date">{p.date}</span>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}
