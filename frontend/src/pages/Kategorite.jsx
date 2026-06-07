import { useState, useEffect } from 'react';
import API from '../services/api';
import { FaPlus, FaEdit, FaTrash, FaList } from 'react-icons/fa';

const Kategorite = () => {
    const [kategorite, setKategorite] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [currentId, setCurrentId] = useState(null);
    const [formData, setFormData] = useState({
        emri_kategorise: '',
        pershkrimi: '',
        renditja: 0,
        aktive: true
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        fetchKategorite();
    }, []);

    const fetchKategorite = async () => {
        try {
            const response = await API.get('/kategorite');
            setKategorite(response.data.te_dhena);
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
                await API.put(`/kategorite/${currentId}`, formData);
                setSuccess('Kategoria u perditesua me sukses!');
            } else {
                await API.post('/kategorite', formData);
                setSuccess('Kategoria u krijua me sukses!');
            }
            fetchKategorite();
            resetForm();
        } catch (err) {
            setError(err.response?.data?.mesazhi || err.response?.data?.gabimet?.join(', ') || 'Gabim!');
        }
    };

    const handleEdit = (kategori) => {
        setFormData({
            emri_kategorise: kategori.emri_kategorise,
            pershkrimi: kategori.pershkrimi || '',
            renditja: kategori.renditja,
            aktive: kategori.aktive
        });
        setCurrentId(kategori.kategori_id);
        setEditMode(true);
        setShowForm(true);
        setError('');
        setSuccess('');
    };

    const handleDelete = async (id) => {
        if (window.confirm('A jeni te sigurt qe doni te fshini kete kategori?')) {
            try {
                await API.delete(`/kategorite/${id}`);
                setSuccess('Kategoria u fshi me sukses!');
                fetchKategorite();
            } catch (err) {
                setError(err.response?.data?.mesazhi || 'Gabim gjate fshirjes!');
            }
        }
    };

    const resetForm = () => {
        setFormData({ emri_kategorise: '', pershkrimi: '', renditja: 0, aktive: true });
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
                <h2><FaList className="me-2 text-danger" />Kategorite</h2>
                <button className="btn btn-danger" onClick={() => { if (showForm) { resetForm(); } else { setShowForm(true); setError(''); setSuccess(''); } }}>
                    <FaPlus className="me-1" /> {showForm ? 'Mbyll Formen' : 'Shto Kategori'}
                </button>
            </div>

            {error && <div className="alert alert-danger">{error}</div>}
            {success && <div className="alert alert-success">{success}</div>}

            {showForm && (
                <div className="card shadow-sm mb-4">
                    <div className="card-body">
                        <h5>{editMode ? 'Perditeso Kategorine' : 'Shto Kategori te Re'}</h5>
                        <form onSubmit={handleSubmit}>
                            <div className="row">
                                <div className="col-md-4 mb-3">
                                    <label className="form-label">Emri i Kategorise</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="emri_kategorise"
                                        value={formData.emri_kategorise}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="col-md-4 mb-3">
                                    <label className="form-label">Pershkrimi</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="pershkrimi"
                                        value={formData.pershkrimi}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="col-md-2 mb-3">
                                    <label className="form-label">Renditja</label>
                                    <input
                                        type="number"
                                        className="form-control"
                                        name="renditja"
                                        value={formData.renditja}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="col-md-2 mb-3 d-flex align-items-end">
                                    <div className="form-check">
                                        <input
                                            type="checkbox"
                                            className="form-check-input"
                                            name="aktive"
                                            checked={formData.aktive}
                                            onChange={handleChange}
                                        />
                                        <label className="form-check-label">Aktive</label>
                                    </div>
                                </div>
                            </div>
                            <button type="submit" className="btn btn-danger me-2">
                                {editMode ? 'Perditeso' : 'Ruaj'}
                            </button>
                            <button type="button" className="btn btn-secondary" onClick={resetForm}>
                                Anulo
                            </button>
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
                                <th>Emri</th>
                                <th>Pershkrimi</th>
                                <th>Renditja</th>
                                <th>Statusi</th>
                                <th>Veprimet</th>
                            </tr>
                        </thead>
                        <tbody>
                            {kategorite.length > 0 ? (
                                kategorite.map((k) => (
                                    <tr key={k.kategori_id}>
                                        <td>{k.kategori_id}</td>
                                        <td>{k.emri_kategorise}</td>
                                        <td>{k.pershkrimi || '-'}</td>
                                        <td>{k.renditja}</td>
                                        <td>
                                            <span className={`badge ${k.aktive ? 'bg-success' : 'bg-secondary'}`}>
                                                {k.aktive ? 'Aktive' : 'Joaktive'}
                                            </span>
                                        </td>
                                        <td>
                                            <button className="btn btn-sm btn-outline-primary me-1" onClick={() => handleEdit(k)}>
                                                <FaEdit />
                                            </button>
                                            <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(k.kategori_id)}>
                                                <FaTrash />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" className="text-center text-muted">Nuk ka kategori ende</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Kategorite;