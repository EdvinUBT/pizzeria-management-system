import { useState, useEffect } from 'react';
import API from '../services/api';
import { FaPlus, FaEdit, FaTrash, FaUtensils, FaEye } from 'react-icons/fa';

const Menyte = () => {
    const [menyte, setMenyte] = useState([]);
    const [produktet, setProduktet] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [currentId, setCurrentId] = useState(null);
    const [showDetails, setShowDetails] = useState(null);
    const [showProduktForm, setShowProduktForm] = useState(null);
    const [produktFormData, setProduktFormData] = useState({ produkt_id: '', cmimi_special: '', renditja: 0 });
    const [formData, setFormData] = useState({
        emri_menys: '',
        pershkrimi: '',
        data_fillimit: '',
        data_mbarimit: '',
        aktive: true
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        fetchMenyte();
        fetchProduktet();
    }, []);

    const fetchMenyte = async () => {
        try {
            const response = await API.get('/menyte');
            setMenyte(response.data.te_dhena);
        } catch (error) {
            console.error('Gabim:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchProduktet = async () => {
        try {
            const response = await API.get('/produktet');
            setProduktet(response.data.te_dhena);
        } catch (error) {
            console.error('Gabim:', error);
        }
    };

    const viewDetails = async (id) => {
        try {
            const response = await API.get(`/menyte/${id}`);
            setShowDetails(response.data.te_dhena);
        } catch (error) {
            console.error('Gabim:', error);
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
                await API.put(`/menyte/${currentId}`, formData);
                setSuccess('Menyja u perditesua me sukses!');
            } else {
                await API.post('/menyte', formData);
                setSuccess('Menyja u krijua me sukses!');
            }
            fetchMenyte();
            resetForm();
        } catch (err) {
            setError(err.response?.data?.mesazhi || 'Gabim!');
        }
    };

    const handleEdit = (meny) => {
        setFormData({
            emri_menys: meny.emri_menys,
            pershkrimi: meny.pershkrimi || '',
            data_fillimit: meny.data_fillimit ? meny.data_fillimit.split('T')[0] : '',
            data_mbarimit: meny.data_mbarimit ? meny.data_mbarimit.split('T')[0] : '',
            aktive: meny.aktive
        });
        setCurrentId(meny.meny_id);
        setEditMode(true);
        setShowForm(true);
        setError('');
        setSuccess('');
    };

    const handleDelete = async (id) => {
        if (window.confirm('A jeni te sigurt qe doni te fshini kete meny?')) {
            try {
                await API.delete(`/menyte/${id}`);
                setSuccess('Menyja u fshi me sukses!');
                fetchMenyte();
            } catch (err) {
                setError(err.response?.data?.mesazhi || 'Gabim!');
            }
        }
    };

    const handleShtoProdukt = async (e) => {
        e.preventDefault();
        try {
            await API.post(`/menyte/${showProduktForm}/produkt`, produktFormData);
            setSuccess('Produkti u shtua ne meny!');
            viewDetails(showProduktForm);
            setProduktFormData({ produkt_id: '', cmimi_special: '', renditja: 0 });
        } catch (err) {
            setError(err.response?.data?.mesazhi || 'Gabim!');
        }
    };

    const handleHiqProdukt = async (menyId, produktId) => {
        if (window.confirm('A doni te hiqni kete produkt nga menyja?')) {
            try {
                await API.delete(`/menyte/${menyId}/produkt/${produktId}`);
                setSuccess('Produkti u hoq nga menyja!');
                viewDetails(menyId);
            } catch (err) {
                setError(err.response?.data?.mesazhi || 'Gabim!');
            }
        }
    };

    const resetForm = () => {
        setFormData({ emri_menys: '', pershkrimi: '', data_fillimit: '', data_mbarimit: '', aktive: true });
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
                <h2><FaUtensils className="me-2 text-danger" />Menyte</h2>
                <button className="btn btn-danger" onClick={() => { setShowForm(!showForm); resetForm(); }}>
                    <FaPlus className="me-1" /> {showForm ? 'Mbyll Formen' : 'Meny e Re'}
                </button>
            </div>

            {error && <div className="alert alert-danger">{error}</div>}
            {success && <div className="alert alert-success">{success}</div>}

            {showForm && (
                <div className="card shadow-sm mb-4">
                    <div className="card-body">
                        <h5>{editMode ? 'Perditeso Menyne' : 'Krijo Meny te Re'}</h5>
                        <form onSubmit={handleSubmit}>
                            <div className="row">
                                <div className="col-md-3 mb-3">
                                    <label className="form-label">Emri i Menys</label>
                                    <input type="text" className="form-control" name="emri_menys" value={formData.emri_menys} onChange={handleChange} required />
                                </div>
                                <div className="col-md-3 mb-3">
                                    <label className="form-label">Pershkrimi</label>
                                    <input type="text" className="form-control" name="pershkrimi" value={formData.pershkrimi} onChange={handleChange} />
                                </div>
                                <div className="col-md-2 mb-3">
                                    <label className="form-label">Data Fillimit</label>
                                    <input type="date" className="form-control" name="data_fillimit" value={formData.data_fillimit} onChange={handleChange} />
                                </div>
                                <div className="col-md-2 mb-3">
                                    <label className="form-label">Data Mbarimit</label>
                                    <input type="date" className="form-control" name="data_mbarimit" value={formData.data_mbarimit} onChange={handleChange} />
                                </div>
                                <div className="col-md-2 mb-3 d-flex align-items-end">
                                    <div className="form-check">
                                        <input type="checkbox" className="form-check-input" name="aktive" checked={formData.aktive} onChange={handleChange} />
                                        <label className="form-check-label">Aktive</label>
                                    </div>
                                </div>
                            </div>
                            <button type="submit" className="btn btn-danger me-2">{editMode ? 'Perditeso' : 'Ruaj'}</button>
                            <button type="button" className="btn btn-secondary" onClick={resetForm}>Anulo</button>
                        </form>
                    </div>
                </div>
            )}

            {/* Detajet e menys */}
            {showDetails && (
                <div className="card shadow-sm mb-4 border-info">
                    <div className="card-header bg-info text-white d-flex justify-content-between">
                        <span>Menyja: {showDetails.emri_menys}</span>
                        <button className="btn btn-sm btn-light" onClick={() => { setShowDetails(null); setShowProduktForm(null); }}>Mbyll</button>
                    </div>
                    <div className="card-body">
                        <button className="btn btn-sm btn-outline-danger mb-3" onClick={() => setShowProduktForm(showProduktForm ? null : showDetails.meny_id)}>
                            <FaPlus className="me-1" /> Shto Produkt ne Meny
                        </button>

                        {showProduktForm && (
                            <form onSubmit={handleShtoProdukt} className="row mb-3">
                                <div className="col-md-4">
                                    <select className="form-select" value={produktFormData.produkt_id} onChange={(e) => setProduktFormData({ ...produktFormData, produkt_id: e.target.value })} required>
                                        <option value="">Zgjidh produktin</option>
                                        {produktet.map(p => (
                                            <option key={p.produkt_id} value={p.produkt_id}>{p.emri_produktit} - {p.cmimi_baze}€</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="col-md-3">
                                    <input type="number" step="0.01" className="form-control" placeholder="Cmimi special" value={produktFormData.cmimi_special} onChange={(e) => setProduktFormData({ ...produktFormData, cmimi_special: e.target.value })} />
                                </div>
                                <div className="col-md-2">
                                    <input type="number" className="form-control" placeholder="Renditja" value={produktFormData.renditja} onChange={(e) => setProduktFormData({ ...produktFormData, renditja: e.target.value })} />
                                </div>
                                <div className="col-md-3">
                                    <button type="submit" className="btn btn-danger">Shto</button>
                                </div>
                            </form>
                        )}

                        <table className="table table-sm">
                            <thead>
                                <tr><th>Produkti</th><th>Cmimi Baze</th><th>Cmimi Special</th><th>Renditja</th><th>Veprimet</th></tr>
                            </thead>
                            <tbody>
                                {showDetails.produktet?.length > 0 ? (
                                    showDetails.produktet.map((p, i) => (
                                        <tr key={i}>
                                            <td>{p.emri_produktit}</td>
                                            <td>{p.cmimi_baze} €</td>
                                            <td>{p.cmimi_special ? `${p.cmimi_special} €` : '-'}</td>
                                            <td>{p.renditja}</td>
                                            <td>
                                                <button className="btn btn-sm btn-outline-danger" onClick={() => handleHiqProdukt(showDetails.meny_id, p.produkt_id)}><FaTrash /></button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr><td colSpan="5" className="text-center text-muted">Nuk ka produkte ne kete meny</td></tr>
                                )}
                            </tbody>
                        </table>
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
                                <th>Fillimi</th>
                                <th>Mbarimi</th>
                                <th>Statusi</th>
                                <th>Veprimet</th>
                            </tr>
                        </thead>
                        <tbody>
                            {menyte.length > 0 ? (
                                menyte.map((m) => (
                                    <tr key={m.meny_id}>
                                        <td>{m.meny_id}</td>
                                        <td>{m.emri_menys}</td>
                                        <td>{m.pershkrimi || '-'}</td>
                                        <td>{m.data_fillimit ? new Date(m.data_fillimit).toLocaleDateString('sq-AL') : '-'}</td>
                                        <td>{m.data_mbarimit ? new Date(m.data_mbarimit).toLocaleDateString('sq-AL') : '-'}</td>
                                        <td>
                                            <span className={`badge ${m.aktive ? 'bg-success' : 'bg-secondary'}`}>
                                                {m.aktive ? 'Aktive' : 'Joaktive'}
                                            </span>
                                        </td>
                                        <td>
                                            <button className="btn btn-sm btn-outline-info me-1" onClick={() => viewDetails(m.meny_id)}><FaEye /></button>
                                            <button className="btn btn-sm btn-outline-primary me-1" onClick={() => handleEdit(m)}><FaEdit /></button>
                                            <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(m.meny_id)}><FaTrash /></button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr><td colSpan="7" className="text-center text-muted">Nuk ka menyte ende</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Menyte;