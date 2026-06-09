import { useState, useEffect } from 'react';
import API from '../services/api';
import { FaChartBar, FaFileExport, FaFileCsv, FaFileExcel } from 'react-icons/fa';
import { VscJson } from 'react-icons/vsc';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell, LineChart, Line, ResponsiveContainer } from 'recharts';

const COLORS = ['#D32F2F', '#1976D2', '#388E3C', '#F57C00', '#7B1FA2', '#00838F'];

const Raportet = () => {
    const [report, setReport] = useState(null);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        data_nga: '',
        data_deri: ''
    });

    useEffect(() => {
        fetchReport();
    }, []);

    const fetchReport = async () => {
        try {
            setLoading(true);
            const params = new URLSearchParams();
            if (filters.data_nga) params.append('data_nga', filters.data_nga);
            if (filters.data_deri) params.append('data_deri', filters.data_deri);
            const response = await API.get(`/reports?${params.toString()}`);
            setReport(response.data.te_dhena);
        } catch (error) {
            console.error('Gabim:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleExport = async (format) => {
        try {
            const params = new URLSearchParams();
            if (filters.data_nga) params.append('data_nga', filters.data_nga);
            if (filters.data_deri) params.append('data_deri', filters.data_deri);
            params.append('format', format);

            const response = await API.get(`/reports/export?${params.toString()}`, {
                responseType: 'blob'
            });

            const extensions = { json: 'json', csv: 'csv', excel: 'xlsx' };
            const blob = new Blob([response.data]);
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `raporti.${extensions[format]}`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Gabim ne eksportim:', error);
        }
    };

    const getTotaliShitjeve = () => {
        if (!report?.kategorite) return 0;
        return report.kategorite.reduce((sum, k) => sum + parseFloat(k.shitjet_totale || 0), 0).toFixed(2);
    };

    const getTotaliPorosive = () => {
        if (!report?.statuset) return 0;
        return report.statuset.reduce((sum, s) => sum + parseInt(s.numri || 0), 0);
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
                <h2><FaChartBar className="me-2 text-danger" />Raportet Dinamike</h2>
            </div>

            {/* Filtrat dhe Eksportimi */}
            <div className="card shadow-sm mb-4">
                <div className="card-body">
                    <div className="row align-items-end">
                        <div className="col-md-3">
                            <label className="form-label">Data Nga</label>
                            <input type="date" className="form-control" value={filters.data_nga} onChange={(e) => setFilters({ ...filters, data_nga: e.target.value })} />
                        </div>
                        <div className="col-md-3">
                            <label className="form-label">Data Deri</label>
                            <input type="date" className="form-control" value={filters.data_deri} onChange={(e) => setFilters({ ...filters, data_deri: e.target.value })} />
                        </div>
                        <div className="col-md-2">
                            <button className="btn btn-danger w-100" onClick={fetchReport}>Gjenero Raportin</button>
                        </div>
                        <div className="col-md-4 d-flex gap-2 justify-content-end">
                            <span className="align-self-center me-1"><FaFileExport /> Eksporto:</span>
                            <button className="btn btn-sm btn-outline-success" onClick={() => handleExport('excel')}>
                                <FaFileExcel className="me-1" />Excel
                            </button>
                            <button className="btn btn-sm btn-outline-primary" onClick={() => handleExport('csv')}>
                                <FaFileCsv className="me-1" />CSV
                            </button>
                            <button className="btn btn-sm btn-outline-warning" onClick={() => handleExport('json')}>
                                <VscJson className="me-1" />JSON
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Statistikat Kryesore */}
            <div className="row mb-4">
                <div className="col-md-3">
                    <div className="card bg-danger text-white shadow-sm">
                        <div className="card-body text-center">
                            <h6>Shitjet Totale</h6>
                            <h3>{getTotaliShitjeve()} €</h3>
                        </div>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="card bg-primary text-white shadow-sm">
                        <div className="card-body text-center">
                            <h6>Porosi Gjithsej</h6>
                            <h3>{getTotaliPorosive()}</h3>
                        </div>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="card bg-success text-white shadow-sm">
                        <div className="card-body text-center">
                            <h6>Kategorite</h6>
                            <h3>{report?.kategorite?.length || 0}</h3>
                        </div>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="card bg-warning text-dark shadow-sm">
                        <div className="card-body text-center">
                            <h6>Produktet Top</h6>
                            <h3>{report?.produktet?.length || 0}</h3>
                        </div>
                    </div>
                </div>
            </div>

            {/* Grafiku 1 - Shitjet sipas Kategorise */}
            <div className="row mb-4">
                <div className="col-md-6">
                    <div className="card shadow-sm">
                        <div className="card-header bg-white"><strong>Shitjet sipas Kategorise</strong></div>
                        <div className="card-body">
                            {report?.kategorite?.length > 0 ? (
                                <ResponsiveContainer width="100%" height={300}>
                                    <BarChart data={report.kategorite}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="emri_kategorise" />
                                        <YAxis />
                                        <Tooltip formatter={(value) => `${parseFloat(value).toFixed(2)} €`} />
                                        <Legend />
                                        <Bar dataKey="shitjet_totale" name="Shitjet (€)" fill="#D32F2F" />
                                    </BarChart>
                                </ResponsiveContainer>
                            ) : <p className="text-muted text-center">Nuk ka te dhena</p>}
                        </div>
                    </div>
                </div>

                {/* Grafiku 2 - Statuset e Porosive */}
                <div className="col-md-6">
                    <div className="card shadow-sm">
                        <div className="card-header bg-white"><strong>Porositë sipas Statusit</strong></div>
                        <div className="card-body">
                            {report?.statuset?.length > 0 ? (
                                <ResponsiveContainer width="100%" height={300}>
                                    <PieChart>
                                        <Pie data={report.statuset} dataKey="numri" nameKey="statusi" cx="50%" cy="50%" outerRadius={100} label={({ statusi, numri }) => `${statusi}: ${numri}`}>
                                            {report.statuset.map((_, index) => (
                                                <Cell key={index} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip />
                                    </PieChart>
                                </ResponsiveContainer>
                            ) : <p className="text-muted text-center">Nuk ka te dhena</p>}
                        </div>
                    </div>
                </div>
            </div>

            {/* Grafiku 3 - Shitjet Ditore */}
            <div className="row mb-4">
                <div className="col-md-8">
                    <div className="card shadow-sm">
                        <div className="card-header bg-white"><strong>Shitjet Ditore</strong></div>
                        <div className="card-body">
                            {report?.ditore?.length > 0 ? (
                                <ResponsiveContainer width="100%" height={300}>
                                    <LineChart data={report.ditore}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="data" />
                                        <YAxis />
                                        <Tooltip formatter={(value) => `${parseFloat(value).toFixed(2)} €`} />
                                        <Legend />
                                        <Line type="monotone" dataKey="shitjet_totale" name="Shitjet (€)" stroke="#D32F2F" strokeWidth={2} />
                                        <Line type="monotone" dataKey="numri_porosive" name="Porosi" stroke="#1976D2" strokeWidth={2} />
                                    </LineChart>
                                </ResponsiveContainer>
                            ) : <p className="text-muted text-center">Nuk ka te dhena</p>}
                        </div>
                    </div>
                </div>

                {/* Grafiku 4 - Metodat e Pageses */}
                <div className="col-md-4">
                    <div className="card shadow-sm">
                        <div className="card-header bg-white"><strong>Metodat e Pageses</strong></div>
                        <div className="card-body">
                            {report?.metodat?.length > 0 ? (
                                <ResponsiveContainer width="100%" height={300}>
                                    <PieChart>
                                        <Pie data={report.metodat} dataKey="numri" nameKey="metoda_pageses" cx="50%" cy="50%" outerRadius={80} label={({ metoda_pageses, numri }) => `${metoda_pageses}: ${numri}`}>
                                            {report.metodat.map((_, index) => (
                                                <Cell key={index} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip />
                                    </PieChart>
                                </ResponsiveContainer>
                            ) : <p className="text-muted text-center">Nuk ka te dhena</p>}
                        </div>
                    </div>
                </div>
            </div>

            {/* Tabela - Top Produktet */}
            <div className="row mb-4">
                <div className="col-md-12">
                    <div className="card shadow-sm">
                        <div className="card-header bg-white"><strong>Top 10 Produktet me te Shitura</strong></div>
                        <div className="card-body">
                            <table className="table table-hover">
                                <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>Produkti</th>
                                        <th>Sasia</th>
                                        <th>Shitjet</th>
                                        <th>Porosi</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {report?.produktet?.length > 0 ? (
                                        report.produktet.map((p, i) => (
                                            <tr key={i}>
                                                <td>{i + 1}</td>
                                                <td>{p.emri_produktit}</td>
                                                <td>{p.sasia_totale}</td>
                                                <td>{parseFloat(p.shitjet_totale).toFixed(2)} €</td>
                                                <td>{p.numri_porosive}</td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr><td colSpan="5" className="text-center text-muted">Nuk ka te dhena</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Raportet;