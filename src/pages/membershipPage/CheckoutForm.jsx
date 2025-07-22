import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { useState } from "react";

export const CheckoutForm = ({ plan, onSuccess, loading }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    const { error: stripeError, paymentIntent } =
      await stripe.confirmCardPayment("your_client_secret_from_backend", {
        payment_method: {
          card: elements.getElement(CardElement),
        },
      });

    if (stripeError) {
      setError(stripeError.message);
    } else {
      onSuccess(paymentIntent);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="border border-gray-300 rounded-lg p-4">
        <CardElement
          options={{
            style: {
              base: {
                fontSize: "16px",
                color: "#424770",
                "::placeholder": {
                  color: "#aab7c4",
                },
              },
              invalid: {
                color: "#9e2146",
              },
            },
          }}
        />
      </div>

      {error && <div className="text-red-500 text-sm">{error}</div>}

      <button
        type="submit"
        disabled={!stripe || loading}
        className={`w-full bg-gradient-to-r from-[#6D7CFF] to-[#A167FF] text-white py-3 rounded-lg font-medium ${
          loading ? "opacity-70" : "hover:opacity-90"
        } transition-opacity`}
      >
        {loading
          ? "Processing..."
          : `Pay ${plan === "yearly" ? "$99" : "$9.99"}`}
      </button>
    </form>
  );
};
