import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";
import api from "../api/client";

const loadScript = (src) => {
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = src;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

const PremiumPage = () => {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    setLoading(true);
    try {
      // 1. Load Razorpay script
      const res = await loadScript("https://checkout.razorpay.com/v1/checkout.js");
      if (!res) {
        toast.error("Razorpay SDK failed to load. Are you online?");
        setLoading(false);
        return;
      }

      // 2. Call backend to create order
      const orderRes = await api.post("/payment/order");
      const { order } = orderRes.data;

      // 3. Configure Razorpay checkout options
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID, // public key
        amount: order.amount,
        currency: order.currency,
        name: "DevMatch Premium",
        description: "Unlock Premium matchmaking & priority features",
        order_id: order.id,
        handler: async function (response) {
          try {
            // 4. Send payment details to backend for verification
            const verifyRes = await api.post("/payment/verify", {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });

            if (verifyRes.data.success) {
              toast.success("Upgrade successful! Welcome to Premium 👑");
              updateUser(verifyRes.data.user); // update global state
              navigate("/developers"); // redirect back
            }
          } catch (err) {
            toast.error(err.response?.data?.message || "Verification failed");
          }
        },
        prefill: {
          name: user?.name || "",
          email: user?.email || "",
        },
        theme: {
          color: "#6366f1", // Purple-blue brand color
        },
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
    } catch (error) {
      console.error(error);
      toast.error("Failed to initiate payment");
    } finally {
      setLoading(false);
    }
  };

   return (
    <div className="page-content gradient-bg flex items-center justify-center min-h-[calc(100vh-64px)]">
      {/* Background blobs for premium feel */}
      <div className="gradient-blob-1"></div>
      <div className="gradient-blob-2"></div>
      <div className="glass-card max-w-md w-full p-8 text-center relative z-10 fade-in-up">
        <div className="text-5xl mb-4">👑</div>
        <h1 className="text-3xl font-extrabold mb-2 text-white">
          Upgrade to <span className="text-yellow-400">Premium</span>
        </h1>
        <p className="text-slate-400 mb-6 text-sm">
          Unlock the true potential of DevMatch and meet your perfect project partner.
        </p>
        {/* List of Premium features */}
        <div className="text-left space-y-4 mb-8">
          <div className="flex items-start gap-3">
            <span className="text-yellow-400">🤖</span>
            <div>
              <h4 className="font-semibold text-slate-200">Gemini AI Smart Matcher</h4>
              <p className="text-xs text-slate-400">Get detailed matching percentages and explanations of why you match with other developers.</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <span className="text-yellow-400">👑</span>
            <div>
              <h4 className="font-semibold text-slate-200">Gold Premium Badge</h4>
              <p className="text-xs text-slate-400">Stand out in searches and developer cards with a custom gold badging highlight.</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <span className="text-yellow-400">💬</span>
            <div>
              <h4 className="font-semibold text-slate-200">Priority Placement</h4>
              <p className="text-xs text-slate-400">Higher visibility in lists so developers find and message you first.</p>
            </div>
          </div>
        </div>
        {/* Pricing tag */}
        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-4 mb-8">
          <span className="text-slate-400 text-xs uppercase font-bold tracking-wider">One-Time Payment</span>
          <div className="text-4xl font-extrabold text-white mt-1">₹499</div>
          <span className="text-slate-500 text-xs">Unlock lifetime premium features</span>
        </div>
        {/* Pay Button */}
        <button
          onClick={handlePayment}
          disabled={loading}
          className="w-full btn-primary py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:shadow-[0_0_20px_rgba(234,179,8,0.25)] border border-yellow-500/20"
        >
          <span>{loading ? "Initializing..." : "Upgrade Now 👑"}</span>
        </button>
      </div>
    </div>
  );
};

export default PremiumPage;