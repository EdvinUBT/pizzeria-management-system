import { useState, useEffect } from 'react';
import API from '../services/api';
import { FaPlus, FaEdit, FaTrash, FaLeaf, FaSearch, FaExclamationTriangle } from 'react-icons/fa';

const Perberesit = () => {
    const [perberesit, setPerberesit] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [currentId, setCurrentId] = useState(null);
    const [search, setSearch] = useState('');
    const [formData, setFormData] = useState({
        emri_perberesit: '',
        njesia_matese: '',
        sasia_stok: '',
        cmimi_shtese: '',
        alergjene: ''
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        fetchPerberesit();
    }, []);

    const fetchPerberesit = async () => {
        try {
            const response = await API.get('/perberesit');
            setPerberesit(response.data.te_dhena);
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
                await API.put(`/perberesit/${currentId}`, formData);
                setSuccess('Perberesi u perditesua me sukses!');
            } else {
                await API.post('/perberesit', formData);
                setSuccess('Perberesi u krijua me sukses!');
            }
            fetchPerberesit();
            resetForm();
        } catch (err) {
            setError(err.response?.data?.mesazhi || 'Gabim!');
        }
    };

    const handleEdit = (perberes) => {
        setFormData({
            emri_perberesit: perberes.emri_perberesit,
            njesia_matese: perberes.njesia_matese || '',
            sasia_stok: perberes.sasia_stok || '',
            cmimi_shtese: perberes.cmimi_shtese || '',
            alergjene: perberes.alergjene || ''
        });
        setCurrentId(perberes.perberes_id);
        setEditMode(true);
        setShowForm(true);
        setError('');
        setSuccess('');
    };

    const handleDelete = async (id) => {
        if (window.confirm('A jeni te sigurt qe doni te fshini kete perberes?')) {
            try {
                await API.delete(`/perberesit/${id}`);
                setSuccess('Perberesi u fshi me sukses!');
                fetchPerberesit();
            } catch (err) {
                setError(err.response?.data?.mesazhi || 'Gabim!');
            }
        }
    };

    const resetForm = () => {
        setFormData({ emri_perberesit: '', njesia_matese: '', sasia_stok: '', cmimi_shtese: '', alergjene: '' });
        setEditMode(false);
        setCurrentId(null);
        setShowForm(false);
    };

    const filteredPerberesit = perberesit.filter(p => {
        return p.emri_perberesit.toLowerCase().includes(search.toLowerCase()) ||
            (p.alergjene && p.alergjene.toLowerCase().includes(search.toLowerCase()));
    });

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
                <h2><FaLeaf className="me-2 text-success" />Perberesit</h2>
                <button className="btn btn-danger" onClick={() => { if (showForm) { resetForm(); } else { setShowForm(true); setError(''); setSuccess(''); } }}>
                    <FaPlus className="me-1" /> {showForm ? 'Mbyll Formen' : 'Shto Perberes'}
                </button>
            </div>

            {error && <div className="alert alert-danger">{error}</div>}
            {success && <div className="alert alert-success">{success}</div>}

            {showForm && (
                <div className="card shadow-sm mb-4">
                    <div className="card-body">
                        <h5>{editMode ? 'Perditeso Perberesin' : 'Shto Perberes te Ri'}</h5>
                        <form onSubmit={handleSubmit}>
                            <div className="row">
                                <div className="col-md-3 mb-3">
                                    <label className="form-label">Emri i Perberesit</label>
                                    <input type="text" className="form-control" name="emri_perberesit" value={formData.emri_perberesit} onChange={handleChange} required />
                                </div>
                                <div className="col-md-2 mb-3">
                                    <label className="form-label">Njesia Matese</label>
                                    <select className="form-select" name="njesia_matese" value={formData.njesia_matese} onChange={handleChange}>
                                        <option value="">Zgjidh</option>
                                        <option value="gr">Gram (gr)</option>
                                        <option value="kg">Kilogram (kg)</option>
                                        <option value="ml">Mililiter (ml)</option>
                                        <option value="l">Liter (l)</option>
                                        <option value="cope">Cope</option>
                                    </select>
                                </div>
                                <div className="col-md-2 mb-3">
                                    <label className="form-label">Sasia ne Stok</label>
                                    <input type="number" step="0.01" className="form-control" name="sasia_stok" value={formData.sasia_stok} onChange={handleChange} />
                                </div>
                                <div className="col-md-2 mb-3">
                                    <label className="form-label">Cmimi Shtese (€)</label>
                                    <input type="number" step="0.01" className="form-control" name="cmimi_shtese" value={formData.cmimi_shtese} onChange={handleChange} />
                                </div>
                                <div className="col-md-3 mb-3">
                                    <label className="form-label">Alergjene</label>
                                    <input type="text" className="form-control" name="alergjene" value={formData.alergjene} onChange={handleChange} placeholder="p.sh. Gluten, Qumesht" />
                                </div>
                            </div>
                            <button type="submit" className="btn btn-danger me-2">{editMode ? 'Perditeso' : 'Ruaj'}</button>
                            <button type="button" className="btn btn-secondary" onClick={resetForm}>Anulo</button>
                        </form>
                    </div>
                </div>
            )}

            <div className="row mb-3">
                <div className="col-md-4">
                    <div className="input-group">
                        <span className="input-group-text"><FaSearch /></span>
                        <input type="text" className="form-control" placeholder="Kerko perberes ose alergjen..." value={search} onChange={(e) => setSearch(e.target.value)} />
                    </div>
                </div>
            </div>

            <div className="card shadow-sm">
                <div className="card-body">
                    <table className="table table-hover">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Emri</th>
                                <th>Njesia</th>
                                <th>Stoku</th>
                                <th>Cmimi Shtese</th>
                                <th>Alergjene</th>
                                <th>Veprimet</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredPerberesit.length > 0 ? (
                                filteredPerberesit.map((p) => (
                                    <tr key={p.perberes_id}>
                                        <td>{p.perberes_id}</td>
                                        <td>{p.emri_perberesit}</td>
                                        <td>{p.njesia_matese || '-'}</td>
                                        <td>
                                            <span className={`fw-bold ${p.sasia_stok < 10 ? 'text-danger' : 'text-success'}`}>
                                                {p.sasia_stok} {p.njesia_matese}
                                                {p.sasia_stok < 10 && <FaExclamationTriangle className="ms-1 text-danger" title="Stok i ulet!" />}
                                            </span>
                                        </td>
                                        <td>{p.cmimi_shtese > 0 ? `${p.cmimi_shtese} €` : '-'}</td>
                                        <td>
                                            {p.alergjene ? (
                                                p.alergjene.split(',').map((a, i) => (
                                                    <span key={i} className="badge bg-warning text-dark me-1">{a.trim()}</span>
                                                ))
                                            ) : '-'}
                                        </td>
                                        <td>
                                            <button className="btn btn-sm btn-outline-primary me-1" onClick={() => handleEdit(p)}><FaEdit /></button>
                                            <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(p.perberes_id)}><FaTrash /></button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr><td colSpan="7" className="text-center text-muted">Nuk ka perberese ende</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Perberesit;