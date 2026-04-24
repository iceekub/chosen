import React, { useState } from "react";
import { ArrowRight, Loader2, CheckCircle } from "lucide-react";

const SignupForm = ({ full = false }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    organization: "",
    phone: "",
    message: "",
  });
  const [status, setStatus] = useState("idle"); // idle, loading, success, error
  const [errorMessage, setErrorMessage] = useState("");

  const formatPhoneNumber = (value) => {
    if (!value) return value;
    const phoneNumber = value.replace(/[^\d]/g, "");
    const phoneNumberLength = phoneNumber.length;
    if (phoneNumberLength < 4) return phoneNumber;
    if (phoneNumberLength < 7) {
      return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3)}`;
    }
    return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(
      3,
      6,
    )}-${phoneNumber.slice(6, 10)}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email) return;

    setStatus("loading");
    setErrorMessage("");

    const payload = {
      name: formData.name.trim(),
      email: formData.email.trim(),
      company: formData.organization.trim(),
      source: "website",
      message: formData.message.trim(),
      phone: formData.phone.trim(),
    };

    try {
      // 1. Save to Supabase (CRM)
      const crmRes = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!crmRes.ok) {
        const json = await crmRes.json().catch(() => ({}));
        throw new Error(json.error || "Failed to save to CRM");
      }

      // 2. Send Email Notification
      await fetch("/api/email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: "hello@chosenapp.com",
          subject: `Web Inquiry: ${formData.organization}`,
          text: `
NEW INQUIRY FROM CHOSEN.APP

Name: ${formData.name}
Organization: ${formData.organization}
Email: ${formData.email}
Phone: ${formData.phone || "Not provided"}

Message:
${formData.message || "No message provided."}

---
Sent via Chosen Corporate Website
          `,
        }),
      }).catch((err) => console.error("Email notification failed:", err));

      setStatus("success");
    } catch (err) {
      console.error("Submission error:", err);
      setErrorMessage(err.message || "Something went wrong. Please try again.");
      setStatus("error");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "phone") {
      setFormData({ ...formData, phone: formatPhoneNumber(value) });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  if (status === "success") {
    return (
      <div className="flex flex-col items-center justify-center p-12 space-y-4 animate-in fade-in zoom-in duration-500">
        <div className="w-16 h-16 rounded-full bg-[#B4926C]/20 flex items-center justify-center border border-[#B4926C]/30">
          <CheckCircle className="w-8 h-8 text-[#B4926C]" />
        </div>
        <div className="space-y-1 text-center">
          <h3 className="font-serif text-2xl text-white">Message Sent.</h3>
          <p className="text-sm text-[#FEECD3]/60">
            We'll be in touch with you shortly.
          </p>
        </div>
      </div>
    );
  }

  const inputClasses =
    "w-full bg-transparent border-b border-white/10 py-4 px-2 text-white placeholder:text-[#FEECD3]/50 focus:outline-none focus:border-[#B4926C]/50 transition-all duration-500 font-light text-base";
  const labelClasses =
    "text-xs uppercase tracking-[0.2em] text-white font-semibold ml-2";

  return (
    <div className="w-full max-w-2xl mx-auto">
      {status === "error" && (
        <div className="mb-8 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-200 text-sm text-center">
          {errorMessage}
        </div>
      )}

      <form onSubmit={handleSubmit} className="text-left space-y-12">
        {full && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-12">
            {/* Row 1: Name and Organization */}
            <div className="space-y-2 group">
              <label className={labelClasses}>Name</label>
              <input
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                placeholder="Jane Smith"
                className={inputClasses}
              />
            </div>
            <div className="space-y-2 group">
              <label className={labelClasses}>Organization</label>
              <input
                name="organization"
                required
                value={formData.organization}
                onChange={handleChange}
                placeholder="Church or Ministry Name"
                className={inputClasses}
              />
            </div>

            {/* Row 2: Email and Phone */}
            <div className="space-y-2 group">
              <label className={labelClasses}>Email Address</label>
              <input
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="jane@example.com"
                className={inputClasses}
              />
            </div>
            <div className="space-y-2 group">
              <label className={labelClasses}>Phone (Optional)</label>
              <input
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                placeholder="(555) 000-0000"
                className={inputClasses}
              />
            </div>

            {/* Row 3: Message */}
            <div className="md:col-span-2 space-y-2 group">
              <label className={labelClasses}>Message (Optional)</label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="How can we support your mission?"
                rows="2"
                className={`${inputClasses} resize-none`}
              />
            </div>
          </div>
        )}

        {!full && (
          <div className="relative group max-w-md mx-auto">
            <input
              name="email"
              type="email"
              required
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              className={`${inputClasses} text-center pr-12`}
            />
            <button
              type="submit"
              disabled={status === "loading"}
              className="absolute right-0 bottom-4 text-[#B4926C] hover:text-white transition-colors disabled:opacity-50"
            >
              {status === "loading" ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <ArrowRight className="w-6 h-6" />
              )}
            </button>
          </div>
        )}

        {full && (
          <div className="flex flex-col items-center gap-8 pt-4">
            <button
              type="submit"
              disabled={status === "loading"}
              className="group relative px-12 py-4 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 transition-all duration-500 overflow-hidden shadow-2xl"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-[#B4926C]/0 via-[#B4926C]/10 to-[#B4926C]/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
              <span className="relative text-[#FEECD3] font-bold tracking-widest uppercase text-sm flex items-center gap-3">
                {status === "loading" ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    Get in touch
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </span>
            </button>

            <p className="text-[10px] text-[#FEECD3]/20 uppercase tracking-widest text-center leading-relaxed font-medium max-w-sm">
              By joining, you agree to receive updates about Chosen. <br /> No
              spam, and your info is never sold or shared.
            </p>
          </div>
        )}
      </form>
    </div>
  );
};

export default SignupForm;
