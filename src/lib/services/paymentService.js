import { rewardsStore } from '../stores/rewardsStore';
import { notificationStore } from '../stores/notificationStore';

export async function processPayment(amount, paymentDetails) {
    try {
        // Simulate payment processing delay
        await new Promise(resolve => setTimeout(resolve, 1500));

        // Validate card details (simple validation for demo)
        if (paymentDetails.method === 'card') {
            if (!validateCard(paymentDetails)) {
                throw new Error('Invalid card details');
            }
        }

        // Simulate successful payment (90% success rate)
        const success = Math.random() > 0.1;

        if (success) {
            // Add reward points (1 point per dollar spent)
            const points = Math.floor(amount);
            rewardsStore.addPoints(points);

            notificationStore.add({
                type: 'success',
                message: `Payment successful! You earned ${points} reward points.`
            });

            return {
                success: true,
                transactionId: `TX${Date.now()}`,
                points
            };
        } else {
            throw new Error('Payment declined by bank');
        }
    } catch (error) {
        notificationStore.add({
            type: 'error',
            message: `Payment failed: ${error.message}`
        });

        return {
            success: false,
            error: error.message
        };
    }
}

function validateCard(details) {
    // Simple validation for demo purposes
    const { number, expiry, cvv } = details;
    
    // Check card number (should be 16 digits)
    if (!/^\d{16}$/.test(number)) return false;
    
    // Check expiry (should be MM/YY format)
    if (!/^\d{2}\/\d{2}$/.test(expiry)) return false;
    
    // Check CVV (should be 3 digits)
    if (!/^\d{3}$/.test(cvv)) return false;
    
    // Check expiry date is not in the past
    const [month, year] = expiry.split('/');
    const expiryDate = new Date(2000 + parseInt(year), parseInt(month) - 1);
    if (expiryDate < new Date()) return false;
    
    return true;
}

export function generateReceipt(transaction) {
    return {
        transactionId: transaction.transactionId,
        timestamp: new Date().toISOString(),
        amount: transaction.amount,
        paymentMethod: transaction.paymentMethod,
        pointsEarned: transaction.points,
        items: transaction.items
    };
} 