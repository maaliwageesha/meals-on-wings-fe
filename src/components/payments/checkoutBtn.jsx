import React from 'react';
import { useStripe } from '@stripe/react-stripe-js';
import Button from '../Button';

const CheckoutButton = ({createOrder2,price}) => {
    const stripe = useStripe();




    const handleClick = async () => {
        let value=""
        if(await createOrder2){
            value =  await createOrder2()
        }
        console.log("Hi hui",value)
        if(value){
        const { error } = await stripe.redirectToCheckout({
            lineItems: [
                {
                    price: 'price_1PKHL7FBa9MFKoRmypGUOTdg', // Replace with your price ID
                    quantity: 1,
                },
            ],
            mode: 'payment',
            successUrl: window.location.origin + '/success/'+value,
            cancelUrl: window.location.origin + '/cancel',
        });

        if (error) {
            console.error('Error:', error);
        }
    }
    };

    const createOrder=()=>{
        createOrder2()
    }

    return (
        <Button onClick={handleClick}>
            Checkout {price}
        </Button>
    );
};

export default CheckoutButton;
