import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import API from '../services/api';
import {
    FaPizzaSlice, FaShoppingCart, FaHistory, FaMapMarkerAlt,
    FaUser, FaStar, FaPlus, FaMinus, FaTrash, FaTimes,
    FaCheck, FaTruck, FaBoxOpen, FaClock, FaBan,
    FaTag, FaRedo, FaChevronDown, FaChevronUp, FaUtensils
} from 'react-icons/fa';

const KlientDashboard = () => {
    const { user } = useAuth();
    const klientId = user?.klient_id;

    // Tab aktiv
    const [activeTab, setActiveTab] = useState('menu');

    // Te dhenat
    const [menyte, setMenyte] = useState([]);
    const [produktet, setProduktet] = useState([]);
    const [porosite, setPorosite] = useState([]);
    const [adresat, setAdresat] = useState([]);
    const [profili, setProfili] = useState(null);

    // Shporta
    const [shporta, setShporta] = useState([]);
    const [showShporta, setShowShporta] = useState(false);

    // Porosi e re
    const [metodaPageses, setMetodaPageses] = useState('cash');
    const [adresaDergeses, setAdresaDergeses] = useState('');
    const [shenimet, setShenimet] = useState('');
    const [kuponKodi, setKuponKodi] = useState('');
    const [kuponInfo, setKuponInfo] = useState(null);
    const [kuponError, setKuponError] = useState('');

    // Detajet e porosise
    const [selectedPorosi, setSelectedPorosi] = useState(null);

    // Vleresim
    const [showVleresim, setShowVleresim] = useState(null);
    const [yjet, setYjet] = useState(5);
    const [komenti, setKomenti] = useState('');

    // Profili edit
    const [editProfili, setEditProfili] = useState(false);
    const [profilForm, setProfilForm] = useState({ emri: '', mbiemri: '', telefoni: '', adresa: '' });

    // Adrese e re
    const [showAdresaForm, setShowAdresaForm] = useState(false);
    const [adresaForm, setAdresaForm] = useState({ emertimi: '', adresa: '', qyteti: '', kodi_postar: '', eshte_default: false });

    // Mesazhet
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (klientId) {
            fetchAll();
        }
    }, [klientId]);

    const fetchAll = async () => {
        setLoading(true);
        try {
            await Promise.all([
                fetchMenute(),
                fetchProduktet(),
                fetchPorosite(),
                fetchAdresat(),
                fetchProfilin()
            ]);
        } catch (err) {
            console.error('Gabim:', err);
        } finally {
            setLoading(false);
        }
    };

    const fetchMenute = async () => {
        try {
            const res = await API.get('/klient-paneli/menyte');
            setMenyte(res.data.te_dhena || []);
        } catch (err) { console.error(err); }
    };

    const fetchProduktet = async () => {
        try {
            const res = await API.get('/produktet');
            setProduktet(res.data.te_dhena || []);
        } catch (err) { console.error(err); }
    };

    const fetchPorosite = async () => {
        try {
            const res = await API.get(`/klient-paneli/${klientId}/porosite`);
            setPorosite(res.data.te_dhena || []);
        } catch (err) { console.error(err); }
    };

    const fetchAdresat = async () => {
        try {
            const res = await API.get(`/adresat/${klientId}`);
            setAdresat(res.data.te_dhena || []);
        } catch (err) { console.error(err); }
    };

    const fetchProfilin = async () => {
        try {
            const res = await API.get(`/klient-paneli/${klientId}/profili`);
            setProfili(res.data.te_dhena);
            setProfilForm({
                emri: res.data.te_dhena.emri || '',
                mbiemri: res.data.te_dhena.mbiemri || '',
                telefoni: res.data.te_dhena.telefoni || '',
                adresa: res.data.te_dhena.adresa || ''
            });
        } catch (err) { console.error(err); }
    };

    // ============ SHPORTA ============
    const shtoNeShporte = (produkt) => {
        const existing = shporta.find(s => s.produkt_id === produkt.produkt_id);
        if (existing) {
            setShporta(shporta.map(s =>
                s.produkt_id === produkt.produkt_id
                    ? { ...s, sasia: s.sasia + 1 }
                    : s
            ));
        } else {
            setShporta([...shporta, {
                produkt_id: produkt.produkt_id,
                emri_produktit: produkt.emri_produktit,
                cmimi_baze: parseFloat(produkt.cmimi_special || produkt.cmimi_baze),
                foto_url: produkt.foto_url,
                sasia: 1,
                personalizimi: ''
            }]);
        }
        setSuccess('U shtua ne shporte!');
        setTimeout(() => setSuccess(''), 2000);
    };

    const ndryshSasine = (produktId, delta) => {
        setShporta(shporta.map(s => {
            if (s.produkt_id === produktId) {
                const sasiRe = s.sasia + delta;
                return sasiRe > 0 ? { ...s, sasia: sasiRe } : s;
            }
            return s;
        }));
    };

    const hiqNgaShporta = (produktId) => {
        setShporta(shporta.filter(s => s.produkt_id !== produktId));
    };

    const getTotalShporta = () => {
        return shporta.reduce((t, s) => t + (s.sasia * s.cmimi_baze), 0);
    };

    // ============ KUPON ============
    const verifikoKupon = async () => {
        setKuponError('');
        setKuponInfo(null);
        if (!kuponKodi.trim()) return;
        try {
            const res = await API.post('/klient-paneli/verifikoKupon', {
                kodi: kuponKodi,
                totali: getTotalShporta()
            });
            setKuponInfo(res.data);
        } catch (err) {
            setKuponError(err.response?.data?.mesazhi || 'Kuponi nuk eshte i vlefshem!');
        }
    };

    // ============ POROSI ============
    const krijoPorosi = async () => {
        setError('');
        if (shporta.length === 0) {
            setError('Shporta eshte bosh!');
            return;
        }
        if (!adresaDergeses.trim()) {
            setError('Ju lutem vendosni adresen e dergeses!');
            return;
        }

        try {
            const res = await API.post(`/klient-paneli/${klientId}/porosite`, {
                metoda_pageses: metodaPageses,
                adresa_dergeses: adresaDergeses,
                shenimet: shenimet,
                kupon_kodi: kuponKodi || null,
                detajet: shporta.map(s => ({
                    produkt_id: s.produkt_id,
                    sasia: s.sasia,
                    personalizimi: s.personalizimi || null
                }))
            });

            setSuccess(`Porosia #${res.data.porosi_id} u krijua me sukses! Totali: ${res.data.totali}€${res.data.zbritja > 0 ? ` (Zbritje: ${res.data.zbritja}€)` : ''}`);
            setShporta([]);
            setShowShporta(false);
            setKuponKodi('');
            setKuponInfo(null);
            setShenimet('');
            fetchPorosite();
            setActiveTab('porosite');
        } catch (err) {
            setError(err.response?.data?.mesazhi || 'Gabim gjate krijimit te porosise!');
        }
    };

    // ============ TRACKING ============
    const shikoPorosi = async (porosiId) => {
        try {
            const res = await API.get(`/klient-paneli/${klientId}/porosite/${porosiId}`);
            setSelectedPorosi(res.data.te_dhena);
        } catch (err) { console.error(err); }
    };

    const anuloPorosi = async (porosiId) => {
        if (!window.confirm('A jeni te sigurt qe doni te anuloni kete porosi?')) return;
        try {
            await API.put(`/klient-paneli/${klientId}/porosite/${porosiId}/anulo`);
            setSuccess('Porosia u anulua!');
            fetchPorosite();
            setSelectedPorosi(null);
        } catch (err) {
            setError(err.response?.data?.mesazhi || 'Gabim!');
        }
    };

    // ============ RIPOROSO ============
    const riporoso = async (porosiId) => {
        try {
            const res = await API.get(`/klient-paneli/${klientId}/porosite/${porosiId}`);
            const detajet = res.data.te_dhena.detajet || [];
            const shportaRe = detajet.map(d => ({
                produkt_id: d.produkt_id,
                emri_produktit: d.emri_produktit,
                cmimi_baze: parseFloat(d.cmimi_njesi),
                foto_url: d.foto_url,
                sasia: d.sasia,
                personalizimi: d.personalizimi || ''
            }));
            setShporta(shportaRe);
            setShowShporta(true);
            setActiveTab('menu');
            setSuccess('Produktet u shtuan ne shporte! Mund te ndryshoni sasine para porosise.');
        } catch (err) {
            setError('Gabim gjate riporosise!');
        }
    };

    // ============ VLERESIM ============
    const dergoVleresim = async () => {
        try {
            await API.post(`/klient-paneli/${klientId}/porosite/${showVleresim}/vleresim`, {
                yjet, komenti
            });
            setSuccess('Faleminderit per vleresimin!');
            setShowVleresim(null);
            setYjet(5);
            setKomenti('');
            fetchPorosite();
        } catch (err) {
            setError(err.response?.data?.mesazhi || 'Gabim!');
        }
    };

    // ============ PROFILI ============
    const ruajProfilin = async () => {
        try {
            await API.put(`/klient-paneli/${klientId}/profili`, profilForm);
            setSuccess('Profili u perditesua!');
            setEditProfili(false);
            fetchProfilin();
        } catch (err) {
            setError('Gabim gjate perditesimit!');
        }
    };

    // ============ ADRESA ============
    const shtoAdrese = async () => {
        try {
            await API.post('/adresat', { klient_id: klientId, ...adresaForm });
            setSuccess('Adresa u shtua!');
            setShowAdresaForm(false);
            setAdresaForm({ emertimi: '', adresa: '', qyteti: '', kodi_postar: '', eshte_default: false });
            fetchAdresat();
        } catch (err) {
            setError('Gabim gjate shtimit te adreses!');
        }
    };

    const fshiAdrese = async (id) => {
        if (!window.confirm('A doni te fshini kete adrese?')) return;
        try {
            await API.delete(`/adresat/${id}`);
            fetchAdresat();
        } catch (err) { console.error(err); }
    };

    // ============ HELPERS ============
    const getStatusInfo = (statusi) => {
        const info = {
            'ne_pritje': { icon: <FaClock />, text: 'Ne Pritje', color: '#f59e0b', step: 1 },
            'ne_pergatitje': { icon: <FaUtensils />, text: 'Ne Pergatitje', color: '#3b82f6', step: 2 },
            'gati': { icon: <FaBoxOpen />, text: 'Gati', color: '#8b5cf6', step: 3 },
            'ne_dergim': { icon: <FaTruck />, text: 'Ne Dergim', color: '#06b6d4', step: 4 },
            'dorezuar': { icon: <FaCheck />, text: 'Dorezuar', color: '#10b981', step: 5 },
            'anuluar': { icon: <FaBan />, text: 'Anuluar', color: '#ef4444', step: 0 }
        };
        return info[statusi] || { icon: <FaClock />, text: statusi, color: '#6b7280', step: 0 };
    };

    const clearMessages = () => { setError(''); setSuccess(''); };

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center vh-100">
                <div className="text-center">
                    <div className="spinner-border text-danger mb-3" style={{ width: '3rem', height: '3rem' }} role="status"></div>
                    <p className="text-muted">Duke u ngarkuar...</p>
                </div>
            </div>
        );
    }

    return (
        <div style={{ backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
            {/* MESAZHET */}
            {error && (
                <div className="alert alert-danger alert-dismissible fade show m-3" role="alert">
                    {error}
                    <button type="button" className="btn-close" onClick={() => setError('')}></button>
                </div>
            )}
            {success && (
                <div className="alert alert-success alert-dismissible fade show m-3" role="alert">
                    {success}
                    <button type="button" className="btn-close" onClick={() => setSuccess('')}></button>
                </div>
            )}

            {/* HEADER */}
            <div style={{ background: 'linear-gradient(135deg, #dc3545, #b91c1c)', padding: '20px 0', color: 'white' }}>
                <div className="container">
                    <div className="d-flex justify-content-between align-items-center">
                        <div>
                            <h4 className="mb-0"><FaPizzaSlice className="me-2" />Mire se vini, {user?.emri}!</h4>
                            <small className="opacity-75">Porosisni pizzen tuaj te preferuar</small>
                        </div>
                        {shporta.length > 0 && (
                            <button
                                className="btn btn-light position-relative"
                                onClick={() => { setShowShporta(!showShporta); clearMessages(); }}
                            >
                                <FaShoppingCart className="me-1" />
                                Shporta
                                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                                    {shporta.reduce((t, s) => t + s.sasia, 0)}
                                </span>
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* TABS */}
            <div className="container mt-3">
                <ul className="nav nav-pills mb-4">
                    {[
                        { key: 'menu', icon: <FaPizzaSlice />, text: 'Menyja' },
                        { key: 'porosite', icon: <FaHistory />, text: 'Porosite e Mia' },
                        { key: 'adresat', icon: <FaMapMarkerAlt />, text: 'Adresat' },
                        { key: 'profili', icon: <FaUser />, text: 'Profili' }
                    ].map(tab => (
                        <li className="nav-item me-2" key={tab.key}>
                            <button
                                className={`nav-link ${activeTab === tab.key ? 'active bg-danger' : 'text-dark'}`}
                                onClick={() => { setActiveTab(tab.key); clearMessages(); setSelectedPorosi(null); setShowShporta(false); }}
                            >
                                {tab.icon} <span className="ms-1">{tab.text}</span>
                            </button>
                        </li>
                    ))}
                </ul>

                {/* ============ SHPORTA PANEL ============ */}
                {showShporta && (
                    <div className="card shadow-sm mb-4 border-danger" style={{ position: 'relative', zIndex: 10 }}>
                        <div className="card-header bg-danger text-white d-flex justify-content-between align-items-center">
                            <span><FaShoppingCart className="me-2" />Shporta Juaj</span>
                            <button className="btn btn-sm btn-light" onClick={() => setShowShporta(false)}><FaTimes /></button>
                        </div>
                        <div className="card-body" style={{ maxHeight: '70vh', overflowY: 'auto' }}>
                            {shporta.map(item => (
                                <div key={item.produkt_id} className="d-flex align-items-center justify-content-between border-bottom py-2">
                                    <div className="d-flex align-items-center">
                                        {item.foto_url && (
                                            <img src={item.foto_url} alt="" style={{ width: 50, height: 50, objectFit: 'cover', borderRadius: 8 }} className="me-3" />
                                        )}
                                        <div>
                                            <strong>{item.emri_produktit}</strong>
                                            <div className="text-muted small">{item.cmimi_baze.toFixed(2)}€ x {item.sasia}</div>
                                            <input
                                                type="text"
                                                className="form-control form-control-sm mt-1"
                                                placeholder="Personalizim (opsionale)"
                                                value={item.personalizimi}
                                                onChange={(e) => setShporta(shporta.map(s =>
                                                    s.produkt_id === item.produkt_id ? { ...s, personalizimi: e.target.value } : s
                                                ))}
                                                style={{ maxWidth: 250 }}
                                            />
                                        </div>
                                    </div>
                                    <div className="d-flex align-items-center">
                                        <button className="btn btn-sm btn-outline-secondary" onClick={() => ndryshSasine(item.produkt_id, -1)}><FaMinus /></button>
                                        <span className="mx-2 fw-bold">{item.sasia}</span>
                                        <button className="btn btn-sm btn-outline-secondary" onClick={() => ndryshSasine(item.produkt_id, 1)}><FaPlus /></button>
                                        <span className="mx-3 fw-bold">{(item.sasia * item.cmimi_baze).toFixed(2)}€</span>
                                        <button className="btn btn-sm btn-outline-danger" onClick={() => hiqNgaShporta(item.produkt_id)}><FaTrash /></button>
                                    </div>
                                </div>
                            ))}

                            {/* Kupon */}
                            <div className="mt-3 p-3 bg-light rounded">
                                <div className="d-flex align-items-center gap-2">
                                    <FaTag className="text-danger" />
                                    <input type="text" className="form-control form-control-sm" placeholder="Kodi i kuponit"
                                        value={kuponKodi} onChange={(e) => setKuponKodi(e.target.value.toUpperCase())} style={{ maxWidth: 200 }} />
                                    <button className="btn btn-sm btn-outline-danger" onClick={verifikoKupon}>Apliko</button>
                                </div>
                                {kuponInfo && (
                                    <div className="text-success small mt-2">
                                        <FaCheck className="me-1" />Zbritje {kuponInfo.zbritja_perqind}%: -{kuponInfo.zbritja.toFixed(2)}€
                                    </div>
                                )}
                                {kuponError && <div className="text-danger small mt-2">{kuponError}</div>}
                            </div>

                            {/* Adresa */}
                            <div className="mt-3">
                                <label className="form-label fw-bold">Adresa e Dergeses</label>
                                {adresat.length > 0 && (
                                    <div className="mb-2">
                                        {adresat.map(a => (
                                            <button key={a.adrese_id}
                                                className={`btn btn-sm me-2 mb-1 ${adresaDergeses === `${a.adresa}, ${a.qyteti}` ? 'btn-danger' : 'btn-outline-secondary'}`}
                                                onClick={() => setAdresaDergeses(`${a.adresa}, ${a.qyteti}`)}
                                            >
                                                <FaMapMarkerAlt className="me-1" />{a.emertimi}
                                            </button>
                                        ))}
                                    </div>
                                )}
                                <input type="text" className="form-control" placeholder="Shkruani adresen e dergeses"
                                    value={adresaDergeses} onChange={(e) => setAdresaDergeses(e.target.value)} />
                            </div>

                            {/* Metoda pageses + Shenimet */}
                            <div className="row mt-3">
                                <div className="col-md-6">
                                    <label className="form-label fw-bold">Metoda e Pageses</label>
                                    <select className="form-select" value={metodaPageses} onChange={(e) => setMetodaPageses(e.target.value)}>
                                        <option value="cash">Cash</option>
                                        <option value="karte">Karte</option>
                                        <option value="online">Online</option>
                                    </select>
                                </div>
                                <div className="col-md-6">
                                    <label className="form-label fw-bold">Shenimet</label>
                                    <input type="text" className="form-control" placeholder="p.sh. Pa qepe"
                                        value={shenimet} onChange={(e) => setShenimet(e.target.value)} />
                                </div>
                            </div>

                            {/* Totali + Porosit */}
                            <div className="mt-4 d-flex justify-content-between align-items-center">
                                <div>
                                    <h5 className="mb-0">
                                        Totali: <span className="text-danger">
                                            {kuponInfo ? kuponInfo.totali_ri.toFixed(2) : getTotalShporta().toFixed(2)}€
                                        </span>
                                    </h5>
                                    {kuponInfo && (
                                        <small className="text-muted text-decoration-line-through">{getTotalShporta().toFixed(2)}€</small>
                                    )}
                                </div>
                                <button className="btn btn-danger btn-lg" onClick={krijoPorosi}>
                                    <FaShoppingCart className="me-2" />Porosit Tani
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* ============ TAB: MENYJA ============ */}
                {activeTab === 'menu' && (
                    <div>
                        {/* Produktet sipas kategorive */}
                        {menyte.length > 0 ? (
                            menyte.map(meny => (
                                <div key={meny.meny_id} className="mb-4">
                                    <h5 className="mb-3"><FaUtensils className="me-2 text-danger" />{meny.emri_menys}</h5>
                                    {meny.pershkrimi && <p className="text-muted">{meny.pershkrimi}</p>}
                                    <div className="row">
                                        {meny.produktet?.map(p => (
                                            <div key={p.meny_produkt_id} className="col-md-4 col-lg-3 mb-3">
                                                <div className="card h-100 shadow-sm border-0" style={{ transition: 'transform 0.2s' }}
                                                    onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-4px)'}
                                                    onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
                                                    {p.foto_url && (
                                                        <img src={p.foto_url} alt={p.emri_produktit}
                                                            className="card-img-top" style={{ height: 180, objectFit: 'cover' }} />
                                                    )}
                                                    <div className="card-body d-flex flex-column">
                                                        <h6 className="card-title">{p.emri_produktit}</h6>
                                                        {p.pershkrimi && <p className="card-text small text-muted flex-grow-1">{p.pershkrimi}</p>}
                                                        <div className="d-flex justify-content-between align-items-center mt-2">
                                                            <div>
                                                                {p.cmimi_special && parseFloat(p.cmimi_special) < parseFloat(p.cmimi_baze) ? (
                                                                    <>
                                                                        <span className="text-decoration-line-through text-muted small">{parseFloat(p.cmimi_baze).toFixed(2)}€</span>
                                                                        <span className="fw-bold text-danger ms-1">{parseFloat(p.cmimi_special).toFixed(2)}€</span>
                                                                    </>
                                                                ) : (
                                                                    <span className="fw-bold text-danger">{parseFloat(p.cmimi_baze).toFixed(2)}€</span>
                                                                )}
                                                            </div>
                                                            <button className="btn btn-sm btn-danger" onClick={() => shtoNeShporte(p)}>
                                                                <FaPlus className="me-1" />Shto
                                                            </button>
                                                        </div>
                                                        {p.koha_pergatitjes_min > 0 && (
                                                            <small className="text-muted mt-1"><FaClock className="me-1" />{p.koha_pergatitjes_min} min</small>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))
                        ) : (
                            /* Nese nuk ka meny aktive, shfaq produktet direkt */
                            <div>
                                <h5 className="mb-3"><FaPizzaSlice className="me-2 text-danger" />Produktet Tona</h5>
                                <div className="row">
                                    {produktet.filter(p => p.aktive).map(p => (
                                        <div key={p.produkt_id} className="col-md-4 col-lg-3 mb-3">
                                            <div className="card h-100 shadow-sm border-0" style={{ transition: 'transform 0.2s' }}
                                                onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-4px)'}
                                                onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
                                                {p.foto_url && (
                                                    <img src={p.foto_url} alt={p.emri_produktit}
                                                        className="card-img-top" style={{ height: 180, objectFit: 'cover' }} />
                                                )}
                                                <div className="card-body d-flex flex-column">
                                                    <h6 className="card-title">{p.emri_produktit}</h6>
                                                    {p.pershkrimi && <p className="card-text small text-muted flex-grow-1">{p.pershkrimi}</p>}
                                                    <div className="d-flex justify-content-between align-items-center mt-2">
                                                        <span className="fw-bold text-danger">{parseFloat(p.cmimi_baze).toFixed(2)}€</span>
                                                        <button className="btn btn-sm btn-danger" onClick={() => shtoNeShporte(p)}>
                                                            <FaPlus className="me-1" />Shto
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* ============ TAB: POROSITE E MIA ============ */}
                {activeTab === 'porosite' && (
                    <div>
                        <h5 className="mb-3"><FaHistory className="me-2 text-danger" />Porosite e Mia</h5>

                        {/* Vleresim Modal */}
                        {showVleresim && (
                            <div className="card shadow-sm mb-4 border-warning">
                                <div className="card-header bg-warning text-dark d-flex justify-content-between">
                                    <span><FaStar className="me-1" />Vlersoni Porosine #{showVleresim}</span>
                                    <button className="btn btn-sm btn-dark" onClick={() => setShowVleresim(null)}><FaTimes /></button>
                                </div>
                                <div className="card-body">
                                    <div className="mb-3">
                                        <label className="form-label">Yjet</label>
                                        <div className="d-flex gap-1">
                                            {[1, 2, 3, 4, 5].map(y => (
                                                <FaStar key={y} size={28}
                                                    style={{ cursor: 'pointer', color: y <= yjet ? '#f59e0b' : '#d1d5db' }}
                                                    onClick={() => setYjet(y)} />
                                            ))}
                                        </div>
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Komenti (opsional)</label>
                                        <textarea className="form-control" rows="3" value={komenti}
                                            onChange={(e) => setKomenti(e.target.value)} placeholder="Shkruani pershtypjen tuaj..." />
                                    </div>
                                    <button className="btn btn-warning" onClick={dergoVleresim}>
                                        <FaStar className="me-1" />Dergo Vleresimin
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Detajet e porosise me Tracking */}
                        {selectedPorosi && (
                            <div className="card shadow-sm mb-4 border-primary">
                                <div className="card-header bg-primary text-white d-flex justify-content-between">
                                    <span>Porosi #{selectedPorosi.porosi_id} — Detajet</span>
                                    <button className="btn btn-sm btn-light" onClick={() => setSelectedPorosi(null)}><FaTimes /></button>
                                </div>
                                <div className="card-body">
                                    {/* TRACKING BAR */}
                                    {selectedPorosi.statusi !== 'anuluar' && (
                                        <div className="mb-4">
                                            <div className="d-flex justify-content-between position-relative" style={{ padding: '0 30px' }}>
                                                <div style={{
                                                    position: 'absolute', top: '20px', left: '50px', right: '50px',
                                                    height: '4px', backgroundColor: '#e5e7eb', zIndex: 0
                                                }}>
                                                    <div style={{
                                                        width: `${((getStatusInfo(selectedPorosi.statusi).step - 1) / 4) * 100}%`,
                                                        height: '100%', backgroundColor: '#10b981', transition: 'width 0.5s'
                                                    }}></div>
                                                </div>
                                                {['ne_pritje', 'ne_pergatitje', 'gati', 'ne_dergim', 'dorezuar'].map((s, i) => {
                                                    const info = getStatusInfo(s);
                                                    const aktiv = getStatusInfo(selectedPorosi.statusi).step >= info.step;
                                                    return (
                                                        <div key={s} className="text-center" style={{ zIndex: 1 }}>
                                                            <div style={{
                                                                width: 40, height: 40, borderRadius: '50%',
                                                                backgroundColor: aktiv ? info.color : '#e5e7eb',
                                                                color: aktiv ? 'white' : '#9ca3af',
                                                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                                margin: '0 auto', transition: 'all 0.3s'
                                                            }}>
                                                                {info.icon}
                                                            </div>
                                                            <small className={`d-block mt-1 ${aktiv ? 'fw-bold' : 'text-muted'}`}
                                                                style={{ fontSize: '0.7rem' }}>{info.text}</small>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    )}

                                    {selectedPorosi.statusi === 'anuluar' && (
                                        <div className="alert alert-danger text-center">
                                            <FaBan className="me-2" />Kjo porosi eshte anuluar
                                        </div>
                                    )}

                                    {/* Info */}
                                    <div className="row mb-3">
                                        <div className="col-md-3"><strong>Data:</strong> {new Date(selectedPorosi.data_porosise).toLocaleDateString('sq-AL')}</div>
                                        <div className="col-md-3"><strong>Totali:</strong> <span className="text-danger fw-bold">{selectedPorosi.totali}€</span></div>
                                        <div className="col-md-3"><strong>Pagesa:</strong> {selectedPorosi.metoda_pageses}</div>
                                        <div className="col-md-3"><strong>Adresa:</strong> {selectedPorosi.adresa_dergeses}</div>
                                    </div>

                                    {/* Artikujt */}
                                    <table className="table table-sm">
                                        <thead><tr><th>Produkti</th><th>Sasia</th><th>Cmimi</th><th>Nentotali</th></tr></thead>
                                        <tbody>
                                            {selectedPorosi.detajet?.map((d, i) => (
                                                <tr key={i}>
                                                    <td>{d.emri_produktit}</td>
                                                    <td>{d.sasia}</td>
                                                    <td>{d.cmimi_njesi}€</td>
                                                    <td>{d.nentotali}€</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>

                                    {/* Dergesa info */}
                                    {selectedPorosi.dergesa && (
                                        <div className="alert alert-info">
                                            <FaTruck className="me-2" />
                                            <strong>Shoferi:</strong> {selectedPorosi.dergesa.shofer_emri} {selectedPorosi.dergesa.shofer_mbiemri}
                                            {selectedPorosi.dergesa.shofer_telefoni && ` — Tel: ${selectedPorosi.dergesa.shofer_telefoni}`}
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Lista e porosive */}
                        {porosite.length > 0 ? (
                            porosite.map(p => {
                                const statusInfo = getStatusInfo(p.statusi);
                                return (
                                    <div key={p.porosi_id} className="card shadow-sm mb-3 border-0">
                                        <div className="card-body">
                                            <div className="d-flex justify-content-between align-items-center">
                                                <div>
                                                    <h6 className="mb-1">Porosi #{p.porosi_id}</h6>
                                                    <small className="text-muted">{new Date(p.data_porosise).toLocaleDateString('sq-AL')} — {p.metoda_pageses}</small>
                                                </div>
                                                <div className="text-end">
                                                    <span className="badge px-3 py-2 mb-2" style={{ backgroundColor: statusInfo.color, color: 'white' }}>
                                                        {statusInfo.icon} <span className="ms-1">{statusInfo.text}</span>
                                                    </span>
                                                    <div className="fw-bold text-danger">{p.totali}€</div>
                                                </div>
                                            </div>
                                            <div className="mt-2 d-flex gap-2">
                                                <button className="btn btn-sm btn-outline-primary" onClick={() => shikoPorosi(p.porosi_id)}>
                                                    <FaBoxOpen className="me-1" />Detajet & Tracking
                                                </button>
                                                <button className="btn btn-sm btn-outline-secondary" onClick={() => riporoso(p.porosi_id)}>
                                                    <FaRedo className="me-1" />Riporosit
                                                </button>
                                                {p.statusi === 'dorezuar' && !p.ka_vleresim && (
                                                    <button className="btn btn-sm btn-outline-warning" onClick={() => { setShowVleresim(p.porosi_id); setYjet(5); setKomenti(''); }}>
                                                        <FaStar className="me-1" />Vlersoni
                                                    </button>
                                                )}
                                                {p.statusi === 'ne_pritje' && (
                                                    <button className="btn btn-sm btn-outline-danger" onClick={() => anuloPorosi(p.porosi_id)}>
                                                        <FaBan className="me-1" />Anulo
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })
                        ) : (
                            <div className="text-center text-muted py-5">
                                <FaShoppingCart size={48} className="mb-3 opacity-25" />
                                <p>Nuk keni asnje porosi ende. Filloni duke porositur nga menyja!</p>
                            </div>
                        )}
                    </div>
                )}

                {/* ============ TAB: ADRESAT ============ */}
                {activeTab === 'adresat' && (
                    <div>
                        <div className="d-flex justify-content-between align-items-center mb-3">
                            <h5 className="mb-0"><FaMapMarkerAlt className="me-2 text-danger" />Adresat e Mia</h5>
                            <button className="btn btn-danger btn-sm" onClick={() => setShowAdresaForm(!showAdresaForm)}>
                                <FaPlus className="me-1" />{showAdresaForm ? 'Mbyll' : 'Shto Adrese'}
                            </button>
                        </div>

                        {showAdresaForm && (
                            <div className="card shadow-sm mb-3">
                                <div className="card-body">
                                    <div className="row g-3">
                                        <div className="col-md-4">
                                            <label className="form-label">Emertimi</label>
                                            <input type="text" className="form-control" placeholder="p.sh. Shtepia"
                                                value={adresaForm.emertimi} onChange={(e) => setAdresaForm({ ...adresaForm, emertimi: e.target.value })} />
                                        </div>
                                        <div className="col-md-8">
                                            <label className="form-label">Adresa</label>
                                            <input type="text" className="form-control" placeholder="Rruga, numri..."
                                                value={adresaForm.adresa} onChange={(e) => setAdresaForm({ ...adresaForm, adresa: e.target.value })} />
                                        </div>
                                        <div className="col-md-4">
                                            <label className="form-label">Qyteti</label>
                                            <input type="text" className="form-control" placeholder="Prishtine"
                                                value={adresaForm.qyteti} onChange={(e) => setAdresaForm({ ...adresaForm, qyteti: e.target.value })} />
                                        </div>
                                        <div className="col-md-4">
                                            <label className="form-label">Kodi Postar</label>
                                            <input type="text" className="form-control" placeholder="10000"
                                                value={adresaForm.kodi_postar} onChange={(e) => setAdresaForm({ ...adresaForm, kodi_postar: e.target.value })} />
                                        </div>
                                        <div className="col-md-4 d-flex align-items-end">
                                            <div className="form-check">
                                                <input type="checkbox" className="form-check-input" id="defaultCheck"
                                                    checked={adresaForm.eshte_default} onChange={(e) => setAdresaForm({ ...adresaForm, eshte_default: e.target.checked })} />
                                                <label className="form-check-label" htmlFor="defaultCheck">Adresa kryesore</label>
                                            </div>
                                        </div>
                                    </div>
                                    <button className="btn btn-danger mt-3" onClick={shtoAdrese}>Ruaj Adresen</button>
                                </div>
                            </div>
                        )}

                        {adresat.length > 0 ? (
                            adresat.map(a => (
                                <div key={a.adrese_id} className="card shadow-sm mb-2 border-0">
                                    <div className="card-body d-flex justify-content-between align-items-center">
                                        <div>
                                            <strong>{a.emertimi}</strong>
                                            {a.eshte_default && <span className="badge bg-success ms-2">Kryesore</span>}
                                            <div className="text-muted small">{a.adresa}, {a.qyteti} {a.kodi_postar}</div>
                                        </div>
                                        <button className="btn btn-sm btn-outline-danger" onClick={() => fshiAdrese(a.adrese_id)}>
                                            <FaTrash />
                                        </button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center text-muted py-5">
                                <FaMapMarkerAlt size={48} className="mb-3 opacity-25" />
                                <p>Nuk keni adresa te ruajtura.</p>
                            </div>
                        )}
                    </div>
                )}

                {/* ============ TAB: PROFILI ============ */}
                {activeTab === 'profili' && profili && (
                    <div>
                        <h5 className="mb-3"><FaUser className="me-2 text-danger" />Profili Im</h5>
                        <div className="card shadow-sm border-0">
                            <div className="card-body">
                                {editProfili ? (
                                    <div className="row g-3">
                                        <div className="col-md-6">
                                            <label className="form-label">Emri</label>
                                            <input type="text" className="form-control" value={profilForm.emri}
                                                onChange={(e) => setProfilForm({ ...profilForm, emri: e.target.value })} />
                                        </div>
                                        <div className="col-md-6">
                                            <label className="form-label">Mbiemri</label>
                                            <input type="text" className="form-control" value={profilForm.mbiemri}
                                                onChange={(e) => setProfilForm({ ...profilForm, mbiemri: e.target.value })} />
                                        </div>
                                        <div className="col-md-6">
                                            <label className="form-label">Telefoni</label>
                                            <input type="text" className="form-control" value={profilForm.telefoni}
                                                onChange={(e) => setProfilForm({ ...profilForm, telefoni: e.target.value })} />
                                        </div>
                                        <div className="col-md-6">
                                            <label className="form-label">Adresa</label>
                                            <input type="text" className="form-control" value={profilForm.adresa}
                                                onChange={(e) => setProfilForm({ ...profilForm, adresa: e.target.value })} />
                                        </div>
                                        <div className="col-12">
                                            <button className="btn btn-danger me-2" onClick={ruajProfilin}>Ruaj</button>
                                            <button className="btn btn-secondary" onClick={() => setEditProfili(false)}>Anulo</button>
                                        </div>
                                    </div>
                                ) : (
                                    <div>
                                        <div className="row">
                                            <div className="col-md-6 mb-3">
                                                <small className="text-muted">Emri i plote</small>
                                                <div className="fw-bold">{profili.emri} {profili.mbiemri}</div>
                                            </div>
                                            <div className="col-md-6 mb-3">
                                                <small className="text-muted">Email</small>
                                                <div className="fw-bold">{profili.email}</div>
                                            </div>
                                            <div className="col-md-6 mb-3">
                                                <small className="text-muted">Telefoni</small>
                                                <div className="fw-bold">{profili.telefoni || 'Nuk eshte vendosur'}</div>
                                            </div>
                                            <div className="col-md-6 mb-3">
                                                <small className="text-muted">Adresa</small>
                                                <div className="fw-bold">{profili.adresa || 'Nuk eshte vendosur'}</div>
                                            </div>
                                            <div className="col-md-6 mb-3">
                                                <small className="text-muted">Anetaresuar me</small>
                                                <div className="fw-bold">{new Date(profili.data_regjistrimit).toLocaleDateString('sq-AL')}</div>
                                            </div>
                                        </div>
                                        <button className="btn btn-outline-danger" onClick={() => setEditProfili(true)}>
                                            Edito Profilin
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Spacing per footer */}
            <div style={{ height: '50px' }}></div>
        </div>
    );
};

export default KlientDashboard;