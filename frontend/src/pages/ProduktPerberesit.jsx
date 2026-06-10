import { useState, useEffect } from 'react';
import API from '../services/api';
import { FaPlus, FaTrash, FaLink, FaPizzaSlice, FaLeaf } from 'react-icons/fa';

const ProduktPerberesit = () => {
    const [produktet, setProduktet] = useState([]);
    const [perberesit, setPerberesit] = useState([]);
    const [selectedProdukt, setSelectedProdukt] = useState(null);
    const [produktPerberesit, setProduktPerberesit] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        perberes_id: '',
        sasia_standarde: '',
        eshte_opsionale: false
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        fetchProduktet();
        fetchPerberesit();
    }, []);

    const fetchProduktet = async () => {
        try {
            const response = await API.get('/produktet');
            setProduktet(response.data.te_dhena);
        } catch (error) {
            console.error('Gabim:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchPerberesit = async () => {
        try {
            const response = await API.get('/perberesit');
            setPerberesit(response.data.te_dhena);
        } catch (error) {
            console.error('Gabim:', error);
        }
    };

    const fetchProduktPerberesit = async (produktId) => {
        try {
            const response = await API.get(`/produkt-perberesit/${produktId}`);
            setProduktPerberesit(response.data.te_dhena);
        } catch (error) {
            console.error('Gabim:', error);
        }
    };

    const handleSelectProdukt = (produkt) => {
        setSelectedProdukt(produkt);
        fetchProduktPerberesit(produkt.produkt_id);
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
            await API.post(`/produkt-perberesit/${selectedProdukt.produkt_id}`, formData);
            setSuccess('Perberesi u shtua ne produkt me sukses!');
            fetchProduktPerberesit(selectedProdukt.produkt_id);
            setFormData({ perberes_id: '', sasia_standarde: '', eshte_opsionale: false });
            setShowForm(false);
        } catch (err) {
            setError(err.response?.data?.mesazhi || 'Gabim!');
        }
    };

    const handleDelete = async (perberesId) => {
        if (window.confirm('A doni te hiqni kete perberes nga produkti?')) {
            try {
                await API.delete(`/produkt-perberesit/${selectedProdukt.produkt_id}/${perberesId}`);
                setSuccess('Perberesi u hoq nga produkti!');
                fetchProduktPerberesit(selectedProdukt.produkt_id);
            } catch (err) {
                setError(err.response?.data?.mesazhi || 'Gabim!');
            }
        }
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
            <h2 className="mb-4"><FaLink className="me-2 text-danger" />Produkt - Perberesit</h2>

            {error && <div className="alert alert-danger">{error}</div>}
            {success && <div className="alert alert-success">{success}</div>}

            <div className="row">
                {/* Lista e produkteve */}
                <div className="col-md-4">
                    <div className="card shadow-sm">
                        <div className="card-header bg-danger text-white">
                            <FaPizzaSlice className="me-2" />Zgjidh Produktin
                        </div>
                        <div className="card-body" style={{ maxHeight: '500px', overflowY: 'auto' }}>
                            {produktet.map((p) => (
                                <div
                                    key={p.produkt_id}
                                    className={`d-flex align-items-center p-2 mb-2 rounded ${selectedProdukt?.produkt_id === p.produkt_id ? 'bg-danger text-white' : 'bg-light'}`}
                                    style={{ cursor: 'pointer' }}
                                    onClick={() => handleSelectProdukt(p)}
                                >
                                    {p.foto_url && (
                                        <img src={p.foto_url} alt={p.emri_produktit} style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '8px', marginRight: '10px' }} />
                                    )}
                                    <div>
                                        <strong>{p.emri_produktit}</strong>
                                        <br />
                                        <small>{p.cmimi_baze} €</small>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Perberesit e produktit */}
                <div className="col-md-8">
                    {selectedProdukt ? (
                        <div className="card shadow-sm">
                            <div className="card-header bg-white d-flex justify-content-between align-items-center">
                                <span className="fw-bold">
                                    <FaLeaf className="me-2 text-success" />
                                    Perberesit e: {selectedProdukt.emri_produktit}
                                </span>
                                <button className="btn btn-sm btn-danger" onClick={() => { if (showForm) { setShowForm(false); } else { setShowForm(true); setError(''); setSuccess(''); } }}>
                                    <FaPlus className="me-1" />{showForm ? 'Mbyll' : 'Shto Perberes'}
                                </button>
                            </div>
                            <div className="card-body">
                                {showForm && (
                                    <form onSubmit={handleSubmit} className="row mb-3 p-3 bg-light rounded">
                                        <div className="col-md-4">
                                            <label className="form-label">Perberesi</label>
                                            <select className="form-select" name="perberes_id" value={formData.perberes_id} onChange={handleChange} required>
                                                <option value="">Zgjidh perberesin</option>
                                                {perberesit.map(p => (
                                                    <option key={p.perberes_id} value={p.perberes_id}>
                                                        {p.emri_perberesit} ({p.njesia_matese})
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="col-md-3">
                                            <label className="form-label">Sasia Standarde</label>
                                            <input type="number" step="0.01" className="form-control" name="sasia_standarde" value={formData.sasia_standarde} onChange={handleChange} />
                                        </div>
                                        <div className="col-md-3 d-flex align-items-end">
                                            <div className="form-check">
                                                <input type="checkbox" className="form-check-input" name="eshte_opsionale" checked={formData.eshte_opsionale} onChange={handleChange} />
                                                <label className="form-check-label">Opsionale</label>
                                            </div>
                                        </div>
                                        <div className="col-md-2 d-flex align-items-end">
                                            <button type="submit" className="btn btn-danger">Shto</button>
                                        </div>
                                    </form>
                                )}

                                <table className="table table-hover">
                                    <thead>
                                        <tr>
                                            <th>Perberesi</th>
                                            <th>Njesia</th>
                                            <th>Sasia</th>
                                            <th>Cmimi Shtese</th>
                                            <th>Lloji</th>
                                            <th>Alergjene</th>
                                            <th>Veprimet</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {produktPerberesit.length > 0 ? (
                                            produktPerberesit.map((pp) => (
                                                <tr key={pp.produkt_perberes_id}>
                                                    <td className="fw-bold">{pp.emri_perberesit}</td>
                                                    <td>{pp.njesia_matese || '-'}</td>
                                                    <td>{pp.sasia_standarde}</td>
                                                    <td>{pp.cmimi_shtese > 0 ? `${pp.cmimi_shtese} €` : '-'}</td>
                                                    <td>
                                                        <span className={`badge ${pp.eshte_opsionale ? 'bg-info' : 'bg-success'}`}>
                                                            {pp.eshte_opsionale ? 'Opsionale' : 'I detyrueshem'}
                                                        </span>
                                                    </td>
                                                    <td>
                                                        {pp.alergjene ? (
                                                            pp.alergjene.split(',').map((a, i) => (
                                                                <span key={i} className="badge bg-warning text-dark me-1">{a.trim()}</span>
                                                            ))
                                                        ) : '-'}
                                                    </td>
                                                    <td>
                                                        <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(pp.perberes_id)}>
                                                            <FaTrash />
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr><td colSpan="7" className="text-center text-muted">Nuk ka perberese per kete produkt</td></tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    ) : (
                        <div className="card shadow-sm">
                            <div className="card-body text-center py-5">
                                <FaPizzaSlice size={60} className="text-muted mb-3" />
                                <h5 className="text-muted">Zgjidhni nje produkt nga lista e majte</h5>
                                <p className="text-muted">per te pare dhe menaxhuar perberesit e tij</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProduktPerberesit;