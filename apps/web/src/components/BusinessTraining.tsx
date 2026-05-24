import React, { useState } from "react";
import { Sparkles, Calendar, Briefcase, Mail, CheckCircle2, ShieldCheck, Heart } from "lucide-react";

export function BusinessTraining() {
  const [formData, setFormData] = useState({
    companyName: "",
    contactName: "",
    email: "",
    teamSize: "1-10",
    description: ""
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.companyName || !formData.email) return;
    setIsSubmitted(true);
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-12 md:py-20 space-y-16">
      
      {/* Intro Banner */}
      <div className="text-center max-w-2xl mx-auto">
        <span className="text-[10px] uppercase tracking-widest font-bold text-slate-400 bg-slate-100 border border-slate-200/50 px-3 py-1 rounded-full">
          Corporate training by FutureLab
        </span>
        <h2 className="font-sans font-bold text-3xl md:text-5xl text-slate-900 mt-4 leading-tight tracking-tight">
          AI & Tech Adoption <br className="hidden sm:inline" />
          for Modern Workforces.
        </h2>
        <p className="text-slate-500 text-xs md:text-sm mt-4 leading-relaxed">
          We help teams adopt technology safely. Learn prompting fundamentals, data privacy guidelines, and digital accessibility consulting.
        </p>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          {
            icon: Sparkles,
            title: "Corporate AI Workshops",
            desc: "Upskill your staff to use ChatGPT and LLMs safely without leaking confidential company data or passwords online.",
            color: "bg-blue-50/50 text-blue-600 border-blue-100"
          },
          {
            icon: Briefcase,
            title: "Plain-Language Consulting",
            desc: "We translate complex software documentations and legacy internal guides into simple plain-language user instructions.",
            color: "bg-emerald-50/50 text-emerald-600 border-emerald-100"
          },
          {
            icon: ShieldCheck,
            title: "Accessibility (A11y) Audits",
            desc: "Ensure your client portals and internal apps comply with WCAG AA accessibility standards for visually impaired users.",
            color: "bg-rose-50/50 text-rose-600 border-rose-100"
          }
        ].map((item) => (
          <div key={item.title} className="soft-clay-card p-8 bg-white border border-slate-100/50 flex flex-col justify-between rounded-[2rem]">
            <div>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center border mb-6 ${item.color}`}>
                <item.icon className="w-5 h-5" />
              </div>
              <h4 className="font-sans font-bold text-base text-slate-900">
                {item.title}
              </h4>
              <p className="text-slate-500 text-xs mt-3 leading-relaxed">
                {item.desc}
              </p>
            </div>
            <div className="mt-8 pt-4 border-t border-slate-50 text-[10px] text-slate-400 font-bold uppercase tracking-wider">
              Futurelab Standard
            </div>
          </div>
        ))}
      </div>

      {/* Interactive Contact Sign-up Form */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 pt-8 items-center">
        <div>
          <span className="text-[10px] uppercase tracking-widest font-bold text-slate-400">
            Let&apos;s Collaborate
          </span>
          <h3 className="font-sans font-bold text-2xl md:text-3xl text-slate-900 mt-2">
            Upskill your team with FutureLab Studios
          </h3>
          <p className="text-slate-500 text-xs md:text-sm mt-3 leading-relaxed">
            Fill out our training inquiry form. Our educational consultants will customize workshops matching your specific organization workflows.
          </p>

          <div className="space-y-3 mt-6">
            {[
              "Customized plain-language manual templates",
              "Hands-on interactive prompt workshops",
              "Full WCAG compliance audit reports"
            ].map((pt) => (
              <div key={pt} className="flex items-center gap-2 text-xs font-semibold text-slate-600">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>{pt}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Dynamic Form Panel */}
        <div className="bg-white border border-slate-100 rounded-[2.5rem] p-8 shadow-sm">
          {!isSubmitted ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <h4 className="font-sans font-bold text-sm text-slate-900 border-b border-slate-50 pb-3 mb-4">
                Schedule an Inquiry
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                    Company Name
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.companyName}
                    onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                    placeholder="e.g. Acme Corp"
                    className="w-full px-4 py-2 border border-slate-200 focus:border-slate-400 rounded-xl text-xs outline-none bg-slate-50 shadow-inner"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                    Your Name
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.contactName}
                    onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
                    placeholder="John Doe"
                    className="w-full px-4 py-2 border border-slate-200 focus:border-slate-400 rounded-xl text-xs outline-none bg-slate-50 shadow-inner"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                  Contact Email Address
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="john@company.com"
                  className="w-full px-4 py-2 border border-slate-200 focus:border-slate-400 rounded-xl text-xs outline-none bg-slate-50 shadow-inner"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                  Team Size
                </label>
                <select
                  value={formData.teamSize}
                  onChange={(e) => setFormData({ ...formData, teamSize: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-200 focus:border-slate-400 rounded-xl text-xs bg-slate-50 shadow-inner outline-none text-slate-600"
                >
                  <option value="1-10">1 - 10 employees</option>
                  <option value="11-50">11 - 50 employees</option>
                  <option value="51-200">51 - 200 employees</option>
                  <option value="200+">200+ employees</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                  Inquiry Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Tell us what training topics your team needs help with..."
                  rows={3}
                  className="w-full px-4 py-2 border border-slate-200 focus:border-slate-400 rounded-xl text-xs outline-none bg-slate-50 shadow-inner resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full mt-4 py-3 bg-slate-900 text-white hover:bg-slate-800 rounded-xl text-xs font-bold transition-all shadow-md"
              >
                Submit Training Request
              </button>
            </form>
          ) : (
            <div className="text-center py-8 space-y-4 animate-in fade-in duration-300">
              <div className="w-12 h-12 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h4 className="font-sans font-bold text-base text-slate-900">Request Sent Successfully!</h4>
              <p className="text-slate-500 text-xs leading-relaxed max-w-xs mx-auto">
                Thank you! Our FutureLab corporate training coordinator will review your needs and contact you at **{formData.email}** within 24 business hours.
              </p>
              <button
                onClick={() => {
                  setIsSubmitted(false);
                  setFormData({
                    companyName: "",
                    contactName: "",
                    email: "",
                    teamSize: "1-10",
                    description: ""
                  });
                }}
                className="px-4 py-2 border border-slate-200 text-slate-600 hover:bg-slate-50 rounded-xl text-[10px] font-bold transition-colors"
              >
                New Request
              </button>
            </div>
          )}
        </div>
      </div>

    </div>
  );
}
