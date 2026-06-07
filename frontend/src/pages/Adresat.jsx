import { useState, useEffect } from 'react';
import API from '../services/api';
import { FaPlus, FaEdit, FaTrash, FaMapMarkerAlt, FaSearch, FaStar } from 'react-icons/fa';

const Adresat = () => {
    const [klientet, setKlientet] = useState([]);
    const [selectedKlient, setSelectedKlient] = useState(null);
    const [adresat, setAdresat] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [currentId, setCurrentId] = useState(null);
    const [search, setSearch] = useState('');
    const [formData, setFormData] = useState({
        klient_id: '',
        emertimi: '',
        adresa: '',
        qyteti: '',
        kodi_postar: '',
        eshte_default: false
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        fetchKlientet();
    }, []);

    const fetchKlientet = async () => {
        try {
            const response = await API.get('/klientet');
            setKlientet(response.data.te_dhena);
        } catch (error) {
            console.error('Gabim:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchAdresat = async (klientId) => {
        try {
            const response = await API.get(`/adresat/${klientId}`);
            setAdresat(response.data.te_dhena);
        } catch (error) {
            console.error('Gabim:', error);
        }
    };

    const handleSelectKlient = (klient) => {
        setSelectedKlient(klient);
        fetchAdresat(klient.klient_id);
        setShowForm(false);
        setError('');
        setSuccess('');
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
            const data = { ...formData, klient_id: selectedKlient.klient_id };
            if (editMode) {
                await API.put(`/adresat/${currentId}`, data);
                setSuccess('Adresa u perditesua me sukses!');
            } else {
                await API.post('/adresat', data);
                setSuccess('Adresa u shtua me sukses!');
            }
            fetchAdresat(selectedKlient.klient_id);
            resetForm();
        } catch (err) {
            setError(err.response?.data?.mesazhi || 'Gabim!');
        }
    };

    const handleEdit = (adrese) => {
        setFormData({
            klient_id: adrese.klient_id,
            emertimi: adrese.emertimi,
            adresa: adrese.adresa,
            qyteti: adrese.qyteti || '',
            kodi_postar: adrese.kodi_postar || '',
            eshte_default: adrese.eshte_default
        });
        setCurrentId(adrese.adrese_id);
        setEditMode(true);
        setShowForm(true);
        setError('');
        setSuccess('');
    };

    const handleDelete = async (id) => {
        if (window.confirm('A jeni te sigurt qe doni te fshini kete adrese?')) {
            try {
                await API.delete(`/adresat/${id}`);
                setSuccess('Adresa u fshi me sukses!');
                fetchAdresat(selectedKlient.klient_id);
            } catch (err) {
                setError(err.response?.data?.mesazhi || 'Gabim!');
            }
        }
    };

    const resetForm = () => {
        setFormData({ klient_id: '', emertimi: '', adresa: '', qyteti: '', kodi_postar: '', eshte_default: false });
        setEditMode(false);
        setCurrentId(null);
        setShowForm(false);
    };

    const filteredKlientet = klientet.filter(k => {
        return k.emri.toLowerCase().includes(search.toLowerCase()) ||
            k.mbiemri.toLowerCase().includes(search.toLowerCase());
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
            <h2 className="mb-4"><FaMapMarkerAlt className="me-2 text-danger" />Adresat e Klienteve</h2>

            {error && <div className="alert alert-danger">{error}</div>}
            {success && <div className="alert alert-success">{success}</div>}

            <div className="row">
                {/* Lista e klienteve */}
                <div className="col-md-4">
                    <div className="card shadow-sm">
                        <div className="card-header bg-danger text-white">
                            Zgjidh Klientin
                        </div>
                        <div className="card-body">
                            <div className="input-group mb-3">
                                <span className="input-group-text"><FaSearch /></span>
                                <input type="text" className="form-control" placeholder="Kerko klient..." value={search} onChange={(e) => setSearch(e.target.value)} />
                            </div>
                            <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                                {filteredKlientet.map((k) => (
                                    <div
                                        key={k.klient_id}
                                        className={`p-2 mb-2 rounded ${selectedKlient?.klient_id === k.klient_id ? 'bg-danger text-white' : 'bg-light'}`}
                                        style={{ cursor: 'pointer' }}
                                        onClick={() => handleSelectKlient(k)}
                                    >
                                        <strong>{k.emri} {k.mbiemri}</strong>
                                        <br />
                                        <small>{k.email}</small>
                                    </div>
                                ))}
                                {filteredKlientet.length === 0 && (
                                    <p className="text-muted text-center">Nuk ka kliente</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Adresat */}
                <div className="col-md-8">
                    {selectedKlient ? (
                        <div className="card shadow-sm">
                            <div className="card-header bg-white d-flex justify-content-between align-items-center">
                                <span className="fw-bold">
                                    <FaMapMarkerAlt className="me-2 text-danger" />
                                    Adresat e: {selectedKlient.emri} {selectedKlient.mbiemri}
                                </span>
                                <button className="btn btn-sm btn-danger" onClick={() => { if (showForm) { resetForm(); } else { setShowForm(true); setError(''); setSuccess(''); } }}>
                                    <FaPlus className="me-1" />{showForm ? 'Mbyll' : 'Shto Adrese'}
                                </button>
                            </div>
                            <div className="card-body">
                                {showForm && (
                                    <form onSubmit={handleSubmit} className="p-3 mb-3 bg-light rounded">
                                        <h6>{editMode ? 'Perditeso Adresen' : 'Shto Adrese te Re'}</h6>
                                        <div className="row">
                                            <div className="col-md-4 mb-3">
                                                <label className="form-label">Emertimi</label>
                                                <input type="text" className="form-control" name="emertimi" value={formData.emertimi} onChange={handleChange} placeholder="p.sh. Shtepia, Zyra" required />
                                            </div>
                                            <div className="col-md-8 mb-3">
                                                <label className="form-label">Adresa</label>
                                                <input type="text" className="form-control" name="adresa" value={formData.adresa} onChange={handleChange} required />
                                            </div>
                                            <div className="col-md-4 mb-3">
                                                <label className="form-label">Qyteti</label>
                                                <input type="text" className="form-control" name="qyteti" value={formData.qyteti} onChange={handleChange} />
                                            </div>
                                            <div className="col-md-4 mb-3">
                                                <label className="form-label">Kodi Postar</label>
                                                <input type="text" className="form-control" name="kodi_postar" value={formData.kodi_postar} onChange={handleChange} />
                                            </div>
                                            <div className="col-md-4 mb-3 d-flex align-items-end">
                                                <div className="form-check">
                                                    <input type="checkbox" className="form-check-input" name="eshte_default" checked={formData.eshte_default} onChange={handleChange} />
                                                    <label className="form-check-label">Adresa Kryesore</label>
                                                </div>
                                            </div>
                                        </div>
                                        <button type="submit" className="btn btn-danger me-2">{editMode ? 'Perditeso' : 'Ruaj'}</button>
                                        <button type="button" className="btn btn-secondary" onClick={resetForm}>Anulo</button>
                                    </form>
                                )}

                                {adresat.length > 0 ? (
                                    <div className="row">
                                        {adresat.map((a) => (
                                            <div key={a.adrese_id} className="col-md-6 mb-3">
                                                <div className={`card h-100 ${a.eshte_default ? 'border-danger' : ''}`}>
                                                    <div className="card-body">
                                                        <div className="d-flex justify-content-between align-items-start">
                                                            <h6 className="fw-bold">
                                                                <FaMapMarkerAlt className="me-1 text-danger" />
                                                                {a.emertimi}
                                                                {a.eshte_default && <FaStar className="ms-2 text-warning" title="Adresa kryesore" />}
                                                            </h6>
                                                            <div>
                                                                <button className="btn btn-sm btn-outline-primary me-1" onClick={() => handleEdit(a)}><FaEdit /></button>
                                                                <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(a.adrese_id)}><FaTrash /></button>
                                                            </div>
                                                        </div>
                                                        <p className="mb-1">{a.adresa}</p>
                                                        {a.qyteti && <p className="mb-1 text-muted">{a.qyteti}</p>}
                                                        {a.kodi_postar && <p className="mb-0 text-muted">Kodi: {a.kodi_postar}</p>}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-muted text-center py-4">Nuk ka adresa per kete klient</p>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="card shadow-sm">
                            <div className="card-body text-center py-5">
                                <FaMapMarkerAlt size={60} className="text-muted mb-3" />
                                <h5 className="text-muted">Zgjidhni nje klient nga lista e majte</h5>
                                <p className="text-muted">per te pare dhe menaxhuar adresat e tij</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Adresat;