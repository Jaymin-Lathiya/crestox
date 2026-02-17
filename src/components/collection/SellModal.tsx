"use client";

import React, { useState, useMemo } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Minus, Plus } from 'lucide-react';
import { Holding } from '@/store/useAppStore';

interface SellModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  holding: Holding | null;
  onConfirm: (quantity: number, price: number, sellingPeriod: number) => void;
}

const PLATFORM_FEE_PERCENT = 2;
const SELLING_PERIODS = [
  { value: 7, label: '7 Days' },
  { value: 14, label: '14 Days' },
  { value: 30, label: '30 Days' },
];

export function SellModal({ open, onOpenChange, holding, onConfirm }: SellModalProps) {
  const [quantity, setQuantity] = useState(1);
  const [price, setPrice] = useState('');
  const [sellingPeriod, setSellingPeriod] = useState(7);

  // Initialize price with current value when modal opens
  React.useEffect(() => {
    if (open && holding) {
      setPrice(holding.pricePerShard.toFixed(2));
      setQuantity(1);
      setSellingPeriod(7);
    }
  }, [open, holding]);

  const priceNum = parseFloat(price) || 0;
  const grossSale = quantity * priceNum;
  const platformFee = grossSale * (PLATFORM_FEE_PERCENT / 100);
  const netProceeds = grossSale - platformFee;

  const handleConfirm = () => {
    if (holding && priceNum > 0 && quantity > 0 && quantity <= holding.shardsAvailable) {
      onConfirm(quantity, priceNum, sellingPeriod);
      onOpenChange(false);
    }
  };

  const handleQuantityChange = (delta: number) => {
    if (!holding) return;
    const newQuantity = Math.max(1, Math.min(holding.shardsAvailable, quantity + delta));
    setQuantity(newQuantity);
  };

  if (!holding) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] bg-background border-border">
        <DialogHeader>
          <DialogTitle className="font-serif text-xl">
            List Fractals for Resale: {holding.artist}
          </DialogTitle>
          <DialogDescription className="font-mono text-sm text-muted-foreground">
            Set your pricing in CreCoins to list your fractals on the secondary market.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Quantity Selector */}
          <div className="space-y-2">
            <Label className="font-mono text-sm">Quantity to List</Label>
            <div className="flex items-center gap-3">
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() => handleQuantityChange(-1)}
                disabled={quantity <= 1}
                className="h-10 w-10"
              >
                <Minus className="h-4 w-4" />
              </Button>
              <Input
                type="number"
                value={quantity}
                onChange={(e) => {
                  const val = parseInt(e.target.value) || 1;
                  const clamped = Math.max(1, Math.min(holding.shardsAvailable, val));
                  setQuantity(clamped);
                }}
                min={1}
                max={holding.shardsAvailable}
                className="text-center font-mono text-lg w-20"
              />
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() => handleQuantityChange(1)}
                disabled={quantity >= holding.shardsAvailable}
                className="h-10 w-10"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground font-mono">
              You own {holding.shardsAvailable} available fractals.
            </p>
          </div>

          {/* Price Input */}
          <div className="space-y-2">
            <Label className="font-mono text-sm">Price (per fractal)</Label>
            <Input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="0.00"
              step="0.01"
              min="0"
              className="font-mono"
            />
          </div>

          {/* Selling Period */}
          <div className="space-y-2">
            <Label className="font-mono text-sm">Selling Period</Label>
            <Select value={sellingPeriod.toString()} onValueChange={(val) => setSellingPeriod(parseInt(val))}>
              <SelectTrigger className="font-mono">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {SELLING_PERIODS.map((period) => (
                  <SelectItem key={period.value} value={period.value.toString()}>
                    {period.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground font-mono">
              Your fractals will be listed at the Price, and the price will gradually decrease over the Selling Period.
            </p>
          </div>

          {/* Estimated Proceeds */}
          <div className="space-y-3 pt-4 border-t border-border">
            <div className="flex justify-between items-center">
              <span className="text-sm font-mono text-muted-foreground">Est. Gross Sale (at listing price)</span>
              <span className="text-sm font-mono font-bold">{grossSale.toFixed(2)} CreCoins</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-mono text-muted-foreground">Platform Fee ({PLATFORM_FEE_PERCENT}%)</span>
              <span className="text-sm font-mono text-destructive">- {platformFee.toFixed(2)} CreCoins</span>
            </div>
            <div className="flex justify-between items-center pt-2 border-t border-border">
              <span className="text-sm font-mono font-bold">Est. Net Proceeds</span>
              <span className="text-base font-mono font-bold text-primary">{netProceeds.toFixed(2)} CreCoins</span>
            </div>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)} className="font-mono">
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={!priceNum || priceNum <= 0 || quantity <= 0 || quantity > holding.shardsAvailable}
            className="font-mono"
          >
            Confirm Listing
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
