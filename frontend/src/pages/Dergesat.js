import { useState, useEffect } from 'react';
import API from '../services/api';
import { FaPlus, FaTrash, FaTruck, FaSearch } from 'react-icons/fa';

const Dergesat = () => {
    const [dergesat, setDergesat] = useState([]);
    const [porosite, setPorosite] = useState([]);
    const [punonjesit, setPunonjesit] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [filterStatus, setFilterStatus] = useState('');
    const [formData, setFormData] = useState({
        porosi_id: '',
        punonjes_id: '',
        adresa: ''
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        fetchDergesat();
        fetchPorosite();
        fetchPunonjesit();
    }, []);

    const fetchDergesat = async () => {
        try {
            const response = await API.get('/dergesat');
            setDergesat(response.data.te_dhena);
        } catch (error) {
            console.error('Gabim:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchPorosite = async () => {
        try {
            const response = await API.get('/porosite');
            setPorosite(response.data.te_dhena);
        } catch (error) {
            console.error('Gabim:', error);
        }
    };

    const fetchPunonjesit = async () => {
        try {
            const response = await API.get('/punonjesit');
            setPunonjesit(response.data.te_dhena.filter(p => p.roli === 'shofer' && p.aktiv));
        } catch (error) {
            console.error('Gabim:', error);
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
            await API.post('/dergesat', formData);
            setSuccess('Dergesa u krijua me sukses!');
            fetchDergesat();
            fetchPorosite();
            resetForm();
        } catch (err) {
            setError(err.response?.data?.mesazhi || 'Gabim!');
        }
    };

    const handleStatusChange = async (id, statusi) => {
        try {
            await API.put(`/dergesat/${id}/statusi`, { statusi });
            setSuccess('Statusi u perditesua!');
            fetchDergesat();
        } catch (err) {
            setError(err.response?.data?.mesazhi || 'Gabim!');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('A jeni te sigurt qe doni te fshini kete dergese?')) {
            try {
                await API.delete(`/dergesat/${id}`);
                setSuccess('Dergesa u fshi me sukses!');
                fetchDergesat();
            } catch (err) {
                setError(err.response?.data?.mesazhi || 'Gabim!');
            }
        }
    };

    const resetForm = () => {
        setFormData({ porosi_id: '', punonjes_id: '', adresa: '' });
        setShowForm(false);
    };

    const getStatusBadge = (statusi) => {
        const classes = {
            'ne_pritje': 'bg-warning text-dark',
            'ne_rruge': 'bg-primary',
            'dorezuar': 'bg-success',
            'deshtuar': 'bg-danger'
        };
        return classes[statusi] || 'bg-secondary';
    };

    const filteredDergesat = dergesat.filter(d => {
        return filterStatus ? d.statusi === filterStatus : true;
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
                <h2><FaTruck className="me-2 text-danger" />Dergesat</h2>
                <button className="btn btn-danger" onClick={() => { setShowForm(!showForm); resetForm(); }}>
                    <FaPlus className="me-1" /> {showForm ? 'Mbyll Formen' : 'Dergese e Re'}
                </button>
            </div>

            {error && <div className="alert alert-danger">{error}</div>}
            {success && <div className="alert alert-success">{success}</div>}

            {showForm && (
                <div className="card shadow-sm mb-4">
                    <div className="card-body">
                        <h5>Krijo Dergese te Re</h5>
                        <form onSubmit={handleSubmit}>
                            <div className="row">
                                <div className="col-md-4 mb-3">
                                    <label className="form-label">Porosia</label>
                                    <select className="form-select" name="porosi_id" value={formData.porosi_id} onChange={handleChange} required>
                                        <option value="">Zgjidh porosine</option>
                                        {porosite.filter(p => p.statusi === 'gati' || p.statusi === 'ne_pergatitje').map(p => (
                                            <option key={p.porosi_id} value={p.porosi_id}>
                                                #{p.porosi_id} - {p.emri} {p.mbiemri} - {p.totali}€
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="col-md-4 mb-3">
                                    <label className="form-label">Shoferi</label>
                                    <select className="form-select" name="punonjes_id" value={formData.punonjes_id} onChange={handleChange} required>
                                        <option value="">Zgjidh shoferin</option>
                                        {punonjesit.map(p => (
                                            <option key={p.punonjes_id} value={p.punonjes_id}>
                                                {p.emri} {p.mbiemri}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="col-md-4 mb-3">
                                    <label className="form-label">Adresa e Dergeses</label>
                                    <input type="text" className="form-control" name="adresa" value={formData.adresa} onChange={handleChange} required />
                                </div>
                            </div>
                            <button type="submit" className="btn btn-danger me-2">Krijo Dergesen</button>
                            <button type="button" className="btn btn-secondary" onClick={resetForm}>Anulo</button>
                        </form>
                    </div>
                </div>
            )}

            <div className="row mb-3">
                <div className="col-md-3">
                    <select className="form-select" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
                        <option value="">Te gjitha statuset</option>
                        <option value="ne_pritje">Ne Pritje</option>
                        <option value="ne_rruge">Ne Rruge</option>
                        <option value="dorezuar">Dorezuar</option>
                        <option value="deshtuar">Deshtuar</option>
                    </select>
                </div>
            </div>

            <div className="card shadow-sm">
                <div className="card-body">
                    <table className="table table-hover">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Porosia</th>
                                <th>Klienti</th>
                                <th>Shoferi</th>
                                <th>Adresa</th>
                                <th>Nisja</th>
                                <th>Dorezimi</th>
                                <th>Statusi</th>
                                <th>Veprimet</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredDergesat.length > 0 ? (
                                filteredDergesat.map((d) => (
                                    <tr key={d.dergese_id}>
                                        <td>{d.dergese_id}</td>
                                        <td>#{d.porosi_id}</td>
                                        <td>{d.emri_klientit} {d.mbiemri_klientit}</td>
                                        <td>{d.emri_shoferit} {d.mbiemri_shoferit}</td>
                                        <td>{d.adresa || '-'}</td>
                                        <td>{d.koha_nisjes ? new Date(d.koha_nisjes).toLocaleTimeString('sq-AL') : '-'}</td>
                                        <td>{d.koha_dergeses ? new Date(d.koha_dergeses).toLocaleTimeString('sq-AL') : '-'}</td>
                                        <td>
                                            <select className="form-select form-select-sm" style={{ width: '130px' }} value={d.statusi} onChange={(e) => handleStatusChange(d.dergese_id, e.target.value)}>
                                                <option value="ne_pritje">Ne Pritje</option>
                                                <option value="ne_rruge">Ne Rruge</option>
                                                <option value="dorezuar">Dorezuar</option>
                                                <option value="deshtuar">Deshtuar</option>
                                            </select>
                                        </td>
                                        <td>
                                            <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(d.dergese_id)}><FaTrash /></button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr><td colSpan="9" className="text-center text-muted">Nuk ka dergesa ende</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Dergesat;