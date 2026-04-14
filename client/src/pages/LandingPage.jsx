import { Link } from 'react-router-dom'

const highlights = [
  {
    title: 'Leader-first shell',
    body: 'Only the routes you need are exposed right now. The other member pages stay as blank placeholders.',
  },
  {
    title: 'Simple protected routing',
    body: 'Login state is stored in localStorage, so the protected area can be opened without backend wiring yet.',
  },
  {
    title: 'Ready for backend later',
    body: 'The route structure matches the project architecture, so the real modules can be attached later without rewriting the client.',
  },
]

export default function LandingPage() {
  return (
    <div className="page-frame" style={{ padding: '24px 0 40px' }}>
      <section className="hero-panel">
        <div className="hero-grid">
          <div>
            <span className="eyebrow">Campus Operations Hub</span>
            <h1 className="headline">Basic frontend shell for the leader role.</h1>
            <p className="lede">
              This client keeps the scope intentionally small: a public landing page, a demo login,
              and protected shell pages for the leader. The other team-member pages are present only as
              blank routes for now.
            </p>

            <div className="button-row">
              <Link className="button" to="/login">
                Leader login
              </Link>
              <Link className="button-secondary" to="/app">
                Open dashboard
              </Link>
            </div>
          </div>

          <div className="stat-grid" aria-label="Project scope summary">
            <div className="stat-card">
              <strong>1</strong>
              <span>Leader dashboard</span>
            </div>
            <div className="stat-card">
              <strong>5</strong>
              <span>Blank module routes</span>
            </div>
            <div className="stat-card">
              <strong>0</strong>
              <span>Extra UI for members</span>
            </div>
            <div className="stat-card">
              <strong>JWT</strong>
              <span>Token-based gating</span>
            </div>
          </div>
        </div>
      </section>

      <section style={{ marginTop: '28px' }}>
        <h2 className="section-heading">What is included</h2>
        <p className="section-copy">
          The app is set up for routing and role gating, but the detailed module pages are intentionally left simple until you need them.
        </p>

        <div className="card-grid">
          {highlights.map((item) => (
            <article className="card-panel" key={item.title}>
              <h3 style={{ marginTop: 0 }}>{item.title}</h3>
              <p className="section-copy" style={{ marginBottom: 0 }}>
                {item.body}
              </p>
            </article>
          ))}
        </div>
      </section>
    </div>
  )
}
