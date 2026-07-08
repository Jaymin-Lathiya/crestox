"use client";

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Wallet, AlertCircle, Loader2, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';
import {
  getAvailableWithdrawalAmount,
  getBankDetailsStatus,
  createWithdrawalRequest,
  type AvailableWithdrawalResponse,
  type BankDetailsStatus,
} from '@/apis/withdrawal/withdrawalActions';

interface WithdrawalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  source?: 'artist' | 'collector';
}

export default function WithdrawalModal({ isOpen, onClose, onSuccess, source }: WithdrawalModalProps) {
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [withdrawalData, setWithdrawalData] = useState<AvailableWithdrawalResponse | null>(null);
  const [bankStatus, setBankStatus] = useState<BankDetailsStatus | null>(null);
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setAmount('');
      setNote('');
      setSuccess(false);
      return;
    }

    const loadData = async () => {
      setLoading(true);
      try {
        const [withdrawal, bank] = await Promise.all([
          getAvailableWithdrawalAmount(source),
          getBankDetailsStatus(),
        ]);
        setWithdrawalData(withdrawal);
        setBankStatus(bank);
      } catch {
        toast.error('Failed to load withdrawal information');
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [isOpen, source]);

  const availableAmount = parseFloat(withdrawalData?.available_to_withdraw ?? '0');
  const requestedAmount = parseFloat(amount) || 0;
  const platformFeeRate = parseFloat(withdrawalData?.withdrawal_platform_fee_rate ?? '0');
  const estimatedPlatformFee =
    source === 'artist' && platformFeeRate > 0
      ? (requestedAmount * platformFeeRate) / 100
      : 0;
  const estimatedNetPayout = requestedAmount - estimatedPlatformFee;
  const isValidAmount =
    requestedAmount >= 100 &&
    requestedAmount <= availableAmount &&
    (source !== 'artist' || estimatedNetPayout >= 100);

  const handleSubmit = async () => {
    if (!isValidAmount) return;
    setSubmitting(true);
    try {
      const result = await createWithdrawalRequest({
        amount: requestedAmount,
        user_note: note || undefined,
      });
      setSuccess(true);
      toast.success(result.message ?? 'Withdrawal request submitted');
      onSuccess?.();
    } catch (err: any) {
      toast.error(err?.response?.data?.message ?? 'Failed to submit withdrawal request');
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: 'spring', bounce: 0.2, duration: 0.5 }}
          className="relative w-full max-w-md mx-4 bg-background border border-border rounded-2xl shadow-2xl overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-border">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-verdigris/10 flex items-center justify-center">
                <Wallet size={20} className="text-verdigris" />
              </div>
              <div>
                <h2 className="text-lg font-serif font-medium text-foreground">Withdraw Funds</h2>
                <p className="text-xs text-muted-foreground font-mono">To your bank account</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-muted/50 transition-colors"
            >
              <X size={18} className="text-muted-foreground" />
            </button>
          </div>

          {/* Body */}
          <div className="p-6">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-12 gap-3">
                <Loader2 size={24} className="animate-spin text-muted-foreground" />
                <p className="text-sm text-muted-foreground">Loading withdrawal info...</p>
              </div>
            ) : success ? (
              <div className="flex flex-col items-center justify-center py-12 gap-4">
                <div className="w-16 h-16 rounded-full bg-verdigris/10 flex items-center justify-center">
                  <CheckCircle2 size={32} className="text-verdigris" />
                </div>
                <h3 className="text-lg font-serif font-medium text-foreground">Request Submitted</h3>
                <p className="text-sm text-muted-foreground text-center max-w-xs">
                  {!bankStatus?.has_fund_account
                    ? "We've sent you an email to add your bank details. Please complete it to process your withdrawal."
                    : 'Your withdrawal is pending admin approval. You will be notified once processed.'}
                </p>
                <button
                  onClick={onClose}
                  className="mt-2 px-6 py-2 text-sm font-medium rounded-full border border-border hover:bg-muted/50 transition-colors"
                >
                  Close
                </button>
              </div>
            ) : (
              <>
                {/* Available Amount */}
                <div className="mb-6 p-4 bg-muted/30 rounded-xl border border-border/50">
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="text-[10px] tracking-[0.15em] uppercase text-muted-foreground font-sans mb-1">Wallet Balance</p>
                      <p className="font-mono font-medium text-foreground">₹{withdrawalData?.wallet_balance ?? '0.00'}</p>
                    </div>
                    <div>
                      <p className="text-[10px] tracking-[0.15em] uppercase text-muted-foreground font-sans mb-1">{source === 'collector' ? 'Resale Earnings' : source === 'artist' ? 'Artist Earnings' : 'Sale Earnings'}</p>
                      <p className="font-mono font-medium text-foreground">₹{withdrawalData?.total_earnings_from_sales ?? '0.00'}</p>
                    </div>
                    <div>
                      <p className="text-[10px] tracking-[0.15em] uppercase text-muted-foreground font-sans mb-1">Already Withdrawn</p>
                      <p className="font-mono font-medium text-foreground">₹{withdrawalData?.total_withdrawn ?? '0.00'}</p>
                    </div>
                    <div>
                      <p className="text-[10px] tracking-[0.15em] uppercase text-muted-foreground font-sans mb-1">Pending Withdrawal</p>
                      <p className="font-mono font-medium text-foreground">₹{withdrawalData?.pending_withdrawal ?? '0.00'}</p>
                    </div>
                  </div>
                  <div className="mt-3 pt-3 border-t border-border/50">
                    <p className="text-[10px] tracking-[0.15em] uppercase text-muted-foreground font-sans mb-1">Available to Withdraw</p>
                    <p className="text-xl font-mono font-bold text-verdigris">₹{availableAmount.toFixed(2)}</p>
                  </div>
                </div>

                {/* Bank Details Warning */}
                {!bankStatus?.has_fund_account && (
                  <div className="mb-4 flex items-start gap-2 p-3 bg-amber-500/5 border border-amber-500/20 rounded-lg">
                    <AlertCircle size={16} className="text-amber-500 mt-0.5 flex-shrink-0" />
                    <p className="text-xs text-amber-600 dark:text-amber-400">
                      No bank details on file. After submitting your request, we'll email you a link to add your bank/UPI details.
                    </p>
                  </div>
                )}

                {bankStatus?.has_fund_account && (
                  <div className="mb-4 p-3 bg-muted/20 border border-border/50 rounded-lg">
                    <p className="text-[10px] tracking-[0.15em] uppercase text-muted-foreground font-sans mb-1">Payout Account</p>
                    {bankStatus.bank_account_number ? (
                      <p className="text-sm font-mono text-foreground">
                        {bankStatus.bank_ifsc} • {bankStatus.bank_account_number}
                      </p>
                    ) : bankStatus.upi_id ? (
                      <p className="text-sm font-mono text-foreground">{bankStatus.upi_id}</p>
                    ) : (
                      <p className="text-sm font-mono text-muted-foreground">Configured</p>
                    )}
                  </div>
                )}

                {/* Amount Input */}
                <div className="mb-4">
                  <label className="block text-xs text-muted-foreground font-sans mb-1.5">
                    Withdrawal Amount (min ₹100)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-mono">₹</span>
                    <input
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="0.00"
                      min={100}
                      max={availableAmount}
                      step="0.01"
                      className="w-full pl-8 pr-4 py-3 bg-background border border-border rounded-lg font-mono text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-verdigris/30 focus:border-verdigris/50 transition-all"
                    />
                  </div>
                  {amount && !isValidAmount && (
                    <p className="mt-1 text-xs text-destructive">
                      {requestedAmount < 100
                        ? 'Minimum withdrawal is ₹100'
                        : source === 'artist' && estimatedNetPayout < 100 && requestedAmount >= 100
                          ? `After ${platformFeeRate}% platform fee, net payout would be below ₹100`
                        : `Maximum available is ₹${availableAmount.toFixed(2)}`}
                    </p>
                  )}
                  {source === 'artist' && platformFeeRate > 0 && requestedAmount > 0 && (
                    <div className="mt-3 p-3 rounded-lg border border-border/50 bg-muted/20 text-xs space-y-1">
                      <div className="flex justify-between font-mono">
                        <span className="text-muted-foreground">Platform fee ({platformFeeRate}%)</span>
                        <span>− ₹{estimatedPlatformFee.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between font-mono font-medium text-foreground">
                        <span>Est. bank payout</span>
                        <span>₹{Math.max(0, estimatedNetPayout).toFixed(2)}</span>
                      </div>
                    </div>
                  )}
                  {availableAmount > 0 && (
                    <button
                      onClick={() => setAmount(availableAmount.toFixed(2))}
                      className="mt-1 text-xs text-verdigris hover:underline"
                    >
                      Withdraw all (₹{availableAmount.toFixed(2)})
                    </button>
                  )}
                </div>

                {/* Note */}
                <div className="mb-6">
                  <label className="block text-xs text-muted-foreground font-sans mb-1.5">
                    Note (optional)
                  </label>
                  <input
                    type="text"
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="e.g. Monthly earnings withdrawal"
                    maxLength={500}
                    className="w-full px-4 py-2.5 bg-background border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-verdigris/30 focus:border-verdigris/50 transition-all"
                  />
                </div>

                {/* Submit */}
                <button
                  onClick={handleSubmit}
                  disabled={!isValidAmount || submitting || availableAmount < 100}
                  className="w-full py-3 rounded-xl font-medium text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed bg-verdigris/10 text-verdigris border border-verdigris/30 hover:bg-verdigris/20 flex items-center justify-center gap-2"
                >
                  {submitting ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Wallet size={16} />
                      Request Withdrawal
                    </>
                  )}
                </button>
              </>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
