import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function AdminDashboard({ user }) {
  const [tiles, setTiles] = useState([]);
  const [prod_name, setProdName] = useState('');
  const [category_id, setCategoryId] = useState('');
  const [application_id, setApplicationId] = useState('');
  const [editId, setEditId] = useState(null);
  const [categories, setCategories] = useState([]);
  const [applications, setApplications] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('Please log in to access the dashboard');
          navigate('/');
          return;
        }
        const [productsRes, categoriesRes, applicationsRes] = await Promise.all([
          fetch(`${API_URL}/api/products`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch(`${API_URL}/api/categories`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch(`${API_URL}/api/applications`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);
        if (!productsRes.ok) throw new Error(`Products fetch failed: ${productsRes.statusText}`);
        if (!categoriesRes.ok) throw new Error(`Categories fetch failed: ${categoriesRes.statusText}`);
        if (!applicationsRes.ok) throw new Error(`Applications fetch failed: ${applicationsRes.statusText}`);
        const products = await productsRes.json();
        const categories = await categoriesRes.json();
        const applications = await applicationsRes.json();
        console.log('Fetched categories:', categories);
        console.log('Fetched applications:', applications);
        setTiles(products);
        setCategories(categories);
        setApplications(applications);
        if (categories.length > 0) setCategoryId(categories[0].category_id.toString());
        if (applications.length > 0) setApplicationId(applications[0].application_id.toString());
        if (categories.length === 0) setError('No categories available in the database');
        if (applications.length === 0) setError('No applications available in the database');
      } catch (err) {
        setError('Error fetching data: ' + err.message);
        console.error('Fetch error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [navigate]);

  const addOrUpdateTile = async () => {
    if (!prod_name.trim()) {
      setError('Product name is required');
      return;
    }
    if (!category_id || isNaN(parseInt(category_id))) {
      setError('Please select a valid category');
      return;
    }
    if (!application_id || isNaN(parseInt(application_id))) {
      setError('Please select a valid application');
      return;
    }

    const newProduct = {
      prod_name: prod_name.trim(),
      sqcode: editId ? tiles.find(t => t.prod_id === editId)?.sqcode : `SQ${Date.now()}`,
      category_id: parseInt(category_id),
      application_id: parseInt(application_id),
      block: 'A',
    };

    console.log('Sending product data:', newProduct);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Session expired. Please log in again');
        navigate('/');
        return;
      }
      let response;
      if (editId) {
        response = await fetch(`${API_URL}/api/products/${editId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(newProduct),
        });
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || `Failed to update product: ${response.statusText}`);
        }
        const updatedTile = await response.json();
        setTiles(tiles.map(t => (t.prod_id === editId ? updatedTile : t)));
        setEditId(null);
      } else {
        response = await fetch(`${API_URL}/api/products`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(newProduct),
        });
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || `Failed to create product: ${response.statusText}`);
        }
        const createdTile = await response.json();
        setTiles([...tiles, createdTile]);
      }
      setProdName('');
      setCategoryId(categories[0]?.category_id.toString() || '');
      setApplicationId(applications[0]?.application_id.toString());
      setError('');
    } catch (err) {
      setError('Error saving product: ' + err.message);
      console.error('Save error:', err);
    }
  };

  const deleteTile = async (prod_id) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Session expired. Please log in again');
        navigate('/');
        return;
      }
      const response = await fetch(`${API_URL}/api/products/${prod_id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Failed to delete product: ${response.statusText}`);
      }
      setTiles(tiles.filter(t => t.prod_id !== prod_id));
      setError('');
    } catch (err) {
      setError('Error deleting product: ' + err.message);
      console.error('Delete error:', err);
    };
  };

  const editTile = (tile) => {
    setProdName(tile.prod_name);
    setCategoryId(tile.category_id.toString());
    setApplicationId(tile.application_id.toString());
    setEditId(tile.prod_id);
    setError('');
  };

  const isFormValid = () => {
    return prod_name.trim() && category_id && !isNaN(parseInt(category_id)) && application_id && !isNaN(parseInt(application_id)) && categories.length > 0 && applications.length > 0;
  };

  return (
    <div className="dashboard">
      <h2>Admin Dashboard</h2>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          {error && <p style={{ color: 'red' }}>{error}</p>}
          <div className="tile-form">
            <input
              type="text"
              value={prod_name}
              onChange={(e) => setProdName(e.target.value)}
              placeholder="Product Name"
            />
            <select
              value={category_id}
              onChange={(e) => setCategoryId(e.target.value)}
              disabled={categories.length === 0}
            >
              <option value="" disabled>Select Category</option>
              {categories.map((category) => (
                <option key={category.category_id} value={category.category_id.toString()}>
                  {category.name}
                </option>
              ))}
            </select>
            <select
              value={application_id}
              onChange={(e) => setApplicationId(e.target.value)}
              disabled={applications.length === 0}
            >
              <option value="" disabled>Select Application</option>
              {applications.map((application) => (
                <option key={application.application_id} value={application.application_id.toString()}>
                  {application.name}
                </option>
              ))}
            </select>
            <button onClick={addOrUpdateTile} disabled={!isFormValid()}>
              {editId ? 'Update Product' : 'Add Product'}
            </button>
          </div>
          <div className="tile-gallery">
            {tiles.map((tile) => (
              <div key={tile.prod_id} className="tile">
                <h3>{tile.prod_name}</h3>
                <p>SQ Code: {tile.sqcode}</p>
                <button onClick={() => editTile(tile)}>Edit</button>
                <button onClick={() => deleteTile(tile.prod_id)}>Delete</button>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default AdminDashboard;