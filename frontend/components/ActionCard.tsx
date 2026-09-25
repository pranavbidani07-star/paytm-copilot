"use client";

import React from "react";
import { CheckCircle2, TrendingUp, AlertCircle } from "lucide-react";

interface ActionCardProps {
  onAccept: () => void;
  messageText: string;
}

export default function ActionCard({ onAccept, messageText }: ActionCardProps) {
  // Simple heuristic: if the message suggests a loan or mentions working capital, show the card
  const isLoanOffer = 
    messageText.toLowerCase().includes("working capital") || 
    messageText.toLowerCase().includes("loan") ||
    messageText.toLowerCase().includes("po") ||
    messageText.toLowerCase().includes("restock");

  if (!isLoanOffer) return null;

  return (
    <div className="mt-4 p-4 rounded-xl bg-gradient-to-br from-indigo-50 to-blue-50 border border-indigo-100 shadow-sm animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div className="flex items-start gap-3">
        <div className="p-2 bg-indigo-100 rounded-full text-indigo-600 mt-1">
          <AlertCircle size={20} />
        </div>
        <div className="flex-1">
          <h4 className="font-semibold text-indigo-900 text-sm">Low Stock Alert</h4>
          <p className="text-xs text-indigo-700 mt-1 leading-relaxed">
            Fast-moving item running low. Capital required to restock to threshold.
          </p>
          
          <div className="mt-3 flex items-center justify-between bg-white/60 p-2 rounded-lg border border-indigo-50">
             <div className="flex items-center gap-1.5 text-xs font-medium text-slate-600">
                <TrendingUp size={14} className="text-emerald-500" />
                High Velocity
             </div>
             <div className="text-xs font-semibold text-indigo-900">
                Instant Approval
             </div>
          </div>

          <button 
            onClick={onAccept}
            className="mt-4 w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 px-4 rounded-lg text-sm font-medium transition-all shadow-sm active:scale-[0.98]"
          >
            <CheckCircle2 size={16} />
            Accept Loan & Restock
          </button>
        </div>
      </div>
    </div>
  );
}
