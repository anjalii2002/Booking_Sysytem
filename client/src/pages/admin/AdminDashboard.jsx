import { Link } from 'react-router-dom';

export default function AdminDashboard() {
  const links = [
    { to: '/admin/spaces', title: 'Manage Spaces', desc: 'Create, edit, and delete spaces' },
    { to: '/admin/bookings', title: 'All Bookings', desc: 'View and filter all bookings' },
    { to: '/admin/approvals', title: 'Approval Queue', desc: 'Approve or reject pending requests' },
    { to: '/admin/maintenance', title: 'Maintenance', desc: 'Block spaces for maintenance' },
  ];

  return (
    <div>
      <div className="page-header">
        <h1>Admin Dashboard</h1>
        <p>Manage spaces, bookings, and maintenance</p>
      </div>
      <div className="grid grid-2">
        {links.map((l) => (
          <Link key={l.to} to={l.to} style={{ textDecoration: 'none', color: 'inherit' }}>
            <div className="card">
              <h3 style={{ marginBottom: '0.5rem' }}>{l.title}</h3>
              <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>{l.desc}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
