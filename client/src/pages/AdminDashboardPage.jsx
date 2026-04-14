const summaryCards = [
  { label: 'Open modules', value: '5', note: 'Shell routes ready' },
  { label: 'Assigned role', value: 'Leader', note: 'Admin access enabled' },
  { label: 'Backend status', value: 'Pending', note: 'Wire later' },
]

const nextSteps = [
  'Connect the landing page buttons to the real backend login flow when the JWT endpoint is ready.',
  'Replace the blank module pages with actual catalogue, booking, ticket, and notification screens later.',
  'Keep the route structure stable so the rest of the team can plug in their screens without changing the shell.',
]

export default function AdminDashboardPage() {
  return (
    <div>
      <section className="shell-banner">
        <div>
          <span className="tag">Admin dashboard</span>
          <h1 className="section-heading" style={{ marginTop: '12px' }}>
            Minimal control center
          </h1>
          <p className="section-copy" style={{ marginBottom: 0 }}>
            This page is deliberately basic. It gives the leader a place to start while the member-specific features remain blank.
          </p>
        </div>
      </section>

      <div className="card-grid" style={{ marginBottom: '18px' }}>
        {summaryCards.map((card) => (
          <article className="card-panel" key={card.label}>
            <p className="section-copy" style={{ marginBottom: '6px' }}>
              {card.label}
            </p>
            <h2 style={{ margin: 0, fontSize: '2rem' }}>{card.value}</h2>
            <p className="section-copy" style={{ marginTop: '6px', marginBottom: 0 }}>
              {card.note}
            </p>
          </article>
        ))}
      </div>

      <section className="card-panel">
        <h2 className="section-heading" style={{ marginTop: 0 }}>
          Current scope
        </h2>
        <ul style={{ margin: 0, paddingLeft: '20px', color: '#475569', lineHeight: 1.7 }}>
          {nextSteps.map((step) => (
            <li key={step}>{step}</li>
          ))}
        </ul>
      </section>
    </div>
  )
}