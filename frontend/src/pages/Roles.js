import { useState, useEffect } from 'react';
import API from '../services/api';
import { FaPlus, FaEdit, FaTrash, FaShieldAlt } from 'react-icons/fa';

const Roles = () => {
    const [roles, setRoles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [currentId, setCurrentId] = useState(null);
    const [formData, setFormData] = useState({
        emertimi: '',
        pershkrimi: ''
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        fetchRoles();
    }, []);

    const fetchRoles = async () => {
        try {
            const response = await API.get('/roles');
            setRoles(response.data.te_dhena);
        } catch (error) {
            console.error('Gabim:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        try {
            if (editMode) {
                await API.put(`/roles/${currentId}`, formData);
                setSuccess('Roli u perditesua me sukses!');
            } else {
                await API.post('/roles', formData);
                setSuccess('Roli u krijua me sukses!');
            }
            fetchRoles();
            resetForm();
        } catch (err) {
            setError(err.response?.data?.mesazhi || 'Gabim!');
        }
    };

    const handleEdit = (role) => {
        setFormData({
            emertimi: role.emertimi,
            pershkrimi: role.pershkrimi || ''
        });
        setCurrentId(role.id);
        setEditMode(true);
        setShowForm(true);
        setError('');
        setSuccess('');
    };

    const handleDelete = async (id) => {
        if (window.confirm('A jeni te sigurt qe doni te fshini kete rol?')) {
            try {
                await API.delete(`/roles/${id}`);
                setSuccess('Roli u fshi me sukses!');
                fetchRoles();
            } catch (err) {
                setError(err.response?.data?.mesazhi || 'Gabim!');
            }
        }
    };

    const resetForm = () => {
        setFormData({ emertimi: '', pershkrimi: '' });
        setEditMode(false);
        setCurrentId(null);
        setShowForm(false);
    };

    if (loading) {
        return (
            <div className="d-flex justify-content-center mt-5">
                <div className="spinner-border text-danger" role="status">
                    <span className="visually-hidden">Duke u ngarkuar...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="container-fluid mt-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2><FaShieldAlt className="me-2 text-danger" />Rolet</h2>
                <button className="btn btn-danger" onClick={() => { setShowForm(!showForm); resetForm(); }}>
                    <FaPlus className="me-1" /> {showForm ? 'Mbyll Formen' : 'Rol i Ri'}
                </button>
            </div>

            {error && <div className="alert alert-danger">{error}</div>}
            {success && <div className="alert alert-success">{success}</div>}

            {showForm && (
                <div className="card shadow-sm mb-4">
                    <div className="card-body">
                        <h5>{editMode ? 'Perditeso Rolin' : 'Krijo Rol te Ri'}</h5>
                        <form onSubmit={handleSubmit}>
                            <div className="row">
                                <div className="col-md-4 mb-3">
                                    <label className="form-label">Emertimi</label>
                                    <input type="text" className="form-control" name="emertimi" value={formData.emertimi} onChange={handleChange} required />
                                </div>
                                <div className="col-md-8 mb-3">
                                    <label className="form-label">Pershkrimi</label>
                                    <input type="text" className="form-control" name="pershkrimi" value={formData.pershkrimi} onChange={handleChange} />
                                </div>
                            </div>
                            <button type="submit" className="btn btn-danger me-2">{editMode ? 'Perditeso' : 'Ruaj'}</button>
                            <button type="button" className="btn btn-secondary" onClick={resetForm}>Anulo</button>
                        </form>
                    </div>
                </div>
            )}

            <div className="card shadow-sm">
                <div className="card-body">
                    <table className="table table-hover">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Emertimi</th>
                                <th>Pershkrimi</th>
                                <th>Normalized Name</th>
                                <th>Veprimet</th>
                            </tr>
                        </thead>
                        <tbody>
                            {roles.length > 0 ? (
                                roles.map((r) => (
                                    <tr key={r.id}>
                                        <td>{r.id}</td>
                                        <td><span className="badge bg-info fs-6">{r.emertimi}</span></td>
                                        <td>{r.pershkrimi || '-'}</td>
                                        <td>{r.normalized_name}</td>
                                        <td>
                                            <button className="btn btn-sm btn-outline-primary me-1" onClick={() => handleEdit(r)}><FaEdit /></button>
                                            <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(r.id)}><FaTrash /></button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr><td colSpan="5" className="text-center text-muted">Nuk ka role ende</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Roles;