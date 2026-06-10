import { useState, useEffect } from 'react';
import API from '../services/api';
import { FaPlus, FaEye, FaTrash, FaShoppingCart, FaSearch, FaFilter, FaTimes } from 'react-icons/fa';
import ExportImport from '../components/ExportImport';

const Porosite = () => {
    const [porosite, setPorosite] = useState([]);
    const [klientet, setKlientet] = useState([]);
    const [produktet, setProduktet] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [showDetails, setShowDetails] = useState(null);
    const [showFilters, setShowFilters] = useState(false);
    const [filters, setFilters] = useState({
        search: '',
        statusi: '',
        metoda_pageses: '',
        data_nga: '',
        data_deri: '',
        totali_min: '',
        totali_max: '',
        sort_by: '',
        sort_order: 'desc'
    });
    const [formData, setFormData] = useState({
        klient_id: '',
        metoda_pageses: 'cash',
        adresa_dergeses: '',
        shenimet: '',
        detajet: [{ produkt_id: '', sasia: 1, cmimi_njesi: '' }]
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        fetchKlientet();
        fetchProduktet();
    }, []);

    useEffect(() => {
        const timeout = setTimeout(() => {
            fetchPorosite();
        }, 300);
        return () => clearTimeout(timeout);
    }, [filters]);

    const fetchPorosite = async () => {
        try {
            setLoading(true);
            const params = new URLSearchParams();
            Object.entries(filters).forEach(([key, value]) => {
                if (value !== '' && value !== undefined) params.append(key, value);
            });
            const response = await API.get(`/porosite/search?${params.toString()}`);
            setPorosite(response.data.te_dhena);
        } catch (error) {
            console.error('Gabim:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchKlientet = async () => {
        try {
            const response = await API.get('/klientet');
            setKlientet(response.data.te_dhena);
        } catch (error) {
            console.error('Gabim:', error);
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

    const handleFilterChange = (e) => {
        setFilters({ ...filters, [e.target.name]: e.target.value });
    };

    const clearFilters = () => {
        setFilters({ search: '', statusi: '', metoda_pageses: '', data_nga: '', data_deri: '', totali_min: '', totali_max: '', sort_by: '', sort_order: 'desc' });
    };

    const activeFilterCount = Object.entries(filters).filter(([key, value]) => value !== '' && key !== 'sort_order').length;

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleDetajChange = (index, field, value) => {
        const newDetajet = [...formData.detajet];
        newDetajet[index][field] = value;

        if (field === 'produkt_id') {
            const produkt = produktet.find(p => p.produkt_id === parseInt(value));
            if (produkt) {
                newDetajet[index].cmimi_njesi = produkt.cmimi_baze;
            }
        }

        setFormData({ ...formData, detajet: newDetajet });
    };

    const shtoArtikull = () => {
        setFormData({
            ...formData,
            detajet: [...formData.detajet, { produkt_id: '', sasia: 1, cmimi_njesi: '' }]
        });
    };

    const hiqArtikull = (index) => {
        if (formData.detajet.length > 1) {
            const newDetajet = formData.detajet.filter((_, i) => i !== index);
            setFormData({ ...formData, detajet: newDetajet });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        try {
            await API.post('/porosite', formData);
            setSuccess('Porosia u krijua me sukses!');
            fetchPorosite();
            resetForm();
        } catch (err) {
            setError(err.response?.data?.mesazhi || err.response?.data?.gabimet?.join(', ') || 'Gabim!');
        }
    };

    const handleStatusChange = async (id, statusi) => {
        try {
            await API.put(`/porosite/${id}/statusi`, { statusi });
            setSuccess('Statusi u perditesua!');
            fetchPorosite();
        } catch (err) {
            setError(err.response?.data?.mesazhi || 'Gabim!');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('A jeni te sigurt qe doni te fshini kete porosi?')) {
            try {
                await API.delete(`/porosite/${id}`);
                setSuccess('Porosia u fshi me sukses!');
                fetchPorosite();
            } catch (err) {
                setError(err.response?.data?.mesazhi || 'Gabim!');
            }
        }
    };

    const viewDetails = async (id) => {
        try {
            const response = await API.get(`/porosite/${id}`);
            setShowDetails(response.data.te_dhena);
        } catch (error) {
            console.error('Gabim:', error);
        }
    };

    const resetForm = () => {
        setFormData({
            klient_id: '',
            metoda_pageses: 'cash',
            adresa_dergeses: '',
            shenimet: '',
            detajet: [{ produkt_id: '', sasia: 1, cmimi_njesi: '' }]
        });
        setShowForm(false);
    };

    const getTotalin = () => {
        return formData.detajet.reduce((total, d) => total + (d.sasia * d.cmimi_njesi || 0), 0).toFixed(2);
    };

    const getStatusBadge = (statusi) => {
        const classes = {
            'ne_pritje': 'bg-warning text-dark',
            'ne_pergatitje': 'bg-info',
            'gati': 'bg-primary',
            'ne_dergim': 'bg-primary',
            'dorezuar': 'bg-success',
            'anuluar': 'bg-danger'
        };
        return classes[statusi] || 'bg-secondary';
    };

    return (
        <div className="container-fluid mt-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2><FaShoppingCart className="me-2 text-danger" />Porosite</h2>
                <button className="btn btn-danger" onClick={() => { if (showForm) { resetForm(); } else { setShowForm(true); setError(''); setSuccess(''); } }}>
                    <FaPlus className="me-1" /> {showForm ? 'Mbyll Formen' : 'Porosi e Re'}
                </button>
            </div>

            {error && <div className="alert alert-danger">{error}</div>}
            {success && <div className="alert alert-success">{success}</div>}

            {showForm && (
                <div className="card shadow-sm mb-4">
                    <div className="card-body">
                        <h5>Krijo Porosi te Re</h5>
                        <form onSubmit={handleSubmit}>
                            <div className="row mb-3">
                                <div className="col-md-3">
                                    <label className="form-label">Klienti</label>
                                    <select className="form-select" name="klient_id" value={formData.klient_id} onChange={handleChange} required>
                                        <option value="">Zgjidh klientin</option>
                                        {klientet.map(k => (
                                            <option key={k.klient_id} value={k.klient_id}>{k.emri} {k.mbiemri}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="col-md-3">
                                    <label className="form-label">Metoda e Pageses</label>
                                    <select className="form-select" name="metoda_pageses" value={formData.metoda_pageses} onChange={handleChange}>
                                        <option value="cash">Cash</option>
                                        <option value="karte">Karte</option>
                                        <option value="online">Online</option>
                                    </select>
                                </div>
                                <div className="col-md-3">
                                    <label className="form-label">Adresa e Dergeses</label>
                                    <input type="text" className="form-control" name="adresa_dergeses" value={formData.adresa_dergeses} onChange={handleChange} />
                                </div>
                                <div className="col-md-3">
                                    <label className="form-label">Shenimet</label>
                                    <input type="text" className="form-control" name="shenimet" value={formData.shenimet} onChange={handleChange} />
                                </div>
                            </div>

                            <h6>Artikujt e Porosise</h6>
                            {formData.detajet.map((d, index) => (
                                <div className="row mb-2" key={index}>
                                    <div className="col-md-4">
                                        <select className="form-select" value={d.produkt_id} onChange={(e) => handleDetajChange(index, 'produkt_id', e.target.value)} required>
                                            <option value="">Zgjidh produktin</option>
                                            {produktet.map(p => (
                                                <option key={p.produkt_id} value={p.produkt_id}>{p.emri_produktit} - {p.cmimi_baze}€</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="col-md-2">
                                        <input type="number" className="form-control" placeholder="Sasia" value={d.sasia} onChange={(e) => handleDetajChange(index, 'sasia', e.target.value)} min="1" required />
                                    </div>
                                    <div className="col-md-2">
                                        <input type="number" step="0.01" className="form-control" placeholder="Cmimi" value={d.cmimi_njesi} onChange={(e) => handleDetajChange(index, 'cmimi_njesi', e.target.value)} required />
                                    </div>
                                    <div className="col-md-2">
                                        <span className="form-control bg-light">{(d.sasia * d.cmimi_njesi || 0).toFixed(2)} €</span>
                                    </div>
                                    <div className="col-md-2">
                                        <button type="button" className="btn btn-outline-danger" onClick={() => hiqArtikull(index)}>Hiq</button>
                                    </div>
                                </div>
                            ))}

                            <button type="button" className="btn btn-outline-secondary btn-sm mb-3" onClick={shtoArtikull}>
                                <FaPlus className="me-1" /> Shto Artikull
                            </button>

                            <div className="text-end mb-3">
                                <h5>Totali: <span className="text-danger">{getTotalin()} €</span></h5>
                            </div>

                            <button type="submit" className="btn btn-danger me-2">Krijo Porosine</button>
                            <button type="button" className="btn btn-secondary" onClick={resetForm}>Anulo</button>
                        </form>
                    </div>
                </div>
            )}

            {showDetails && (
                <div className="card shadow-sm mb-4 border-primary">
                    <div className="card-header bg-primary text-white d-flex justify-content-between">
                        <span>Detajet e Porosise #{showDetails.porosi_id}</span>
                        <button className="btn btn-sm btn-light" onClick={() => setShowDetails(null)}>Mbyll</button>
                    </div>
                    <div className="card-body">
                        <div className="row mb-3">
                            <div className="col-md-3"><strong>Klienti:</strong> {showDetails.emri} {showDetails.mbiemri}</div>
                            <div className="col-md-3"><strong>Totali:</strong> {showDetails.totali} €</div>
                            <div className="col-md-3"><strong>Statusi:</strong> <span className={`badge ${getStatusBadge(showDetails.statusi)}`}>{showDetails.statusi.replace('_', ' ')}</span></div>
                            <div className="col-md-3"><strong>Pagesa:</strong> {showDetails.metoda_pageses}</div>
                        </div>
                        {showDetails.shenimet && (
                            <div className="alert alert-warning py-2 mb-3">
                                <strong>Shenimet e klientit:</strong> {showDetails.shenimet}
                            </div>
                        )}
                        <table className="table table-sm">
                            <thead>
                                <tr><th>Produkti</th><th>Sasia</th><th>Cmimi</th><th>Nentotali</th><th>Personalizimi</th></tr>
                            </thead>
                            <tbody>
                                {showDetails.detajet?.map((d, i) => (
                                    <tr key={i}>
                                        <td>{d.emri_produktit}</td>
                                        <td>{d.sasia}</td>
                                        <td>{d.cmimi_njesi} €</td>
                                        <td>{d.nentotali} €</td>
                                        <td>{d.personalizimi || <span className="text-muted">—</span>}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            <ExportImport entity="porosite" entityLabel="Porosite" onImportSuccess={fetchPorosite} />

            {/* Kerkim i Avancuar */}
            <div className="card shadow-sm mb-3">
                <div className="card-body pb-2">
                    <div className="row align-items-center">
                        <div className="col-md-4">
                            <div className="input-group">
                                <span className="input-group-text"><FaSearch /></span>
                                <input type="text" className="form-control" placeholder="Kerko sipas klientit..." name="search" value={filters.search} onChange={handleFilterChange} />
                            </div>
                        </div>
                        <div className="col-md-2">
                            <select className="form-select" name="statusi" value={filters.statusi} onChange={handleFilterChange}>
                                <option value="">Te gjitha statuset</option>
                                <option value="ne_pritje">Ne Pritje</option>
                                <option value="ne_pergatitje">Ne Pergatitje</option>
                                <option value="gati">Gati</option>
                                <option value="ne_dergim">Ne Dergim</option>
                                <option value="dorezuar">Dorezuar</option>
                                <option value="anuluar">Anuluar</option>
                            </select>
                        </div>
                        <div className="col-md-2">
                            <select className="form-select" name="sort_by" value={filters.sort_by} onChange={handleFilterChange}>
                                <option value="">Rendit sipas...</option>
                                <option value="data">Data</option>
                                <option value="totali">Totali</option>
                                <option value="statusi">Statusi</option>
                                <option value="klienti">Klienti</option>
                            </select>
                        </div>
                        <div className="col-md-2 d-flex gap-1">
                            <button className={`btn btn-sm ${filters.sort_order === 'asc' ? 'btn-dark' : 'btn-outline-dark'}`} onClick={() => setFilters({ ...filters, sort_order: 'asc' })}>↑</button>
                            <button className={`btn btn-sm ${filters.sort_order === 'desc' ? 'btn-dark' : 'btn-outline-dark'}`} onClick={() => setFilters({ ...filters, sort_order: 'desc' })}>↓</button>
                            <button className={`btn btn-sm ${showFilters ? 'btn-warning' : 'btn-outline-warning'}`} onClick={() => setShowFilters(!showFilters)}>
                                <FaFilter /> {activeFilterCount > 0 && <span className="badge bg-danger ms-1">{activeFilterCount}</span>}
                            </button>
                            {activeFilterCount > 0 && (
                                <button className="btn btn-sm btn-outline-secondary" onClick={clearFilters}><FaTimes /></button>
                            )}
                        </div>
                    </div>

                    {showFilters && (
                        <div className="row mt-3 pt-3 border-top">
                            <div className="col-md-2 mb-2">
                                <label className="form-label small">Metoda Pageses</label>
                                <select className="form-select form-select-sm" name="metoda_pageses" value={filters.metoda_pageses} onChange={handleFilterChange}>
                                    <option value="">Te gjitha</option>
                                    <option value="cash">Cash</option>
                                    <option value="karte">Karte</option>
                                    <option value="online">Online</option>
                                </select>
                            </div>
                            <div className="col-md-2 mb-2">
                                <label className="form-label small">Data Nga</label>
                                <input type="date" className="form-control form-control-sm" name="data_nga" value={filters.data_nga} onChange={handleFilterChange} />
                            </div>
                            <div className="col-md-2 mb-2">
                                <label className="form-label small">Data Deri</label>
                                <input type="date" className="form-control form-control-sm" name="data_deri" value={filters.data_deri} onChange={handleFilterChange} />
                            </div>
                            <div className="col-md-2 mb-2">
                                <label className="form-label small">Totali Min (€)</label>
                                <input type="number" step="0.01" className="form-control form-control-sm" name="totali_min" value={filters.totali_min} onChange={handleFilterChange} />
                            </div>
                            <div className="col-md-2 mb-2">
                                <label className="form-label small">Totali Max (€)</label>
                                <input type="number" step="0.01" className="form-control form-control-sm" name="totali_max" value={filters.totali_max} onChange={handleFilterChange} />
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <div className="d-flex justify-content-between align-items-center mb-2">
                <small className="text-muted">{porosite.length} porosi te gjetura</small>
            </div>

            <div className="card shadow-sm">
                <div className="card-body">
                    {loading ? (
                        <div className="text-center py-4">
                            <div className="spinner-border text-danger" role="status">
                                <span className="visually-hidden">Duke u ngarkuar...</span>
                            </div>
                        </div>
                    ) : (
                        <table className="table table-hover">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Klienti</th>
                                    <th>Data</th>
                                    <th>Totali</th>
                                    <th>Pagesa</th>
                                    <th>Statusi</th>
                                    <th>Veprimet</th>
                                </tr>
                            </thead>
                            <tbody>
                                {porosite.length > 0 ? (
                                    porosite.map((p) => (
                                        <tr key={p.porosi_id}>
                                            <td>#{p.porosi_id}</td>
                                            <td>{p.emri} {p.mbiemri}</td>
                                            <td>{new Date(p.data_porosise).toLocaleDateString('sq-AL')}</td>
                                            <td>{p.totali} €</td>
                                            <td>{p.metoda_pageses}</td>
                                            <td>
                                                <select className="form-select form-select-sm" style={{ width: '140px' }} value={p.statusi} onChange={(e) => handleStatusChange(p.porosi_id, e.target.value)}>
                                                    <option value="ne_pritje">Ne Pritje</option>
                                                    <option value="ne_pergatitje">Ne Pergatitje</option>
                                                    <option value="gati">Gati</option>
                                                    <option value="ne_dergim">Ne Dergim</option>
                                                    <option value="dorezuar">Dorezuar</option>
                                                    <option value="anuluar">Anuluar</option>
                                                </select>
                                            </td>
                                            <td>
                                                <button className="btn btn-sm btn-outline-info me-1" onClick={() => viewDetails(p.porosi_id)}><FaEye /></button>
                                                <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(p.porosi_id)}><FaTrash /></button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr><td colSpan="7" className="text-center text-muted">Nuk ka porosi te gjetura</td></tr>
                                )}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Porosite;