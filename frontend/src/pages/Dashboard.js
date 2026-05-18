import { useState, useEffect } from 'react';
import API from '../services/api';
import { FaShoppingCart, FaUsers, FaPizzaSlice, FaMoneyBillWave, FaStar, FaUserTie, FaTruck } from 'react-icons/fa';

const Dashboard = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboard = async () => {
            try {
                const response = await API.get('/dashboard');
                setData(response.data.te_dhena);
            } catch (error) {
                console.error('Gabim:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchDashboard();
    }, []);

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
            <h2 className="mb-4">Dashboard</h2>

            {/* Kartat kryesore */}
            <div className="row g-3 mb-4">
                <div className="col-md-3">
                    <div className="card border-0 shadow-sm bg-danger text-white">
                        <div className="card-body d-flex align-items-center">
                            <FaMoneyBillWave size={40} className="me-3" />
                            <div>
                                <h6 className="mb-0">Shitjet Sotme</h6>
                                <h3 className="mb-0">{data?.shitjetSotme || 0} €</h3>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="card border-0 shadow-sm bg-success text-white">
                        <div className="card-body d-flex align-items-center">
                            <FaMoneyBillWave size={40} className="me-3" />
                            <div>
                                <h6 className="mb-0">Shitjet Mujore</h6>
                                <h3 className="mb-0">{data?.shitjetMuajore || 0} €</h3>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="card border-0 shadow-sm bg-primary text-white">
                        <div className="card-body d-flex align-items-center">
                            <FaShoppingCart size={40} className="me-3" />
                            <div>
                                <h6 className="mb-0">Total Porosite</h6>
                                <h3 className="mb-0">{data?.totalPorosite || 0}</h3>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="card border-0 shadow-sm bg-warning text-dark">
                        <div className="card-body d-flex align-items-center">
                            <FaStar size={40} className="me-3" />
                            <div>
                                <h6 className="mb-0">Vleresimi Mesatar</h6>
                                <h3 className="mb-0">{data?.vleresimiMesatar || 0} / 5</h3>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Rreshti i dyte */}
            <div className="row g-3 mb-4">
                <div className="col-md-3">
                    <div className="card border-0 shadow-sm">
                        <div className="card-body d-flex align-items-center">
                            <FaPizzaSlice size={30} className="text-danger me-3" />
                            <div>
                                <h6 className="text-muted mb-0">Produktet</h6>
                                <h4 className="mb-0">{data?.totalProduktet || 0}</h4>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="card border-0 shadow-sm">
                        <div className="card-body d-flex align-items-center">
                            <FaUsers size={30} className="text-primary me-3" />
                            <div>
                                <h6 className="text-muted mb-0">Klientet</h6>
                                <h4 className="mb-0">{data?.totalKlientet || 0}</h4>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="card border-0 shadow-sm">
                        <div className="card-body d-flex align-items-center">
                            <FaUserTie size={30} className="text-success me-3" />
                            <div>
                                <h6 className="text-muted mb-0">Punonjesit</h6>
                                <h4 className="mb-0">{data?.totalPunonjesit || 0}</h4>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="card border-0 shadow-sm">
                        <div className="card-body d-flex align-items-center">
                            <FaMoneyBillWave size={30} className="text-success me-3" />
                            <div>
                                <h6 className="text-muted mb-0">Totali Shitjeve</h6>
                                <h4 className="mb-0">{data?.totaliShitjeve || 0} €</h4>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="row g-3">
                {/* Top 5 produktet */}
                <div className="col-md-6">
                    <div className="card border-0 shadow-sm">
                        <div className="card-header bg-white fw-bold">
                            <FaPizzaSlice className="text-danger me-2" />
                            Top 5 Produktet me te Shitura
                        </div>
                        <div className="card-body">
                            {data?.topProduktet?.length > 0 ? (
                                <table className="table table-hover">
                                    <thead>
                                        <tr>
                                            <th>#</th>
                                            <th>Produkti</th>
                                            <th>Sasia</th>
                                            <th>Shitjet</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {data.topProduktet.map((p, index) => (
                                            <tr key={index}>
                                                <td>{index + 1}</td>
                                                <td>{p.emri_produktit}</td>
                                                <td>{p.sasia_totale}</td>
                                                <td>{p.shitjet} €</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            ) : (
                                <p className="text-muted text-center">Nuk ka te dhena ende</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Porosite e fundit */}
                <div className="col-md-6">
                    <div className="card border-0 shadow-sm">
                        <div className="card-header bg-white fw-bold">
                            <FaShoppingCart className="text-primary me-2" />
                            Porosite e Fundit
                        </div>
                        <div className="card-body">
                            {data?.porositeEFundit?.length > 0 ? (
                                <table className="table table-hover">
                                    <thead>
                                        <tr>
                                            <th>ID</th>
                                            <th>Klienti</th>
                                            <th>Totali</th>
                                            <th>Statusi</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {data.porositeEFundit.map((p) => (
                                            <tr key={p.porosi_id}>
                                                <td>#{p.porosi_id}</td>
                                                <td>{p.emri} {p.mbiemri}</td>
                                                <td>{p.totali} €</td>
                                                <td>
                                                    <span className={`badge ${p.statusi === 'dorezuar' ? 'bg-success' :
                                                            p.statusi === 'ne_pritje' ? 'bg-warning text-dark' :
                                                                p.statusi === 'ne_pergatitje' ? 'bg-info' :
                                                                    p.statusi === 'ne_dergim' ? 'bg-primary' :
                                                                        p.statusi === 'anuluar' ? 'bg-danger' : 'bg-secondary'
                                                        }`}>
                                                        {p.statusi.replace('_', ' ')}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            ) : (
                                <p className="text-muted text-center">Nuk ka porosi ende</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Porosite sipas statusit */}
                <div className="col-md-6">
                    <div className="card border-0 shadow-sm">
                        <div className="card-header bg-white fw-bold">
                            <FaTruck className="text-info me-2" />
                            Porosite sipas Statusit
                        </div>
                        <div className="card-body">
                            {data?.porosiSipasStatusit?.length > 0 ? (
                                <table className="table">
                                    <thead>
                                        <tr>
                                            <th>Statusi</th>
                                            <th>Numri</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {data.porosiSipasStatusit.map((s, index) => (
                                            <tr key={index}>
                                                <td>
                                                    <span className={`badge ${s.statusi === 'dorezuar' ? 'bg-success' :
                                                            s.statusi === 'ne_pritje' ? 'bg-warning text-dark' :
                                                                s.statusi === 'ne_pergatitje' ? 'bg-info' :
                                                                    s.statusi === 'ne_dergim' ? 'bg-primary' :
                                                                        s.statusi === 'anuluar' ? 'bg-danger' : 'bg-secondary'
                                                        }`}>
                                                        {s.statusi.replace('_', ' ')}
                                                    </span>
                                                </td>
                                                <td><strong>{s.numri}</strong></td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            ) : (
                                <p className="text-muted text-center">Nuk ka te dhena ende</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Shitjet 7 dite */}
                <div className="col-md-6">
                    <div className="card border-0 shadow-sm">
                        <div className="card-header bg-white fw-bold">
                            <FaMoneyBillWave className="text-success me-2" />
                            Shitjet e 7 Diteve te Fundit
                        </div>
                        <div className="card-body">
                            {data?.shitjet7Dite?.length > 0 ? (
                                <table className="table">
                                    <thead>
                                        <tr>
                                            <th>Data</th>
                                            <th>Porosite</th>
                                            <th>Totali</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {data.shitjet7Dite.map((s, index) => (
                                            <tr key={index}>
                                                <td>{new Date(s.data).toLocaleDateString('sq-AL')}</td>
                                                <td>{s.numri_porosive}</td>
                                                <td>{s.totali} €</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            ) : (
                                <p className="text-muted text-center">Nuk ka shitje ne 7 ditet e fundit</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;