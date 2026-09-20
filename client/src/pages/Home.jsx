import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div>
      <section style={{
        textAlign: 'center',
        padding: '4rem 1rem',
        background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
        borderRadius: '12px',
        color: 'white',
        marginBottom: '3rem',
      }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 700, marginBottom: '1rem' }}>
          Book Your Perfect Workspace
        </h1>
        <p style={{ fontSize: '1.125rem', opacity: 0.9, maxWidth: '600px', margin: '0 auto 2rem' }}>
          Reserve desks and meeting rooms at CoWork Hub. Browse availability, book instantly, and manage your reservations.
        </p>
        <Link to="/spaces" className="btn" style={{ background: 'white', color: '#2563eb', fontWeight: 600 }}>
          Browse Spaces
        </Link>
      </section>

      <div className="grid grid-3">
        {[
          { title: 'Desks', desc: 'Quiet individual workspaces with amenities', icon: '🖥️' },
          { title: 'Meeting Rooms', desc: 'Collaborate in fully equipped rooms', icon: '🏢' },
          { title: 'Real-time Availability', desc: 'See open slots before you book', icon: '📅' },
        ].map((item) => (
          <div key={item.title} className="card" style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>{item.icon}</div>
            <h3 style={{ marginBottom: '0.5rem' }}>{item.title}</h3>
            <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>{item.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
