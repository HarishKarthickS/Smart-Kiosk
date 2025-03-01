import { writable, get } from 'svelte/store';
import { notificationStore } from './notificationStore';

// Initial machine data
const initialMachines = [
    {
        id: 1,
        name: 'Snack Machine A1',
        location: 'Main Hall',
        coordinates: { lat: 40.7128, lng: -74.0060 },
        stockLevel: 85,
        totalOrders: 150,
        likes: 45,
        rating: 4.5,
        status: 'operational',
        maintenanceSchedule: null,
        orderHistory: [],
        lastRestocked: new Date().toISOString(),
        maxStock: 100,
        pricePerItem: 2.50,
        reorderThreshold: 20,
        operatingHours: {
            start: '06:00',
            end: '22:00'
        },
        type: 'snack',
        uptime: 99.8,
        averageOrderValue: 3.25,
        lastMaintenance: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        maintenanceFrequency: 45, // days
        settings: {
            temperature: 20,
            paymentMethods: ['card', 'mobile'],
            acceptsCash: true
        }
    },
    {
        id: 2,
        name: 'Drink Machine B2',
        location: 'Cafeteria',
        stockLevel: 15,
        totalOrders: 220,
        likes: 67,
        status: 'operational',
        maintenanceSchedule: null,
        orderHistory: [],
        lastRestocked: new Date().toISOString(),
        maxStock: 100
    },
    {
        id: 3,
        name: 'Coffee Machine C3',
        location: 'Office Area',
        stockLevel: 50,
        totalOrders: 180,
        likes: 89,
        status: 'operational',
        maintenanceSchedule: null,
        orderHistory: [],
        lastRestocked: new Date().toISOString(),
        maxStock: 100
    }
];

function createMachineStore() {
    const { subscribe, set, update } = writable(initialMachines);

    return {
        subscribe,
        restock: (id) => {
            update(machines => {
                return machines.map(machine => {
                    if (machine.id === id) {
                        notificationStore.add({
                            type: 'success',
                            message: `${machine.name} has been restocked.`
                        });
                        return {
                            ...machine,
                            stockLevel: machine.maxStock,
                            lastRestocked: new Date().toISOString()
                        };
                    }
                    return machine;
                });
            });
        },
        placeOrder: async (id, paymentDetails) => {
            // Simulate payment processing
            const machine = get({ subscribe }).find(m => m.id === id);
            if (!machine || machine.stockLevel <= 0) return false;

            try {
                // Simulate payment gateway call
                const paymentResult = await simulatePayment(paymentDetails);
                if (!paymentResult.success) throw new Error(paymentResult.message);

                update(machines => {
                    return machines.map(m => {
                        if (m.id === id) {
                            const newOrder = {
                                id: Date.now(),
                                timestamp: new Date().toISOString(),
                                quantity: 1,
                                amount: m.pricePerItem,
                                paymentMethod: paymentDetails.method,
                                status: 'completed'
                            };

                            // Check if stock is below threshold after order
                            if (m.stockLevel - 1 <= m.reorderThreshold) {
                                notificationStore.add({
                                    type: 'warning',
                                    message: `Low stock alert for ${m.name}`,
                                    priority: 'high'
                                });
                            }

                            return {
                                ...m,
                                stockLevel: m.stockLevel - 1,
                                totalOrders: m.totalOrders + 1,
                                orderHistory: [newOrder, ...m.orderHistory].slice(0, 10),
                                averageOrderValue: (m.averageOrderValue * m.totalOrders + m.pricePerItem) / (m.totalOrders + 1)
                            };
                        }
                        return m;
                    });
                });
                return true;
            } catch (error) {
                notificationStore.add({
                    type: 'error',
                    message: `Payment failed: ${error.message}`
                });
                return false;
            }
        },
        addLike: (id) => {
            update(machines => {
                return machines.map(machine => {
                    if (machine.id === id) {
                        return {
                            ...machine,
                            likes: machine.likes + 1
                        };
                    }
                    return machine;
                });
            });
        },
        scheduleMaintenance: (id, date) => {
            update(machines => {
                return machines.map(machine => {
                    if (machine.id === id) {
                        notificationStore.add({
                            type: 'info',
                            message: `Maintenance scheduled for ${machine.name} on ${new Date(date).toLocaleDateString()}`
                        });
                        return {
                            ...machine,
                            status: 'maintenance-scheduled',
                            maintenanceSchedule: date
                        };
                    }
                    return machine;
                });
            });
        },
        updateSettings: (id, settings) => {
            update(machines => {
                return machines.map(machine => {
                    if (machine.id === id) {
                        return {
                            ...machine,
                            settings: { ...machine.settings, ...settings }
                        };
                    }
                    return machine;
                });
            });
        },
        addRating: (id, rating, comment) => {
            update(machines => {
                return machines.map(machine => {
                    if (machine.id === id) {
                        const newRating = (machine.rating * machine.totalOrders + rating) / (machine.totalOrders + 1);
                        return {
                            ...machine,
                            rating: newRating
                        };
                    }
                    return machine;
                });
            });
        },
        generateReport: (id, startDate, endDate) => {
            const machine = get({ subscribe }).find(m => m.id === id);
            if (!machine) return null;

            // Filter orders within date range
            const orders = machine.orderHistory.filter(order => {
                const orderDate = new Date(order.timestamp);
                return orderDate >= startDate && orderDate <= endDate;
            });

            return {
                machineId: machine.id,
                machineName: machine.name,
                period: { startDate, endDate },
                totalOrders: orders.length,
                totalRevenue: orders.reduce((sum, order) => sum + order.amount, 0),
                averageOrderValue: orders.length > 0 
                    ? orders.reduce((sum, order) => sum + order.amount, 0) / orders.length 
                    : 0,
                stockLevels: machine.stockLevel,
                uptime: machine.uptime
            };
        },
        filterByName: (searchTerm) => {
            return get({ subscribe }).filter(machine => 
                machine.name.toLowerCase().includes(searchTerm.toLowerCase())
            );
        },
        getLowStockMachines: () => {
            return get({ subscribe }).filter(machine => 
                machine.stockLevel <= machine.reorderThreshold
            );
        },
        groupByLocation: () => {
            return get({ subscribe }).reduce((groups, machine) => {
                const location = machine.location;
                if (!groups[location]) {
                    groups[location] = [];
                }
                groups[location].push(machine);
                return groups;
            }, {});
        },
        addMachine: (machineData) => {
            update(machines => {
                const newMachine = {
                    id: Math.max(...machines.map(m => m.id)) + 1,
                    stockLevel: 100,
                    totalOrders: 0,
                    likes: 0,
                    status: 'operational',
                    maintenanceSchedule: null,
                    orderHistory: [],
                    lastRestocked: new Date().toISOString(),
                    maxStock: 100,
                    pricePerItem: 2.50,
                    reorderThreshold: 20,
                    uptime: 100,
                    averageOrderValue: 0,
                    ...machineData
                };
                notificationStore.add({
                    type: 'success',
                    message: `New machine ${newMachine.name} has been added.`
                });
                return [...machines, newMachine];
            });
        }
    };
}

// Simulate payment processing
async function simulatePayment(details) {
    return new Promise((resolve) => {
        setTimeout(() => {
            const success = Math.random() > 0.1; // 90% success rate
            resolve({
                success,
                message: success ? 'Payment processed successfully' : 'Payment declined'
            });
        }, 1000);
    });
}

export const machineStore = createMachineStore(); 