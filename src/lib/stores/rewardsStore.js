import { writable } from 'svelte/store';
import { authStore } from './authStore';

function createRewardsStore() {
    const { subscribe, set, update } = writable({
        points: 0,
        history: [],
        rewards: [
            {
                id: 1,
                name: 'Free Snack',
                points: 100,
                description: 'Get any snack for free'
            },
            {
                id: 2,
                name: '50% Off',
                points: 50,
                description: 'Get 50% off on your next purchase'
            },
            {
                id: 3,
                name: 'Premium Status',
                points: 500,
                description: 'Get premium status with exclusive benefits'
            }
        ]
    });

    return {
        subscribe,
        addPoints: (amount) => {
            update(state => ({
                ...state,
                points: state.points + amount,
                history: [
                    {
                        id: Date.now(),
                        type: 'earned',
                        amount,
                        timestamp: new Date().toISOString()
                    },
                    ...state.history
                ]
            }));
        },
        redeemReward: (rewardId) => {
            update(state => {
                const reward = state.rewards.find(r => r.id === rewardId);
                if (!reward || state.points < reward.points) return state;

                return {
                    ...state,
                    points: state.points - reward.points,
                    history: [
                        {
                            id: Date.now(),
                            type: 'redeemed',
                            rewardId,
                            rewardName: reward.name,
                            points: reward.points,
                            timestamp: new Date().toISOString()
                        },
                        ...state.history
                    ]
                };
            });
        },
        getAvailableRewards: () => {
            const state = get({ subscribe });
            return state.rewards.filter(reward => state.points >= reward.points);
        },
        resetPoints: () => {
            set({
                points: 0,
                history: [],
                rewards: get({ subscribe }).rewards
            });
        }
    };
}

export const rewardsStore = createRewardsStore(); 