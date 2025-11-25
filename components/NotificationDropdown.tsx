
import React, { useEffect, useState } from 'react';
import { Bell, Check } from 'lucide-react';
import { useTranslation } from '../services/translationService';
import { getNotifications, markNotificationRead, subscribeToNotifications } from '../services/api';
import { Notification } from '../types';
import { IconButton } from './UI';

export const NotificationDropdown: React.FC = () => {
    const { t } = useTranslation();
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        // Initial Load
        getNotifications().then(setNotifications);

        // Realtime Subscription
        const subscription = subscribeToNotifications((newNotification) => {
            setNotifications(prev => [newNotification, ...prev]);
        });

        return () => {
            subscription.unsubscribe();
        };
    }, []);

    const unreadCount = notifications.filter(n => !n.read).length;

    const handleMarkRead = (id: string) => {
        markNotificationRead(id).then(() => {
            setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
        });
    };

    return (
        <div className="relative">
            <IconButton onClick={() => setIsOpen(!isOpen)} className="relative">
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
                )}
            </IconButton>

            {isOpen && (
                <>
                    <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)}></div>
                    <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-neutral-dark rounded-xl shadow-lg ring-1 ring-black ring-opacity-5 z-50 overflow-hidden border border-gray-100 dark:border-gray-700">
                        <div className="p-4 border-b border-gray-100 dark:border-gray-700">
                            <h3 className="font-bold text-gray-900 dark:text-white">{t('notifications')}</h3>
                        </div>
                        <div className="max-h-96 overflow-y-auto">
                            {notifications.length > 0 ? (
                                notifications.map(n => (
                                    <div key={n.id} className={`p-4 border-b border-gray-50 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors ${n.read ? 'opacity-60' : ''}`}>
                                        <p className="text-sm text-gray-800 dark:text-gray-200 mb-1">{n.message}</p>
                                        <div className="flex justify-between items-center">
                                            <span className="text-xs text-gray-500">{new Date(n.date).toLocaleDateString()}</span>
                                            {!n.read && (
                                                <button onClick={() => handleMarkRead(n.id)} className="text-xs text-primary-600 hover:text-primary-700 font-medium flex items-center">
                                                    <Check className="w-3 h-3 mr-1" /> {t('admin_mark_read')}
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="p-4 text-center text-gray-500 text-sm">{t('admin_no_notifications')}</div>
                            )}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};
