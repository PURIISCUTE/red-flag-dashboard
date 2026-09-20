import React, { useState } from 'react';
import { 
  X, 
  Trash2, 
  FileText, 
  Download, 
  AlertTriangle, 
  ShieldAlert, 
  CheckCircle2, 
  ExternalLink,
  Edit3,
  Bookmark
} from 'lucide-react';
import { InvestigationItem } from '../types';

interface InvestigationQueueDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: InvestigationItem[];
  onRemoveItem: (id: string) => void;
  onClearAll: () => void;
  onUpdateNote: (id: string, newNote: string) => void;
}

export const InvestigationQueueDrawer: React.FC<InvestigationQueueDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onRemoveItem,
  onClearAll,
  onUpdateNote
}) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [tempNote, setTempNote] = useState<string>('');
  const [exportedStatus, setExportedStatus] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleStartEdit = (item: InvestigationItem) => {
    setEditingId(item.id);
    setTempNote(item.note);
  };

  const handleSaveEdit = (id: string) => {
    onUpdateNote(id, tempNote);
    setEditingId(null);
  };

  const handleExportQueueText = () => {
    if (items.length === 0) return;
    const content = `REDFLAG TERMINAL - AUDIT INVESTIGATION QUEUE DOSSIER
Generated: ${new Date().toISOString()}
Total Flagged Anomaly Points: ${items.length}
============================================================

${items
  .map(
    (item, idx) => `[ITEM ${idx + 1}]
Ticker: ${item.ticker}
Flag Code: ${item.flagCode}
Title: ${item.flagTitle}
Lens: ${item.lens}
Severity: ${item.severity}
Added: ${item.addedAt}
Investigator Observations:
${item.note || '(No custom observation notes recorded)'}
------------------------------------------------------------`
  )
  .join('\n\n')}
`;

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `RedFlag_Investigation_Queue_${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);

    setExportedStatus('Dossier exported to text file');
    setTimeout(() => setExportedStatus(null), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/70 backdrop-blur-xs">
      <div className="bg-[#0c0f17] border-l border-[#222a3d] w-full max-w-xl h-full flex flex-col shadow-2xl animate-in slide-in-from-right duration-200">
        {/* Header */}
        <div className="p-4 bg-[#111622] border-b border-[#1f2638] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bookmark className="h-4 w-4 text-[#FF4D4D]" />
            <div>
              <h3 className="font-mono text-xs font-bold text-white uppercase tracking-wider">
                Active Forensic Investigation Queue
              </h3>
              <p className="text-[11px] font-mono text-[#718096]">
                {items.length} {items.length === 1 ? 'flag' : 'flags'} marked for audit scrutiny
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-[#718096] hover:text-white p-1 hover:bg-[#1a2133]"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {exportedStatus && (
            <div className="p-2 bg-[#0d2218] border border-[#38A169] text-xs font-mono text-[#38A169] flex items-center gap-2">
              <CheckCircle2 className="h-3.5 w-3.5" />
              <span>{exportedStatus}</span>
            </div>
          )}

          {items.length === 0 ? (
            <div className="h-64 flex flex-col items-center justify-center text-center p-6 border border-dashed border-[#1f2638]">
              <Bookmark className="h-8 w-8 text-[#525f7a] mb-2" />
              <p className="font-mono text-xs font-bold text-white mb-1">
                Investigation Queue is Empty
              </p>
              <p className="font-mono text-[11px] text-[#718096] max-w-xs">
                In the 210-Flag Matrix, select any warning or critical anomaly and click &quot;Add to Investigation Queue&quot; to bookmark it with custom forensic notes.
              </p>
            </div>
          ) : (
            items.map((item) => {
              const isCritical = item.severity === 'Critical Anomaly';
              const isWarning = item.severity === 'Warning';

              return (
                <div
                  key={item.id}
                  className="p-3 bg-[#080b10] border border-[#1f2638] hover:border-[#2d3852] transition-colors"
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <span className="px-1.5 py-0.5 bg-[#1a2133] text-[#a5b4fc] text-[10px] font-mono font-bold border border-[#2c364d]">
                        {item.ticker}
                      </span>
                      <span className="px-1.5 py-0.5 bg-[#FF4D4D]/20 text-[#FF4D4D] text-[10px] font-mono font-bold border border-[#FF4D4D]/40">
                        {item.flagCode}
                      </span>
                      <span className="text-[10px] font-mono text-[#718096]">
                        {item.lens}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <span
                        className={`text-[10px] font-mono font-bold px-1.5 py-0.5 border ${
                          isCritical
                            ? 'bg-[#FF4D4D]/20 text-[#FF4D4D] border-[#FF4D4D]/50'
                            : isWarning
                            ? 'bg-[#ECC94B]/20 text-[#ECC94B] border-[#ECC94B]/50'
                            : 'bg-[#38A169]/20 text-[#38A169] border-[#38A169]/50'
                        }`}
                      >
                        {item.severity}
                      </span>
                      <button
                        onClick={() => onRemoveItem(item.id)}
                        className="text-[#718096] hover:text-[#FF4D4D] p-1"
                        title="Remove from queue"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>

                  <h4 className="font-mono text-xs font-bold text-white mb-2">
                    {item.flagTitle}
                  </h4>

                  {/* Notes Section */}
                  <div className="bg-[#0f131c] p-2.5 border border-[#1b2233] text-xs font-mono">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] text-[#718096] flex items-center gap-1">
                        <Edit3 className="h-3 w-3 text-[#a5b4fc]" />
                        INVESTIGATOR OBSERVATION NOTE:
                      </span>
                      {editingId !== item.id && (
                        <button
                          onClick={() => handleStartEdit(item)}
                          className="text-[10px] text-[#a5b4fc] hover:underline"
                        >
                          EDIT NOTE
                        </button>
                      )}
                    </div>

                    {editingId === item.id ? (
                      <div className="space-y-2">
                        <textarea
                          value={tempNote}
                          onChange={(e) => setTempNote(e.target.value)}
                          placeholder="Write audit observations, suspected disclosure omissions, or follow-up questions..."
                          className="w-full bg-[#080b10] border border-[#3b4766] p-2 text-xs text-white font-mono outline-none resize-none h-20"
                        />
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => setEditingId(null)}
                            className="px-2 py-0.5 bg-[#1a2133] text-[#a0aec0] text-[10px]"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={() => handleSaveEdit(item.id)}
                            className="px-2.5 py-0.5 bg-[#FF4D4D] text-white text-[10px] font-bold"
                          >
                            Save Note
                          </button>
                        </div>
                      </div>
                    ) : (
                      <p className="text-[11px] text-[#cbd5e1] whitespace-pre-wrap">
                        {item.note || (
                          <span className="italic text-[#525f7a]">
                            No custom note added. Click &quot;EDIT NOTE&quot; to log auditor comments.
                          </span>
                        )}
                      </p>
                    )}
                  </div>

                  <div className="mt-1.5 text-right text-[9px] font-mono text-[#525f7a]">
                    Queued: {item.addedAt}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer Actions */}
        {items.length > 0 && (
          <div className="p-4 bg-[#111622] border-t border-[#1f2638] flex items-center justify-between gap-3">
            <button
              onClick={onClearAll}
              className="px-3 py-1.5 bg-[#1b2233] hover:bg-[#252f47] text-xs font-mono text-[#a0aec0] border border-[#2d3852]"
            >
              CLEAR QUEUE
            </button>
            <button
              onClick={handleExportQueueText}
              className="flex items-center gap-1.5 px-4 py-1.5 bg-[#FF4D4D] hover:bg-[#e53e3e] text-white text-xs font-mono font-bold shadow-[0_0_12px_rgba(255,77,77,0.3)]"
            >
              <Download className="h-3.5 w-3.5" />
              <span>EXPORT DOSSIER (.TXT)</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
