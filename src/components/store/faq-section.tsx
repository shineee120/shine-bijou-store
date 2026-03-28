export function FAQSection({
  items
}: {
  items: Array<{ question: string; answer: string }>;
}) {
  return (
    <section className="section" id="faq">
      <div className="container">
        <div className="section-heading">
          <p className="eyebrow">Preguntas frecuentes</p>
          <h2>Todo lo importante, claro y rapido</h2>
        </div>

        <div className="faq-list">
          {items.map((item) => (
            <details key={item.question} className="faq-item">
              <summary>{item.question}</summary>
              <p>{item.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
