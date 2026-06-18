"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  createWithdrawalRequest,
  getMyWithdrawalRequests,
  cancelWithdrawalRequest,
  type WithdrawalRequest,
} from "@/apis/withdrawal/withdrawalActions";
import { AlertCircle, CheckCircle2, Clock, XCircle, Loader2, Banknote, X } from "lucide-react";

interface WithdrawModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  walletBalance: number;
  totalEarnings: number;
}

const STATUS_CONFIG: Record<
  string,
  { label: string; icon: React.ElementType; className: string }
> = {
  PENDING: { label: "Pending", icon: Clock, className: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20" },
  APPROVED: { label: "Approved", icon: CheckCircle2, className: "bg-blue-500/10 text-blue-400 border-blue-500/20" },
  PROCESSING: { label: "Processing", icon: Loader2, className: "bg-blue-500/10 text-blue-400 border-blue-500/20" },
  COMPLETED: { label: "Completed", icon: CheckCircle2, className: "bg-green-500/10 text-green-400 border-green-500/20" },
  REJECTED: { label: "Rejected", icon: XCircle, className: "bg-red-500/10 text-red-400 border-red-500/20" },
  FAILED: { label: "Failed", icon: AlertCircle, className: "bg-red-500/10 text-red-400 border-red-500/20" },
};

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleDateString(undefined, {
      dateStyle: "medium",
    });
  } catch {
    return iso;
  }
}

export function WithdrawModal({
  open,
  onOpenChange,
  walletBalance,
  totalEarnings,
}: WithdrawModalProps) {
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [tab, setTab] = useState<"new" | "history">("new");
  const queryClient = useQueryClient();

  const { data: historyData, isLoading: historyLoading } = useQuery({
    queryKey: ["withdrawal-requests"],
    queryFn: async () => {
      const res = await getMyWithdrawalRequests()();
      return res?.data as { requests: WithdrawalRequest[]; pagination: { total: number } };
    },
    enabled: open && tab === "history",
  });

  const createMutation = useMutation({
    mutationFn: async () => {
      const parsedAmount = parseFloat(amount);
      if (isNaN(parsedAmount) || parsedAmount < 100) {
        throw new Error("Minimum withdrawal amount is ₹100");
      }
      const res = await createWithdrawalRequest({ amount: parsedAmount, user_note: note || undefined })();
      return res?.data;
    },
    onSuccess: (data: any) => {
      toast.success(
        data?.has_fund_account
          ? "Withdrawal request submitted! Your funds are held and will be transferred after admin approval."
          : "Withdrawal request submitted! Note: No payout account is configured. Admin will contact you to set it up."
      );
      setAmount("");
      setNote("");
      queryClient.invalidateQueries({ queryKey: ["withdrawal-requests"] });
      queryClient.invalidateQueries({ queryKey: ["portfolio-dashboard"] });
      setTab("history");
    },
    onError: (err: any) => {
      const msg =
        err?.response?.data?.message ?? err?.message ?? "Failed to submit withdrawal request.";
      toast.error(msg);
    },
  });

  const cancelMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await cancelWithdrawalRequest(id)();
      return res?.data;
    },
    onSuccess: () => {
      toast.success("Withdrawal request cancelled. Funds returned to your wallet.");
      queryClient.invalidateQueries({ queryKey: ["withdrawal-requests"] });
      queryClient.invalidateQueries({ queryKey: ["portfolio-dashboard"] });
    },
    onError: (err: any) => {
      const msg =
        err?.response?.data?.message ?? "Failed to cancel request.";
      toast.error(msg);
    },
  });

  const parsedAmount = parseFloat(amount);
  const isValidAmount = !isNaN(parsedAmount) && parsedAmount >= 100 && parsedAmount <= walletBalance;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-background border-border">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-foreground font-light text-xl">
            <Banknote size={20} className="text-accent" />
            Withdraw Earnings
          </DialogTitle>
          <DialogDescription className="text-muted-foreground text-xs">
            Funds are transferred to your registered bank account after admin approval.
          </DialogDescription>
        </DialogHeader>

        {/* Tab switcher */}
        <div className="flex gap-1 p-1 bg-muted/30 rounded-lg">
          <button
            onClick={() => setTab("new")}
            className={`flex-1 text-xs py-1.5 rounded-md transition-all ${
              tab === "new"
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            New Request
          </button>
          <button
            onClick={() => setTab("history")}
            className={`flex-1 text-xs py-1.5 rounded-md transition-all ${
              tab === "history"
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            History
          </button>
        </div>

        {tab === "new" ? (
          <div className="space-y-4">
            {/* Balance display */}
            <div className="p-3 bg-muted/20 rounded-lg border border-border space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Wallet Balance</span>
                <span className="font-mono text-foreground">₹{walletBalance.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Total Earnings</span>
                <span className="font-mono text-accent">₹{totalEarnings.toFixed(2)}</span>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="amount" className="text-xs text-muted-foreground uppercase tracking-wide">
                Amount (INR)
              </Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">₹</span>
                <Input
                  id="amount"
                  type="number"
                  placeholder="0.00"
                  min={100}
                  max={walletBalance}
                  step={0.01}
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="pl-7 font-mono"
                />
              </div>
              {amount && !isNaN(parsedAmount) && (
                <p className={`text-xs ${
                  parsedAmount < 100
                    ? "text-destructive"
                    : parsedAmount > walletBalance
                    ? "text-destructive"
                    : "text-muted-foreground"
                }`}>
                  {parsedAmount < 100
                    ? "Minimum withdrawal is ₹100"
                    : parsedAmount > walletBalance
                    ? "Exceeds available balance"
                    : `₹${parsedAmount.toFixed(2)} will be held pending admin approval`}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="note" className="text-xs text-muted-foreground uppercase tracking-wide">
                Note (optional)
              </Label>
              <Textarea
                id="note"
                placeholder="e.g. Monthly earnings withdrawal"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                rows={2}
                maxLength={500}
                className="resize-none text-sm"
              />
            </div>

            <div className="flex items-start gap-2 p-3 bg-yellow-500/5 border border-yellow-500/20 rounded-lg">
              <AlertCircle size={14} className="text-yellow-400 mt-0.5 flex-shrink-0" />
              <p className="text-xs text-yellow-300/80 leading-relaxed">
                Make sure your bank account is registered in your profile. If no account is set up, admin will contact you before processing.
              </p>
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onOpenChange(false)}
                className="text-muted-foreground"
              >
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={() => createMutation.mutate()}
                disabled={!isValidAmount || createMutation.isPending}
                className="bg-accent text-accent-foreground hover:bg-accent/90"
              >
                {createMutation.isPending ? (
                  <>
                    <Loader2 size={14} className="animate-spin mr-1.5" />
                    Submitting…
                  </>
                ) : (
                  "Request Withdrawal"
                )}
              </Button>
            </DialogFooter>
          </div>
        ) : (
          <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
            {historyLoading ? (
              <div className="flex justify-center py-8">
                <Loader2 size={20} className="animate-spin text-muted-foreground" />
              </div>
            ) : !historyData?.requests?.length ? (
              <p className="text-xs text-muted-foreground text-center py-8">
                No withdrawal requests yet.
              </p>
            ) : (
              historyData.requests.map((req) => {
                const config = STATUS_CONFIG[req.status] ?? STATUS_CONFIG.PENDING;
                const StatusIcon = config.icon;
                return (
                  <div
                    key={req.id}
                    className="p-3 border border-border rounded-lg space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-sm text-foreground">
                        ₹{req.amount}
                      </span>
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 text-[10px] rounded-full border ${config.className}`}
                      >
                        <StatusIcon size={10} />
                        {config.label}
                      </span>
                    </div>
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>{formatDate(req.created_at)}</span>
                      {req.admin_note && (
                        <span className="text-right max-w-[60%] truncate" title={req.admin_note}>
                          {req.admin_note}
                        </span>
                      )}
                    </div>
                    {req.status === "PENDING" && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 text-xs text-destructive hover:text-destructive hover:bg-destructive/10 px-2 mt-1"
                        onClick={() => cancelMutation.mutate(req.id)}
                        disabled={cancelMutation.isPending}
                      >
                        <X size={10} className="mr-1" />
                        Cancel
                      </Button>
                    )}
                  </div>
                );
              })
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
