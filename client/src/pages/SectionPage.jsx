export default function SectionPage({ title, description }) {
  return (
    <section className="hero-panel">
      <span className="eyebrow">Module shell</span>
      <h1 className="section-heading" style={{ marginTop: '12px' }}>
        {title}
      </h1>
      <p className="section-copy" style={{ marginBottom: 0 }}>
        {description}
      </p>
    </section>
  )
}
