import React from 'react';
import { useStripe } from '@stripe/react-stripe-js';

const CheckoutButton = () => {
    const stripe = useStripe();

    const handleClick = async () => {
        const { error } = await stripe.redirectToCheckout({
            lineItems: [
                {
                    price: 'price_id', // Replace with your price ID
                    quantity: 1,
                },
            ],
            mode: 'payment',
            successUrl: window.location.origin + '/success',
            cancelUrl: window.location.origin + '/cancel',
        });

        if (error) {
            console.error('Error:', error);
        }
    };

    return (
        <button onClick={handleClick}>
            Checkout
        </button>
    );
};

export default CheckoutButton;
