import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import socket from '../services/socket';
import API from '../services/api';

const NotificationBell = () => {
    const { user } = useAuth();
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [showDropdown, setShowDropdown] = useState(false);

    useEffect(() => {
        if (user) {
            fetchUnreadCount();
            fetchNotifications();

            socket.on('notification', (notification) => {
                setNotifications(prev => [notification, ...prev]);
                setUnreadCount(prev => prev + 1);
            });

            socket.on('porosi_e_re', (data) => {
                if (user.roles?.includes('admin') || user.roles?.includes('menaxher')) {
                    setNotifications(prev => [{
                        _id: Date.now(),
                        type: 'porosi_e_re',
                        title: 'Porosi e re!',
                        message: `Porosi e re #${data.porosi_id} - Totali: ${data.totali}€`,
                        is_read: false,
                        created_at: new Date()
                    }, ...prev]);
                    setUnreadCount(prev => prev + 1);
                }
            });

            return () => {
                socket.off('notification');
                socket.off('porosi_e_re');
            };
        }
    }, [user]);

    const fetchUnreadCount = async () => {
        try {
            const res = await API.get('/notifications/unread-count');
            setUnreadCount(res.data.count);
        } catch (error) {
            console.error('Gabim:', error);
        }
    };

    const fetchNotifications = async () => {
        try {
            const res = await API.get('/notifications?limit=10');
            setNotifications(res.data.notifications || []);
        } catch (error) {
            console.error('Gabim:', error);
        }
    };

    const handleMarkAllRead = async () => {
        try {
            await API.put('/notifications/mark-all-read');
            setUnreadCount(0);
            setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
        } catch (error) {
            console.error('Gabim:', error);
        }
    };

    const handleMarkAsRead = async (id) => {
        try {
            await API.put(`/notifications/${id}/read`);
            setUnreadCount(prev => Math.max(0, prev - 1));
            setNotifications(prev => prev.map(n => n._id === id ? { ...n, is_read: true } : n));
        } catch (error) {
            console.error('Gabim:', error);
        }
    };

    return (
        <div className="position-relative d-inline-block">
            <button
                className="btn btn-link text-white position-relative p-1"
                onClick={() => setShowDropdown(!showDropdown)}
                style={{ fontSize: '1.3rem', textDecoration: 'none' }}
            >
                🔔
                {unreadCount > 0 && (
                    <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
                        style={{ fontSize: '0.65rem' }}>
                        {unreadCount > 99 ? '99+' : unreadCount}
                    </span>
                )}
            </button>

            {showDropdown && (
                <div className="position-absolute end-0 mt-2 shadow rounded bg-white"
                    style={{ width: '320px', maxHeight: '400px', overflowY: 'auto', zIndex: 1050 }}>
                    <div className="d-flex justify-content-between align-items-center p-2 border-bottom">
                        <strong className="text-dark">Njoftimet</strong>
                        {unreadCount > 0 && (
                            <button className="btn btn-sm btn-outline-primary" onClick={handleMarkAllRead}>
                                Sheno te gjitha
                            </button>
                        )}
                    </div>

                    {notifications.length === 0 ? (
                        <div className="p-3 text-center text-muted">Nuk ka njoftime</div>
                    ) : (
                        notifications.map(n => (
                            <div
                                key={n._id}
                                className={`p-2 border-bottom ${!n.is_read ? 'bg-light' : ''}`}
                                style={{ cursor: 'pointer' }}
                                onClick={() => !n.is_read && handleMarkAsRead(n._id)}
                            >
                                <div className="d-flex justify-content-between">
                                    <strong className="text-dark" style={{ fontSize: '0.85rem' }}>{n.title}</strong>
                                    {!n.is_read && <span className="badge bg-primary" style={{ fontSize: '0.6rem' }}>E re</span>}
                                </div>
                                <div className="text-muted" style={{ fontSize: '0.8rem' }}>{n.message}</div>
                                <div className="text-muted" style={{ fontSize: '0.7rem' }}>
                                    {new Date(n.created_at).toLocaleString('sq-AL')}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
};

export default NotificationBell;