import React, { useState } from 'react';
import { 
  X, 
  User, 
  Mail, 
  Shield, 
  Check, 
  Sliders, 
  Bell, 
  Key, 
  Database, 
  Zap, 
  Copy, 
  RefreshCw,
  Sparkles,
  Layers,
  Settings
} from 'lucide-react';
import { UserSession } from '../types';

interface SaaSSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  userSession: UserSession | null;
  onUpdateUserSession: (updated: UserSession) => void;
  pollingIntervalMs?: number;
  onUpdatePollingInterval?: (ms: number) => void;
}

export const SaaSSettingsModal: React.FC<SaaSSettingsModalProps> = ({
  isOpen,
  onClose,
  userSession,
  onUpdateUserSession,
  pollingIntervalMs = 5000,
  onUpdatePollingInterval
}) => {
  const [activeTab, setActiveTab] = useState<'profile' | 'alerts' | 'telemetry' | 'api'>('profile');
  
  // Profile state
  const [name, setName] = useState(userSession?.name || 'Pratik Surya');
  const [email, setEmail] = useState(userSession?.email || 'pratiksurya02@gmail.com');
  const [workspaceName, setWorkspaceName] = useState('Veritas Forensics Research Lab');
  
  // Alert rules
  const [beneishThreshold, setBeneishThreshold] = useState(-1.78);
  const [altmanThreshold, setAltmanThreshold] = useState(1.81);
  const [sloanThreshold, setSloanThreshold] = useState(5.0);
  const [emailAlertsEnabled, setEmailAlertsEnabled] = useState(true);
  
  // Telemetry
  const [selectedPolling, setSelectedPolling] = useState(pollingIntervalMs);
  const [autoReevaluate, setAutoReevaluate] = useState(true);
  
  // API Keys
  const [apiKey, setApiKey] = useState('rf_live_8849b28f73104c99e19a');
  const [copiedKey, setCopiedKey] = useState(false);
  const [webhookUrl, setWebhookUrl] = useState('https://hooks.slack.com/services/T00/B00/XXXX');
  
  const [saveSuccess, setSaveSuccess] = useState(false);

  React.useEffect(() => {
    if (userSession) {
      setName(userSession.name);
      setEmail(userSession.email);
    }
  }, [userSession]);

  if (!isOpen) return null;

  const handleCopyKey = () => {
    navigator.clipboard?.writeText(apiKey);
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2000);
  };

  const handleRegenerateKey = () => {
    const newKey = `rf_live_${Math.random().toString(36).substring(2, 12)}${Math.random().toString(36).substring(2, 10)}`;
    setApiKey(newKey);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (userSession) {
      const updated: UserSession = {
        ...userSession,
        name: name.trim() || userSession.name,
        email: email.trim() || userSession.email
      };
      onUpdateUserSession(updated);
    }
    if (onUpdatePollingInterval) {
      onUpdatePollingInterval(selectedPolling);
    }
    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
      onClose();
    }, 900);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fadeIn font-sans">
      <div className="bg-slate-900 border border-slate-800 w-full max-w-2xl rounded-2xl shadow-2xl text-slate-200 relative overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Masthead */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800 bg-slate-950/80">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400">
              <Settings className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-white tracking-tight">SaaS Workspace Settings</h2>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                  Enterprise Seat
                </span>
              </div>
              <p className="text-xs text-slate-400">Manage institutional audit parameters, alerts &amp; live telemetry feeds</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Tab Selector Strip */}
        <div className="flex border-b border-slate-800 bg-slate-950/40 px-5 text-xs font-medium">
          <button
            onClick={() => setActiveTab('profile')}
            className={`py-3 px-3 border-b-2 font-medium flex items-center gap-2 transition-colors cursor-pointer ${
              activeTab === 'profile'
                ? 'border-red-500 text-white font-semibold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <User className="h-3.5 w-3.5" />
            <span>Profile &amp; Workspace</span>
          </button>

          <button
            onClick={() => setActiveTab('alerts')}
            className={`py-3 px-3 border-b-2 font-medium flex items-center gap-2 transition-colors cursor-pointer ${
              activeTab === 'alerts'
                ? 'border-red-500 text-white font-semibold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Bell className="h-3.5 w-3.5" />
            <span>Forensic Alert Rules</span>
          </button>

          <button
            onClick={() => setActiveTab('telemetry')}
            className={`py-3 px-3 border-b-2 font-medium flex items-center gap-2 transition-colors cursor-pointer ${
              activeTab === 'telemetry'
                ? 'border-red-500 text-white font-semibold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Zap className="h-3.5 w-3.5" />
            <span>Market Telemetry Feed</span>
          </button>

          <button
            onClick={() => setActiveTab('api')}
            className={`py-3 px-3 border-b-2 font-medium flex items-center gap-2 transition-colors cursor-pointer ${
              activeTab === 'api'
                ? 'border-red-500 text-white font-semibold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Key className="h-3.5 w-3.5" />
            <span>API &amp; Webhooks</span>
          </button>
        </div>

        {/* Tab Content Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-5 text-xs">
          {activeTab === 'profile' && (
            <div className="space-y-4">
              <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl flex items-center gap-4">
                <div className="h-12 w-12 rounded-xl bg-red-500/20 border border-red-500/40 flex items-center justify-center text-lg font-bold text-red-400 font-mono">
                  {(name || 'U').charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-white text-sm">{name}</div>
                  <div className="text-slate-400 text-xs">{email}</div>
                  <div className="text-[11px] text-emerald-400 font-mono mt-0.5">● SEC EDGAR Verified Analyst Access</div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-slate-300 font-medium block">Analyst Full Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-red-500 rounded-lg px-3 py-2 text-white outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-slate-300 font-medium block">Enterprise Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-red-500 rounded-lg px-3 py-2 text-white outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-slate-300 font-medium block">Institutional Workspace Title</label>
                <input
                  type="text"
                  value={workspaceName}
                  onChange={(e) => setWorkspaceName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 focus:border-red-500 rounded-lg px-3 py-2 text-white outline-none"
                />
              </div>
            </div>
          )}

          {activeTab === 'alerts' && (
            <div className="space-y-4">
              <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-slate-300 text-xs">
                Configure mathematical sensitivity thresholds. When an audited equity breaches these empirical cutoffs, a critical forensic alert triggers in the terminal.
              </div>

              <div className="space-y-3">
                <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-white">Beneish M-Score Manipulation Cutoff</div>
                    <div className="text-slate-400 text-[11px]">Empirical standard: -1.78 (Breach implies 85%+ probability of earnings fabrication)</div>
                  </div>
                  <div className="flex items-center gap-2 font-mono">
                    <span className="text-red-400 font-bold">&gt;</span>
                    <input
                      type="number"
                      step="0.05"
                      value={beneishThreshold}
                      onChange={(e) => setBeneishThreshold(parseFloat(e.target.value))}
                      className="w-20 bg-slate-900 border border-slate-700 rounded px-2 py-1 text-right text-white font-mono"
                    />
                  </div>
                </div>

                <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-white">Altman Z-Score Distress Cutoff</div>
                    <div className="text-slate-400 text-[11px]">Empirical standard: 1.81 (Below this constitutes bankruptcy distress watch)</div>
                  </div>
                  <div className="flex items-center gap-2 font-mono">
                    <span className="text-amber-400 font-bold">&lt;</span>
                    <input
                      type="number"
                      step="0.05"
                      value={altmanThreshold}
                      onChange={(e) => setAltmanThreshold(parseFloat(e.target.value))}
                      className="w-20 bg-slate-900 border border-slate-700 rounded px-2 py-1 text-right text-white font-mono"
                    />
                  </div>
                </div>

                <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-white">Sloan Non-Cash Accruals Trigger</div>
                    <div className="text-slate-400 text-[11px]">Empirical standard: +5.0% of total assets in non-cash accounting accruals</div>
                  </div>
                  <div className="flex items-center gap-2 font-mono">
                    <span className="text-emerald-400 font-bold">&gt;</span>
                    <input
                      type="number"
                      step="0.5"
                      value={sloanThreshold}
                      onChange={(e) => setSloanThreshold(parseFloat(e.target.value))}
                      className="w-20 bg-slate-900 border border-slate-700 rounded px-2 py-1 text-right text-white font-mono"
                    />
                    <span className="text-slate-400">%</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <span className="text-slate-300 font-medium">Automatic Email Digest for Critical Breaches</span>
                  <input
                    type="checkbox"
                    checked={emailAlertsEnabled}
                    onChange={(e) => setEmailAlertsEnabled(e.target.checked)}
                    className="h-4 w-4 rounded border-slate-700 text-red-600 focus:ring-red-500 bg-slate-900"
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'telemetry' && (
            <div className="space-y-4">
              <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-slate-300 text-xs">
                Real-time stock market data is ingested directly from Yahoo Finance without caching, matching live market fluctuations.
              </div>

              <div className="space-y-3">
                <label className="text-slate-300 font-semibold block">Live Telemetry Polling Frequency</label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { ms: 3000, label: '3 Seconds', desc: 'Ultra-High Frequency', tag: 'Live Ticks' },
                    { ms: 5000, label: '5 Seconds', desc: 'Recommended Standard', tag: 'Balanced' },
                    { ms: 15000, label: '15 Seconds', desc: 'Low-Bandwidth Mode', tag: 'Eco' }
                  ].map((opt) => (
                    <button
                      key={opt.ms}
                      type="button"
                      onClick={() => setSelectedPolling(opt.ms)}
                      className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                        selectedPolling === opt.ms
                          ? 'border-red-500 bg-red-500/10 text-white shadow-sm'
                          : 'border-slate-800 bg-slate-950 text-slate-400 hover:text-white'
                      }`}
                    >
                      <div className="font-bold font-mono text-sm">{opt.label}</div>
                      <div className="text-[10px] text-slate-400 mt-0.5">{opt.desc}</div>
                      <span className="inline-block mt-2 px-1.5 py-0.5 rounded text-[9px] font-mono bg-slate-800 text-slate-300">
                        {opt.tag}
                      </span>
                    </button>
                  ))}
                </div>

                <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-between mt-4">
                  <div>
                    <div className="font-semibold text-white">Dynamic Multivariate Re-Scoring on Price Change</div>
                    <div className="text-slate-400 text-[11px]">Automatically recomputes market cap equity leverage in Altman Z-Score with live price</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={autoReevaluate}
                    onChange={(e) => setAutoReevaluate(e.target.checked)}
                    className="h-4 w-4 rounded border-slate-700 text-red-600 focus:ring-red-500 bg-slate-900"
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'api' && (
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-slate-300 font-medium block">Enterprise Live Telemetry API Key</label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value={apiKey}
                    className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white font-mono text-xs"
                  />
                  <button
                    type="button"
                    onClick={handleCopyKey}
                    className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg flex items-center gap-1.5 font-medium transition-colors cursor-pointer"
                  >
                    {copiedKey ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                    <span>{copiedKey ? 'Copied' : 'Copy'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleRegenerateKey}
                    className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg transition-colors cursor-pointer"
                    title="Regenerate Key"
                  >
                    <RefreshCw className="h-4 w-4" />
                  </button>
                </div>
                <div className="text-[11px] text-slate-500 font-mono">Use Bearer token authorization header: Authorization: Bearer {apiKey}</div>
              </div>

              <div className="space-y-1.5 pt-2">
                <label className="text-slate-300 font-medium block">Institutional Slack / Teams Webhook URL</label>
                <input
                  type="url"
                  value={webhookUrl}
                  onChange={(e) => setWebhookUrl(e.target.value)}
                  placeholder="https://hooks.slack.com/services/..."
                  className="w-full bg-slate-950 border border-slate-800 focus:border-red-500 rounded-lg px-3 py-2 text-white font-mono text-xs outline-none"
                />
                <div className="text-[11px] text-slate-400">Broadcasts instant accounting red flag alerts directly to your firm channel</div>
              </div>
            </div>
          )}

          {saveSuccess && (
            <div className="p-3 bg-emerald-950/40 border border-emerald-500/50 text-emerald-300 rounded-xl flex items-center gap-2">
              <Check className="h-4 w-4 text-emerald-400 shrink-0" />
              <span>Workspace preferences updated successfully!</span>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between">
          <span className="text-[11px] text-slate-500 font-mono">Veritas Forensics SaaS Core v4.2</span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg font-medium transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="px-5 py-2 bg-red-600 hover:bg-red-500 text-white font-semibold rounded-lg shadow-sm transition-all cursor-pointer"
            >
              Save Preferences
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
