import { useEffect } from 'react';
import useAuthStore from '../store/useAuthStore';
import useNotificationStore from '../store/useNotificationStore';
import socket from '../services/socket';

const NotificationBell = () => {
    const user = useAuthStore(state => state.user);
    const initSocket = useAuthStore(state => state.initSocket);
    const { notifications, unreadCount, fetchNotifications, fetchUnreadCount, addNotification, markAsRead, markAllAsRead } = useNotificationStore();

    // Sigurohu qe socket-i eshte i lidhur (per rastin kur rifresko faqen)
    useEffect(() => {
        if (user) {
            initSocket();
        }
    }, [user]);

    useEffect(() => {
        if (user) {
            fetchUnreadCount();
            fetchNotifications();

            socket.on('notification', (notification) => {
                addNotification(notification);
            });

            socket.on('porosi_e_re', (data) => {
                if (user.roles?.includes('admin') || user.roles?.includes('menaxher')) {
                    addNotification({
                        _id: Date.now(),
                        type: 'porosi_e_re',
                        title: 'Porosi e re!',
                        message: `Porosi e re #${data.porosi_id} - Totali: ${data.totali}€`,
                        is_read: false,
                        created_at: new Date()
                    });
                }
            });

            return () => {
                socket.off('notification');
                socket.off('porosi_e_re');
            };
        }
    }, [user]);

    return (
        <div className="position-relative d-inline-block">
            <button
                className="btn btn-link text-white position-relative p-1"
                onClick={() => document.getElementById('notif-dropdown').classList.toggle('d-none')}
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

            <div id="notif-dropdown" className="d-none position-absolute end-0 mt-2 shadow rounded bg-white"
                style={{ width: '320px', maxHeight: '400px', overflowY: 'auto', zIndex: 1050 }}>
                <div className="d-flex justify-content-between align-items-center p-2 border-bottom">
                    <strong className="text-dark">Njoftimet</strong>
                    {unreadCount > 0 && (
                        <button className="btn btn-sm btn-outline-primary" onClick={markAllAsRead}>
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
                            onClick={() => !n.is_read && markAsRead(n._id)}
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
        </div>
    );
};

export default NotificationBell;