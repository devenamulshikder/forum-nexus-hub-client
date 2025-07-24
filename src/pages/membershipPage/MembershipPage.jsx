/* eslint-disable no-unused-vars */
import { use, useState } from "react";
import { FaCrown, FaCheckCircle, FaLock, FaArrowRight } from "react-icons/fa";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { AuthContext } from "../../provider/AuthProvider";
import { loadStripe } from "@stripe/stripe-js";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import { CheckoutForm } from "./CheckoutForm";
import { Elements } from "@stripe/react-stripe-js";

const stripePromise = loadStripe(
  "pk_test_51PKmoA04L5nSMEQqqgrADEjX61IdiSsEex5dvt5sJpzTXigY4EOnNcxbN4TAX7PPeeZGLL1BbHlml1FEDnP2TzB000WZhbNC1O"
);

export const MembershipPage = () => {
  const { user } = use(AuthContext);
  const [selectedPlan, setSelectedPlan] = useState("yearly");

  const plans = {
    monthly: {
      name: "Monthly Membership",
      price: "$9.99",
      fullPrice: "$9.99/month",
      discount: "",
      features: [
        "Unlimited posts",
        "Priority support",
        "Special badges",
        "Analytics dashboard",
        "Ad-free experience",
      ],
    },
    yearly: {
      name: "Yearly Membership (Best Value)",
      price: "$99",
      fullPrice: "$8.25/month",
      discount: "Save 17%",
      features: [
        "Everything in Monthly",
        "Golden username",
        "Exclusive content",
        "Early access to features",
        "Profile customization",
      ],
    },
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="max-w-7xl mx-auto px-4 py-12"
    >
      {/* Hero Section */}
      <div className="text-center mb-12">
        <div className="w-20 h-20 mx-auto mb-4 flex items-center justify-center rounded-[15px] bg-gradient-to-br from-[#6D7CFF] to-[#A167FF]">
          <FaCrown className="text-white text-3xl" />
        </div>
        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-br from-[#6D7CFF] to-[#A167FF] bg-clip-text text-transparent mb-4">
          Upgrade Your Experience
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Join our premium community and unlock exclusive features that
          supercharge your forum experience.
        </p>
      </div>

      {/* Plans Toggle */}
      <div className="flex justify-center mb-8">
        <div className="inline-flex bg-white p-1 rounded-lg shadow-sm border border-gray-200">
          {Object.keys(plans).map((planKey) => (
            <button
              key={planKey}
              onClick={() => setSelectedPlan(planKey)}
              className={`px-6 py-3 rounded-md font-medium transition-colors ${
                selectedPlan === planKey
                  ? "bg-gradient-to-r from-[#6D7CFF] to-[#A167FF] text-white"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              {planKey === "yearly" ? "Annual Plan" : "Monthly Plan"}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
        {/* Plan Features */}
        <motion.div
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-8"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 flex items-center justify-center rounded-[15px] bg-gradient-to-br from-[#6D7CFF] to-[#A167FF]">
              <FaCrown className="text-white text-xl" />
            </div>
            <h2 className="text-2xl font-bold bg-gradient-to-br from-[#6D7CFF] to-[#A167FF] bg-clip-text text-transparent">
              {plans[selectedPlan].name}
            </h2>
          </div>

          <div className="mb-8">
            <div className="flex items-end gap-2">
              <span className="text-4xl font-bold text-gray-800">
                {plans[selectedPlan].price}
              </span>
              {selectedPlan === "yearly" && (
                <span className="text-sm text-gray-500 mb-1">
                  {plans[selectedPlan].fullPrice}
                </span>
              )}
            </div>
            {plans[selectedPlan].discount && (
              <span className="inline-block mt-1 px-2 py-1 bg-green-100 text-green-700 rounded-full text-sm">
                {plans[selectedPlan].discount}
              </span>
            )}
          </div>

          <ul className="space-y-4 mb-8">
            {plans[selectedPlan].features.map((feature, i) => (
              <li key={i} className="flex items-start gap-3">
                <FaCheckCircle className="text-green-500 mt-1 flex-shrink-0" />
                <span className="text-gray-700">{feature}</span>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-2 text-sm text-gray-500">
            <FaLock className="text-gray-400" />
            <span>Secure payment processing</span>
          </div>
        </motion.div>

        {/* Payment Form */}
        <motion.div
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-8"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 flex items-center justify-center rounded-[15px] bg-gradient-to-br from-[#6D7CFF] to-[#A167FF]">
              <FaLock className="text-white text-xl" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800">
              Payment Details
            </h2>
          </div>

          {user ? (
            <>
              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <img
                    src={user.photoURL}
                    alt={user.displayName}
                    className="w-10 h-10 rounded-full"
                    referrerPolicy="no-referrer"
                  />
                  <div>
                    <h3 className="font-medium">{user.displayName}</h3>
                    <p className="text-sm text-gray-500">{user.email}</p>
                  </div>
                </div>
              </div>
              <Elements stripe={stripePromise}>
                <CheckoutForm
                  plan={selectedPlan}
                />
              </Elements>
            </>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-600 mb-4">
                Please sign in to upgrade your membership
              </p>
              <button className="flex items-center gap-2 bg-gradient-to-r from-[#6D7CFF] to-[#A167FF] text-white px-6 py-3 rounded-lg font-medium hover:opacity-90 transition-opacity mx-auto">
                Sign In <FaArrowRight />
              </button>
            </div>
          )}
        </motion.div>
      </div>

      {/* Money Back Guarantee */}
      <div className="mt-12 text-center max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 bg-green-50 text-green-700 px-4 py-2 rounded-full mb-3">
          <FaCheckCircle />
          <span>30-day money back guarantee</span>
        </div>
        <p className="text-gray-600">
          We're confident you'll love our premium features. If you're not
          satisfied, we'll refund your payment - no questions asked.
        </p>
      </div>
    </motion.div>
  );
};
