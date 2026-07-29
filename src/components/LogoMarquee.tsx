const stack = [
  "Spring Boot",
  "React",
  "Docker",
  "Kubernetes",
  "Claude AI",
  "PostgreSQL",
  "TypeScript",
  "Ollama",
  "Java 21",
  "Vite",
];

export default function LogoMarquee() {
  const list = [...stack, ...stack];
  return (
    <section className="container" style={{ paddingBlock: "2.5rem" }}>
      <div className="marquee">
        <div className="marquee-track">
          {list.map((l, i) => (
            <span className="logo-word" key={i}>
              {l}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
