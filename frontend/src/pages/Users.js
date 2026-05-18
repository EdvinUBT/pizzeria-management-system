import { useState, useEffect } from 'react';
import API from '../services/api';
import { FaPlus, FaEdit, FaTrash, FaUserShield, FaSearch, FaCheck, FaBan } from 'react-icons/fa';

const Users = () => {
    const [users, setUsers] = useState([]);
    const [roles, setRoles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [currentId, setCurrentId] = useState(null);
    const [search, setSearch] = useState('');
    const [formData, setFormData] = useState({
        emri: '',
        mbiemri: '',
        email: '',
        password: '',
        phone_number: '',
        statusi: 'aktiv'
    });
    const [showRoleForm, setShowRoleForm] = useState(null);
    const [selectedRole, setSelectedRole] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        fetchUsers();
        fetchRoles();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await API.get('/users');
            setUsers(response.data.te_dhena);
        } catch (error) {
            console.error('Gabim:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchRoles = async () => {
        try {
            const response = await API.get('/roles');
            setRoles(response.data.te_dhena);
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
            if (editMode) {
                const { password, ...updateData } = formData;
                await API.put(`/users/${currentId}`, updateData);
                setSuccess('Perdoruesi u perditesua me sukses!');
            } else {
                await API.post('/users', formData);
                setSuccess('Perdoruesi u krijua me sukses!');
            }
            fetchUsers();
            resetForm();
        } catch (err) {
            setError(err.response?.data?.mesazhi || 'Gabim!');
        }
    };

    const handleEdit = (user) => {
        setFormData({
            emri: user.emri,
            mbiemri: user.mbiemri,
            email: user.email,
            password: '',
            phone_number: user.phone_number || '',
            statusi: user.statusi
        });
        setCurrentId(user.id);
        setEditMode(true);
        setShowForm(true);
        setError('');
        setSuccess('');
    };

    const handleStatusChange = async (id, statusi) => {
        try {
            await API.put(`/users/${id}/statusi`, { statusi });
            setSuccess('Statusi u ndryshua!');
            fetchUsers();
        } catch (err) {
            setError(err.response?.data?.mesazhi || 'Gabim!');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('A jeni te sigurt qe doni te fshini kete perdorues?')) {
            try {
                await API.delete(`/users/${id}`);
                setSuccess('Perdoruesi u fshi me sukses!');
                fetchUsers();
            } catch (err) {
                setError(err.response?.data?.mesazhi || 'Gabim!');
            }
        }
    };

    const handleCaktoRol = async (userId) => {
        if (!selectedRole) return;
        try {
            await API.post('/user-roles', { user_id: userId, role_id: parseInt(selectedRole) });
            setSuccess('Roli u caktua me sukses!');
            fetchUsers();
            setShowRoleForm(null);
            setSelectedRole('');
        } catch (err) {
            setError(err.response?.data?.mesazhi || 'Gabim!');
        }
    };

    const handleHiqRol = async (userId, roleId) => {
        if (window.confirm('A doni te hiqni kete rol?')) {
            try {
                await API.delete(`/user-roles/${userId}/${roleId}`);
                setSuccess('Roli u hoq me sukses!');
                fetchUsers();
            } catch (err) {
                setError(err.response?.data?.mesazhi || 'Gabim!');
            }
        }
    };

    const resetForm = () => {
        setFormData({ emri: '', mbiemri: '', email: '', password: '', phone_number: '', statusi: 'aktiv' });
        setEditMode(false);
        setCurrentId(null);
        setShowForm(false);
    };

    const filteredUsers = users.filter(u => {
        return u.emri.toLowerCase().includes(search.toLowerCase()) ||
            u.mbiemri.toLowerCase().includes(search.toLowerCase()) ||
            u.email.toLowerCase().includes(search.toLowerCase());
    });

    const getStatusBadge = (statusi) => {
        const classes = { 'aktiv': 'bg-success', 'joaktiv': 'bg-secondary', 'bllokuar': 'bg-danger' };
        return classes[statusi] || 'bg-secondary';
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
                <h2><FaUserShield className="me-2 text-danger" />Perdoruesit</h2>
                <button className="btn btn-danger" onClick={() => { setShowForm(!showForm); resetForm(); }}>
                    <FaPlus className="me-1" /> {showForm ? 'Mbyll Formen' : 'Shto Perdorues'}
                </button>
            </div>

            {error && <div className="alert alert-danger">{error}</div>}
            {success && <div className="alert alert-success">{success}</div>}

            {showForm && (
                <div className="card shadow-sm mb-4">
                    <div className="card-body">
                        <h5>{editMode ? 'Perditeso Perdoruesin' : 'Shto Perdorues te Ri'}</h5>
                        <form onSubmit={handleSubmit}>
                            <div className="row">
                                <div className="col-md-3 mb-3">
                                    <label className="form-label">Emri</label>
                                    <input type="text" className="form-control" name="emri" value={formData.emri} onChange={handleChange} required />
                                </div>
                                <div className="col-md-3 mb-3">
                                    <label className="form-label">Mbiemri</label>
                                    <input type="text" className="form-control" name="mbiemri" value={formData.mbiemri} onChange={handleChange} required />
                                </div>
                                <div className="col-md-3 mb-3">
                                    <label className="form-label">Email</label>
                                    <input type="email" className="form-control" name="email" value={formData.email} onChange={handleChange} required />
                                </div>
                                <div className="col-md-3 mb-3">
                                    <label className="form-label">Telefoni</label>
                                    <input type="text" className="form-control" name="phone_number" value={formData.phone_number} onChange={handleChange} />
                                </div>
                                {!editMode && (
                                    <div className="col-md-3 mb-3">
                                        <label className="form-label">Fjalekalimi</label>
                                        <input type="password" className="form-control" name="password" value={formData.password} onChange={handleChange} required />
                                    </div>
                                )}
                                <div className="col-md-3 mb-3">
                                    <label className="form-label">Statusi</label>
                                    <select className="form-select" name="statusi" value={formData.statusi} onChange={handleChange}>
                                        <option value="aktiv">Aktiv</option>
                                        <option value="joaktiv">Joaktiv</option>
                                        <option value="bllokuar">Bllokuar</option>
                                    </select>
                                </div>
                            </div>
                            <button type="submit" className="btn btn-danger me-2">{editMode ? 'Perditeso' : 'Ruaj'}</button>
                            <button type="button" className="btn btn-secondary" onClick={resetForm}>Anulo</button>
                        </form>
                    </div>
                </div>
            )}

            <div className="row mb-3">
                <div className="col-md-4">
                    <div className="input-group">
                        <span className="input-group-text"><FaSearch /></span>
                        <input type="text" className="form-control" placeholder="Kerko perdorues..." value={search} onChange={(e) => setSearch(e.target.value)} />
                    </div>
                </div>
            </div>

            <div className="card shadow-sm">
                <div className="card-body">
                    <table className="table table-hover">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Emri</th>
                                <th>Mbiemri</th>
                                <th>Email</th>
                                <th>Rolet</th>
                                <th>Statusi</th>
                                <th>Veprimet</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredUsers.length > 0 ? (
                                filteredUsers.map((u) => (
                                    <tr key={u.id}>
                                        <td>{u.id}</td>
                                        <td>{u.emri}</td>
                                        <td>{u.mbiemri}</td>
                                        <td>{u.email}</td>
                                        <td>
                                            {u.rolet ? u.rolet.split(',').map((r, i) => (
                                                <span key={i} className="badge bg-info me-1">{r}</span>
                                            )) : <span className="text-muted">Pa rol</span>}
                                            <button className="btn btn-sm btn-outline-success ms-1" onClick={() => setShowRoleForm(showRoleForm === u.id ? null : u.id)} title="Menaxho rolet">+</button>
                                            {showRoleForm === u.id && (
                                                <div className="mt-2 d-flex">
                                                    <select className="form-select form-select-sm me-1" style={{ width: '120px' }} value={selectedRole} onChange={(e) => setSelectedRole(e.target.value)}>
                                                        <option value="">Zgjidh</option>
                                                        {roles.map(r => (
                                                            <option key={r.id} value={r.id}>{r.emertimi}</option>
                                                        ))}
                                                    </select>
                                                    <button className="btn btn-sm btn-success" onClick={() => handleCaktoRol(u.id)}>Cakto</button>
                                                </div>
                                            )}
                                        </td>
                                        <td>
                                            <span className={`badge ${getStatusBadge(u.statusi)}`}>{u.statusi}</span>
                                        </td>
                                        <td>
                                            {u.statusi === 'aktiv' ? (
                                                <button className="btn btn-sm btn-outline-warning me-1" onClick={() => handleStatusChange(u.id, 'joaktiv')} title="Deaktivizo"><FaBan /></button>
                                            ) : (
                                                <button className="btn btn-sm btn-outline-success me-1" onClick={() => handleStatusChange(u.id, 'aktiv')} title="Aktivizo"><FaCheck /></button>
                                            )}
                                            <button className="btn btn-sm btn-outline-primary me-1" onClick={() => handleEdit(u)}><FaEdit /></button>
                                            <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(u.id)}><FaTrash /></button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr><td colSpan="7" className="text-center text-muted">Nuk ka perdorues ende</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Users;