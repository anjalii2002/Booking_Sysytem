import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { spacesApi } from '../services/api';

export default function Spaces() {
  const [spaces, setSpaces] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 9, totalPages: 1, total: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({ search: '', type: '', capacity: '', date: '' });

  const fetchSpaces = async (page = 1) => {
    setLoading(true);
    setError('');
    try {
      const params = { page, limit: pagination.limit };
      if (filters.search) params.search = filters.search;
      if (filters.type) params.type = filters.type;
      if (filters.capacity) params.capacity = filters.capacity;
      if (filters.date) params.date = filters.date;

      const { data } = await spacesApi.list(params);
      setSpaces(data.data.spaces);
      setPagination(data.data.pagination);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load spaces');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSpaces(1);
  }, []);

  const handleFilter = (e) => {
    e.preventDefault();
    fetchSpaces(1);
  };

  return (
    <div>
      <div className="page-header">
        <h1>Available Spaces</h1>
        <p>Browse desks and meeting rooms</p>
      </div>

      <form className="filters" onSubmit={handleFilter}>
        <div className="form-group">
          <label>Search</label>
          <input
            placeholder="Name or type..."
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
          />
        </div>
        <div className="form-group">
          <label>Type</label>
          <select value={filters.type} onChange={(e) => setFilters({ ...filters, type: e.target.value })}>
            <option value="">All</option>
            <option value="desk">Desk</option>
            <option value="meeting_room">Meeting Room</option>
          </select>
        </div>
        <div className="form-group">
          <label>Min Capacity</label>
          <input
            type="number"
            min="1"
            placeholder="Any"
            value={filters.capacity}
            onChange={(e) => setFilters({ ...filters, capacity: e.target.value })}
          />
        </div>
        <div className="form-group">
          <label>Available on Date</label>
          <input
            type="date"
            value={filters.date}
            onChange={(e) => setFilters({ ...filters, date: e.target.value })}
          />
        </div>
        <div className="form-group" style={{ alignSelf: 'flex-end' }}>
          <button type="submit" className="btn btn-primary">Apply Filters</button>
        </div>
      </form>

      {error && <div className="error-msg">{error}</div>}
      {loading ? (
        <div className="loading">Loading spaces...</div>
      ) : spaces.length === 0 ? (
        <div className="empty-state">No spaces found matching your criteria.</div>
      ) : (
        <>
          <div className="grid grid-2">
            {spaces.map((space) => (
              <Link key={space._id} to={`/spaces/${space._id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                <div className="card" style={{ height: '100%', transition: 'box-shadow 0.15s' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '0.75rem' }}>
                    <h3>{space.name}</h3>
                    <span className="badge badge-approved">{space.type.replace('_', ' ')}</span>
                  </div>
                  <p style={{ color: '#6b7280', fontSize: '0.875rem', marginBottom: '0.75rem' }}>
                    Capacity: {space.capacity} · {space.amenities?.slice(0, 3).join(', ')}
                  </p>
                  <p style={{ fontSize: '0.875rem', color: '#374151' }}>{space.description?.slice(0, 100)}</p>
                </div>
              </Link>
            ))}
          </div>
          <div className="pagination">
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              disabled={pagination.page <= 1}
              onClick={() => fetchSpaces(pagination.page - 1)}
            >
              Previous
            </button>
            <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>
              Page {pagination.page} of {pagination.totalPages} ({pagination.total} total)
            </span>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              disabled={pagination.page >= pagination.totalPages}
              onClick={() => fetchSpaces(pagination.page + 1)}
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
}
