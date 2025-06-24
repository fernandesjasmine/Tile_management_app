import React, { useState, useEffect } from 'react';
import '../App.css';

function ViewerDashboard() {
  const [tiles, setTiles] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

  const fetchTiles = () => {
    setLoading(true);
    const token = localStorage.getItem('token');
    if (!token) {
      setError('Please log in to view tiles');
      setLoading(false);
      return;
    }
    fetch(`${API_URL}/api/products`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => {
        if (!res.ok) {
          throw new Error(res.status === 401 ? 'Unauthorized access' : 'Failed to fetch products');
        }
        return res.json();
      })
      .then(data => {
        setTiles(data);
        setError('');
        setLoading(false);
      })
      .catch(err => {
        setError('Error fetching tiles: ' + err.message);
        console.error('Error fetching tiles:', err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchTiles();
  }, []);

  return (
    <div className="container">
      <div className="dashboard-card">
        <h2>Viewer Dashboard 👁️</h2>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <>
            <p>Explore the available tile designs below.</p>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <button onClick={fetchTiles} style={{ marginBottom: '10px' }}>Refresh Tiles</button>
            {tiles.length === 0 && !error ? (
              <p>No tiles available.</p>
            ) : (
              <div className="tile-gallery">
                {tiles.map((tile) => (
                  <div key={tile.prod_id} className="tile">
                    <h3>{tile.prod_name}</h3>
                    <p>SQ Code: {tile.sqcode}</p>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default ViewerDashboard;