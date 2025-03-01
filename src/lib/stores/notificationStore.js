import { writable } from 'svelte/store';

function createNotificationStore() {
    const { subscribe, set, update } = writable([]);

    return {
        subscribe,
        add: (notification) => {
            const id = Date.now();
            update(notifications => [
                {
                    id,
                    timestamp: new Date().toISOString(),
                    read: false,
                    ...notification
                },
                ...notifications
            ]);
            return id;
        },
        remove: (id) => {
            update(notifications => notifications.filter(n => n.id !== id));
        },
        markAsRead: (id) => {
            update(notifications => 
                notifications.map(n => 
                    n.id === id ? { ...n, read: true } : n
                )
            );
        },
        clear: () => {
            set([]);
        },
        // Simulated email notification
        sendEmail: (to, subject, message) => {
            console.log(`Email sent to ${to}: ${subject}`);
            return true;
        },
        // Simulated SMS notification
        sendSMS: (to, message) => {
            console.log(`SMS sent to ${to}: ${message}`);
            return true;
        }
    };
}

export const notificationStore = createNotificationStore(); 