import React from 'react';
import { Elements, useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Link, Head } from '@inertiajs/react';
const stripePromise = loadStripe('pk_test_51O1qFMKiAN37OnJdRM4XJjzgprdk3m5HxLeIMuh2QGDCD2gcKugP8mekcHMBbpv3d2FfbkSqeld7sCn52HBrikij00PYqMtLgp');

const CheckoutForm = () => {
    const stripe = useStripe();
    const elements = useElements();

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!stripe || !elements) {
            return;
        }

        const result = await stripe.createPaymentMethod({
            type: 'card',
            card: elements.getElement(CardElement),
        });

        if (result.error) {
            console.error(result.error.message);
        } else {
            // Handle successful payment
            console.log(result.paymentMethod);
        }
    };

    return (
        
        <div style={{ margin: "150px" }}>
            <div style={{ border: "1px solid #ccc", borderRadius: "8px", padding: "20px" }}>
                <form onSubmit={handleSubmit}>
                    <CardElement />
                    <button type="submit" disabled={!stripe}>
                        Pay
                    </button>
                </form>
            </div>
        </div>
    );
};

const Stripee = () => {
    return (
        <Elements stripe={stripePromise}>
            <CheckoutForm />
        </Elements>
    );
};

export default Stripee;
