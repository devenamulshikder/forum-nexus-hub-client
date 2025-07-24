import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { use, useState } from "react";
import { AuthContext } from "../../provider/AuthProvider";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import { useNavigate } from "react-router";
import { toast } from "sonner";

export const CheckoutForm = ({ plan }) => {
  const { user } = use(AuthContext);
  const stripe = useStripe();
  const axiosSecure = useAxiosSecure();
  const elements = useElements();
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const planDetails = {
    monthly: {
      name: "Monthly Premium",
      price: 9.99,
      period: "/month",
      priceId: "price_monthly_premium", // Stripe price ID
    },
    yearly: {
      name: "Yearly Premium",
      price: 99.99,
      period: "one-time",
      priceId: "price_yearly_premium", // Stripe price ID
    },
  };
  const currentPlan = planDetails[plan];
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;
    setProcessing(true);
    try {
      const response = await axiosSecure.post("/create-payment-intent", {
        planId: plan,
        amount: Math.round(currentPlan.price * 100),
        currency: "usd",
      });
      const { clientSecret, error: backendError } = response.data;
      if (backendError) {
        setError(backendError);
        setProcessing(false);
        return;
      }

      const cardElement = elements.getElement(CardElement);
      const confirm = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            name: user?.displayName,
            email: user?.email,
          },
        },
      });

      if (confirm.error) {
        setError(confirm.error.message);
        setProcessing(false);
        toast.error("Payment not succeeded and membership update failed");
      } else if (confirm.paymentIntent.status === "succeeded") {
        // setSucceeded(true);
        setProcessing(false);
        axiosSecure.patch(`/users/${user.email}/member`, {
          isMember: true,
        });
        toast.success("Membership upgraded successfully!");
        navigate("/dashboard");
      }
    } catch (err) {
      setError(`An unexpected error occurred. Please try again.`, err);
      toast.error("Payment not succeeded and membership update failed");
      setProcessing(false);
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
        disabled={!stripe || processing}
        className={`w-full bg-gradient-to-r from-[#6D7CFF] to-[#A167FF] text-white py-3 rounded-lg font-medium ${
          processing ? "opacity-70" : "hover:opacity-90"
        } transition-opacity`}
      >
        {processing
          ? "Processing..."
          : `Pay ${plan === "yearly" ? "$99" : "$9.99"}`}
      </button>
    </form>
  );
};
