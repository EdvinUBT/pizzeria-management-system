import { useState, useEffect } from 'react';
import API from '../services/api';
import { FaPlus, FaEdit, FaTrash, FaTag, FaSearch } from 'react-icons/fa';

const Kuponat = () => {
    const [kuponat, setKuponat] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [currentId, setCurrentId] = useState(null);
    const [formData, setFormData] = useState({
        kodi: '',
        zbritja_perqind: '',
        zbritja_max: '',
        porosi_min: '',
        data_fillimit: '',
        data_skadimit: '',
        perdorimet_max: 1,
        aktiv: true
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        fetchKuponat();
    }, []);

    const fetchKuponat = async () => {
        try {
            const response = await API.get('/kuponat');
            setKuponat(response.data.te_dhena);
        } catch (error) {
            console.error('Gabim:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
        setFormData({ ...formData, [e.target.name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        try {
            if (editMode) {
                await API.put(`/kuponat/${currentId}`, formData);
                setSuccess('Kuponi u perditesua me sukses!');
            } else {
                await API.post('/kuponat', formData);
                setSuccess('Kuponi u krijua me sukses!');
            }
            fetchKuponat();
            resetForm();
        } catch (err) {
            setError(err.response?.data?.mesazhi || err.response?.data?.gabimet?.join(', ') || 'Gabim!');
        }
    };

    const handleEdit = (kupon) => {
        setFormData({
            kodi: kupon.kodi,
            zbritja_perqind: kupon.zbritja_perqind,
            zbritja_max: kupon.zbritja_max || '',
            porosi_min: kupon.porosi_min || '',
            data_fillimit: kupon.data_fillimit ? kupon.data_fillimit.split('T')[0] : '',
            data_skadimit: kupon.data_skadimit ? kupon.data_skadimit.split('T')[0] : '',
            perdorimet_max: kupon.perdorimet_max,
            aktiv: kupon.aktiv
        });
        setCurrentId(kupon.kupon_id);
        setEditMode(true);
        setShowForm(true);
        setError('');
        setSuccess('');
    };

    const handleDelete = async (id) => {
        if (window.confirm('A jeni te sigurt qe doni te fshini kete kupon?')) {
            try {
                await API.delete(`/kuponat/${id}`);
                setSuccess('Kuponi u fshi me sukses!');
                fetchKuponat();
            } catch (err) {
                setError(err.response?.data?.mesazhi || 'Gabim!');
            }
        }
    };

    const resetForm = () => {
        setFormData({ kodi: '', zbritja_perqind: '', zbritja_max: '', porosi_min: '', data_fillimit: '', data_skadimit: '', perdorimet_max: 1, aktiv: true });
        setEditMode(false);
        setCurrentId(null);
        setShowForm(false);
    };

    const isExpired = (date) => {
        return new Date(date) < new Date();
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
                <h2><FaTag className="me-2 text-danger" />Kuponat</h2>
                <button className="btn btn-danger" onClick={() => { if (showForm) { resetForm(); } else { setShowForm(true); setError(''); setSuccess(''); } }}>
                    <FaPlus className="me-1" /> {showForm ? 'Mbyll Formen' : 'Kupon i Ri'}
                </button>
            </div>

            {error && <div className="alert alert-danger">{error}</div>}
            {success && <div className="alert alert-success">{success}</div>}

            {showForm && (
                <div className="card shadow-sm mb-4">
                    <div className="card-body">
                        <h5>{editMode ? 'Perditeso Kuponin' : 'Krijo Kupon te Ri'}</h5>
                        <form onSubmit={handleSubmit}>
                            <div className="row">
                                <div className="col-md-3 mb-3">
                                    <label className="form-label">Kodi i Kuponit</label>
                                    <input type="text" className="form-control" name="kodi" value={formData.kodi} onChange={handleChange} placeholder="p.sh. PIZZA20" required />
                                </div>
                                <div className="col-md-2 mb-3">
                                    <label className="form-label">Zbritja (%)</label>
                                    <input type="number" step="0.01" className="form-control" name="zbritja_perqind" value={formData.zbritja_perqind} onChange={handleChange} required />
                                </div>
                                <div className="col-md-2 mb-3">
                                    <label className="form-label">Zbritja Max (€)</label>
                                    <input type="number" step="0.01" className="form-control" name="zbritja_max" value={formData.zbritja_max} onChange={handleChange} />
                                </div>
                                <div className="col-md-2 mb-3">
                                    <label className="form-label">Porosi Min (€)</label>
                                    <input type="number" step="0.01" className="form-control" name="porosi_min" value={formData.porosi_min} onChange={handleChange} />
                                </div>
                                <div className="col-md-3 mb-3">
                                    <label className="form-label">Perdorime Max</label>
                                    <input type="number" className="form-control" name="perdorimet_max" value={formData.perdorimet_max} onChange={handleChange} />
                                </div>
                                <div className="col-md-3 mb-3">
                                    <label className="form-label">Data Fillimit</label>
                                    <input type="date" className="form-control" name="data_fillimit" value={formData.data_fillimit} onChange={handleChange} required />
                                </div>
                                <div className="col-md-3 mb-3">
                                    <label className="form-label">Data Skadimit</label>
                                    <input type="date" className="form-control" name="data_skadimit" value={formData.data_skadimit} onChange={handleChange} required />
                                </div>
                                <div className="col-md-2 mb-3 d-flex align-items-end">
                                    <div className="form-check">
                                        <input type="checkbox" className="form-check-input" name="aktiv" checked={formData.aktiv} onChange={handleChange} />
                                        <label className="form-check-label">Aktiv</label>
                                    </div>
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
                                <th>Kodi</th>
                                <th>Zbritja</th>
                                <th>Zbritja Max</th>
                                <th>Porosi Min</th>
                                <th>Perdorimet</th>
                                <th>Vlefshmeria</th>
                                <th>Statusi</th>
                                <th>Veprimet</th>
                            </tr>
                        </thead>
                        <tbody>
                            {kuponat.length > 0 ? (
                                kuponat.map((k) => (
                                    <tr key={k.kupon_id}>
                                        <td>{k.kupon_id}</td>
                                        <td><span className="badge bg-dark fs-6">{k.kodi}</span></td>
                                        <td>{k.zbritja_perqind}%</td>
                                        <td>{k.zbritja_max ? `${k.zbritja_max} €` : '-'}</td>
                                        <td>{k.porosi_min ? `${k.porosi_min} €` : '-'}</td>
                                        <td>{k.perdorimet_aktuale} / {k.perdorimet_max}</td>
                                        <td>
                                            {new Date(k.data_fillimit).toLocaleDateString('sq-AL')} - {new Date(k.data_skadimit).toLocaleDateString('sq-AL')}
                                        </td>
                                        <td>
                                            {isExpired(k.data_skadimit) ? (
                                                <span className="badge bg-danger">Skaduar</span>
                                            ) : k.aktiv ? (
                                                <span className="badge bg-success">Aktiv</span>
                                            ) : (
                                                <span className="badge bg-secondary">Joaktiv</span>
                                            )}
                                        </td>
                                        <td>
                                            <button className="btn btn-sm btn-outline-primary me-1" onClick={() => handleEdit(k)}><FaEdit /></button>
                                            <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(k.kupon_id)}><FaTrash /></button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr><td colSpan="9" className="text-center text-muted">Nuk ka kupona ende</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Kuponat;