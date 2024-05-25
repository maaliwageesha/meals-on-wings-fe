import React from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import CheckoutButton from './checkoutBtn';


const stripePromise = loadStripe('pk_test_51PKDYxFBa9MFKoRmISSMuFKG5X4baS4QoFx7eI3x2M1OvGekdOFUOs2fIap74CtckrXjbLa2osULCSztQrUV7GmJ00511Rv5f0'); // Replace with your Stripe test publishable key

const StripeContainer = () => {
    return (
        <Elements stripe={stripePromise}>
            <CheckoutButton />
        </Elements>
    );
};

export default StripeContainer;
