import { useState, useEffect } from 'react';
import API from '../services/api';
import { FaTrash, FaStar, FaSearch } from 'react-icons/fa';

const Vleresimet = () => {
    const [vleresimet, setVleresimet] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [filterYjet, setFilterYjet] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        fetchVleresimet();
    }, []);

    const fetchVleresimet = async () => {
        try {
            const response = await API.get('/vleresimet');
            setVleresimet(response.data.te_dhena);
        } catch (error) {
            console.error('Gabim:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('A jeni te sigurt qe doni te fshini kete vleresim?')) {
            try {
                await API.delete(`/vleresimet/${id}`);
                setSuccess('Vleresimi u fshi me sukses!');
                fetchVleresimet();
            } catch (err) {
                setError(err.response?.data?.mesazhi || 'Gabim!');
            }
        }
    };

    const renderYjet = (numri) => {
        return [...Array(5)].map((_, i) => (
            <FaStar key={i} className={i < numri ? 'text-warning' : 'text-secondary'} />
        ));
    };

    const filteredVleresimet = vleresimet.filter(v => {
        const matchSearch = v.emri?.toLowerCase().includes(search.toLowerCase()) ||
            v.mbiemri?.toLowerCase().includes(search.toLowerCase()) ||
            v.komenti?.toLowerCase().includes(search.toLowerCase());
        const matchYjet = filterYjet ? v.yjet === parseInt(filterYjet) : true;
        return matchSearch && matchYjet;
    });

    const mesatarja = vleresimet.length > 0
        ? (vleresimet.reduce((sum, v) => sum + v.yjet, 0) / vleresimet.length).toFixed(1)
        : 0;

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
                <h2><FaStar className="me-2 text-warning" />Vleresimet</h2>
                <div className="d-flex align-items-center">
                    <span className="badge bg-warning text-dark fs-5 me-2">
                        <FaStar className="me-1" />
                        {mesatarja} / 5
                    </span>
                    <span className="text-muted">({vleresimet.length} vleresime)</span>
                </div>
            </div>

            {error && <div className="alert alert-danger">{error}</div>}
            {success && <div className="alert alert-success">{success}</div>}

            <div className="row mb-3">
                <div className="col-md-4">
                    <div className="input-group">
                        <span className="input-group-text"><FaSearch /></span>
                        <input type="text" className="form-control" placeholder="Kerko vleresim..." value={search} onChange={(e) => setSearch(e.target.value)} />
                    </div>
                </div>
                <div className="col-md-3">
                    <select className="form-select" value={filterYjet} onChange={(e) => setFilterYjet(e.target.value)}>
                        <option value="">Te gjitha yjet</option>
                        <option value="5">5 Yje</option>
                        <option value="4">4 Yje</option>
                        <option value="3">3 Yje</option>
                        <option value="2">2 Yje</option>
                        <option value="1">1 Yll</option>
                    </select>
                </div>
            </div>

            <div className="card shadow-sm">
                <div className="card-body">
                    <table className="table table-hover">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Klienti</th>
                                <th>Porosi ID</th>
                                <th>Yjet</th>
                                <th>Komenti</th>
                                <th>Data</th>
                                <th>Veprimet</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredVleresimet.length > 0 ? (
                                filteredVleresimet.map((v) => (
                                    <tr key={v.vleresim_id}>
                                        <td>{v.vleresim_id}</td>
                                        <td>{v.emri} {v.mbiemri}</td>
                                        <td>#{v.porosi_id}</td>
                                        <td>{renderYjet(v.yjet)}</td>
                                        <td>{v.komenti || '-'}</td>
                                        <td>{new Date(v.data_vleresimit).toLocaleDateString('sq-AL')}</td>
                                        <td>
                                            <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(v.vleresim_id)}><FaTrash /></button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr><td colSpan="7" className="text-center text-muted">Nuk ka vleresime ende</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Vleresimet;