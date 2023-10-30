import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import React from 'react'
import Payment from './Payment';

const Process = () => {
    const stripePromise = loadStripe(
      "pk_test_51KzyYrSHJpXuNXzuNZBLqfnTCTWow3XVsUcySF01SVn0ldHcEW28Luq8aYM3gsubCAdHw6A9nK6j2N1NKdabs5j400kJ4yVIKa"
    );
  return (
    <div>
      <Elements stripe={stripePromise}>
        <Payment />
      </Elements>
    </div>
  );
}

export default Process
