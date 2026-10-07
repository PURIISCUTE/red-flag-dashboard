import React, { useState } from 'react';
import { 
  X, 
  Check, 
  Sparkles, 
  ShieldAlert, 
  Zap, 
  Building2, 
  Layers, 
  ArrowRight,
  ShieldCheck
} from 'lucide-react';

interface PricingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectPlan?: (planName: string) => void;
}

export const PricingModal: React.FC<PricingModalProps> = ({
  isOpen,
  onClose,
  onSelectPlan
}) => {
  const [isAnnual, setIsAnnual] = useState(true);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleChoose = (planName: string) => {
    setSelectedPlan(planName);
    setTimeout(() => {
      if (onSelectPlan) onSelectPlan(planName);
      onClose();
    }, 600);
  };

  const PLANS = [
    {
      id: 'analyst',
      name: 'Forensic Analyst',
      description: 'For independent equity researchers, short-sellers & chartered accountants.',
      monthlyPrice: 199,
      annualPrice: 159,
      badge: 'Individual License',
      popular: false,
      features: [
        'Full SEC EDGAR XBRL ingestion (10-K & 10-Q)',
        'Live Yahoo Finance price streaming & charts',
        'Beneish 8-Factor M-Score with step-by-step math',
        'Altman Z-Score & Sloan Accruals calculation',
        'Up to 100 deep ticker audits / month',
        'Multi-page executive audit PDF exports'
      ]
    },
    {
      id: 'pro',
      name: 'Hedge Fund Pro',
      description: 'For Long/Short equity funds, activist short campaigns & credit committees.',
      monthlyPrice: 499,
      annualPrice: 399,
      badge: 'Most Popular',
      popular: true,
      features: [
        'All Forensic Analyst capabilities included',
        'Unlimited real-time ticker audits & scans',
        '30 Specialized Red Flags across 7 Industry Lenses',
        'Interactive stress test sensitivity simulator',
        '5-Second real-time price tick streaming',
        'Restatement & auditor change early warning alerts',
        'Investigation queue with persistent audit notes',
        'Up to 5 Institutional analyst seats'
      ]
    },
    {
      id: 'enterprise',
      name: 'Sovereign Institutional',
      description: 'For tier-1 asset managers, forensic audit firms & regulatory bodies.',
      monthlyPrice: 999,
      annualPrice: 799,
      badge: 'Enterprise Architecture',
      popular: false,
      features: [
        'All Hedge Fund Pro capabilities included',
        'Dedicated high-throughput SEC EDGAR proxy',
        'Enterprise REST API with Bearer key access',
        'Slack & Microsoft Teams real-time breach webhooks',
        'Custom red flag rule authoring & weighting',
        'Unlimited analyst seats & single sign-on (SSO)',
        '24/7 Forensic CPA technical support'
      ]
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fadeIn font-sans">
      <div className="bg-slate-900 border border-slate-800 w-full max-w-5xl rounded-2xl shadow-2xl text-slate-200 relative overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="p-6 border-b border-slate-800 bg-slate-950/80 flex items-center justify-between flex-wrap gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono uppercase tracking-wider text-red-400 font-semibold">
                SaaS Membership Tiers
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                Transparent Pricing
              </span>
            </div>
            <h2 className="text-xl font-bold text-white tracking-tight mt-1">
              Institutional Forensic Diligence Subscriptions
            </h2>
            <p className="text-xs text-slate-400">
              Select the workspace tier matching your firm&apos;s diligence volume and research scale.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Billing Cycle Switch */}
            <div className="bg-slate-950 border border-slate-800 p-1 rounded-xl flex items-center text-xs">
              <button
                onClick={() => setIsAnnual(false)}
                className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                  !isAnnual ? 'bg-slate-800 text-white font-semibold' : 'text-slate-400 hover:text-white'
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setIsAnnual(true)}
                className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
                  isAnnual ? 'bg-red-600 text-white font-semibold shadow-sm' : 'text-slate-400 hover:text-white'
                }`}
              >
                <span>Annual</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-emerald-500 text-slate-950 font-bold">
                  Save 20%
                </span>
              </button>
            </div>

            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Plan Cards Grid */}
        <div className="p-6 overflow-y-auto grid grid-cols-1 md:grid-cols-3 gap-5">
          {PLANS.map((plan) => {
            const price = isAnnual ? plan.annualPrice : plan.monthlyPrice;
            const isSelected = selectedPlan === plan.name;

            return (
              <div
                key={plan.id}
                className={`rounded-2xl p-5 border flex flex-col justify-between transition-all relative ${
                  plan.popular
                    ? 'bg-slate-950 border-red-500/80 shadow-xl shadow-red-950/20'
                    : 'bg-slate-950/70 border-slate-800 hover:border-slate-700'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-red-600 text-white text-[10px] font-bold font-mono tracking-wider uppercase shadow-sm">
                    Recommended for Funds
                  </div>
                )}

                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
                      <span>{plan.badge}</span>
                    </div>
                    <h3 className="text-lg font-bold text-white mt-1">
                      {plan.name}
                    </h3>
                    <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                      {plan.description}
                    </p>
                  </div>

                  {/* Price */}
                  <div className="pt-2 pb-1 border-y border-slate-800/80 font-mono">
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl font-bold text-white tracking-tight">
                        ${price}
                      </span>
                      <span className="text-xs text-slate-400 font-sans">
                        / month {isAnnual ? '(billed annually)' : ''}
                      </span>
                    </div>
                  </div>

                  {/* Feature Checklist */}
                  <div className="space-y-2 text-xs text-slate-300 pt-1">
                    <span className="text-[11px] font-mono text-slate-400 block uppercase font-semibold">
                      What&apos;s included:
                    </span>
                    {plan.features.map((feat, idx) => (
                      <div key={idx} className="flex items-start gap-2 leading-snug">
                        <Check className="h-3.5 w-3.5 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-6">
                  <button
                    onClick={() => handleChoose(plan.name)}
                    disabled={isSelected}
                    className={`w-full py-2.5 px-4 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                      plan.popular
                        ? 'bg-red-600 hover:bg-red-500 text-white shadow-md shadow-red-950/40'
                        : 'bg-slate-800 hover:bg-slate-700 text-white border border-slate-700'
                    }`}
                  >
                    {isSelected ? (
                      <span className="text-emerald-300 font-bold">Plan Activated ✓</span>
                    ) : (
                      <>
                        <span>Activate 14-Day Institutional Trial</span>
                        <ArrowRight className="h-3.5 w-3.5" />
                      </>
                    )}
                  </button>
                  <div className="text-[10px] text-center text-slate-500 mt-2 font-mono">
                    Instant access • No credit card required for trial
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer Guarantee */}
        <div className="p-4 border-t border-slate-800 bg-slate-950 text-xs flex flex-wrap items-center justify-between gap-3 text-slate-400">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-emerald-400" />
            <span>SOC2 Type II Certified Pipeline · SEC EDGAR Compliant User-Agent Protocol</span>
          </div>
          <div className="font-mono text-[11px] text-slate-500">
            Cancel or change plans at any time from Workspace Settings
          </div>
        </div>
      </div>
    </div>
  );
};
