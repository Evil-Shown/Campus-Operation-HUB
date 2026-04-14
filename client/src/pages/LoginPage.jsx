import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function LoginPage() {
  const navigate = useNavigate()
  const { loginAsLeader } = useAuth()

  const handleDemoLogin = () => {
    loginAsLeader()
    navigate('/app')
  }

  return (
    <div className="page-frame" style={{ padding: '32px 0' }}>
      <section className="hero-panel" style={{ maxWidth: '640px', margin: '0 auto' }}>
        <span className="eyebrow">Access</span>
        <h1 className="section-heading" style={{ marginTop: '12px', fontSize: '2.3rem' }}>
          Leader sign-in
        </h1>
        <p className="section-copy">
          This is a frontend-only demo login for the leader account. It stores a token in localStorage so the protected routes can be tested without the backend being ready.
        </p>

        <div className="button-row">
          <button className="button" type="button" onClick={handleDemoLogin}>
            Sign in as leader
          </button>
          <Link className="button-secondary" to="/">
            Back to landing page
          </Link>
        </div>

        <div className="info-card" style={{ marginTop: '24px' }}>
          <strong>Demo account</strong>
          <p className="section-copy" style={{ marginBottom: 0 }}>
            Name: Team Leader
            <br />
            Role: leader
          </p>
        </div>
      </section>
    </div>
  )
}
