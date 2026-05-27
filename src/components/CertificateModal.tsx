'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Copy, Download, X } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';
import {
  getHoldingCertificate,
  type HoldingCertificateData,
} from '@/apis/my-collection/myCollectionActions';
import { buildMediaUrl } from '@/utils/mediaUrl';
import { Skeleton } from '@/components/ui/skeleton';

const DEFAULT_COLLECTOR_MESSAGE =
  "Thank you for being part of my journey. Each piece I create is a fragment of my exploration into structure, emotion, and evolution. By collecting my work, you're not just owning an artwork — you're participating in the dialogue between art, data, and imagination. I'm grateful for your support and curiosity.";

interface CertificateModalProps {
  isOpen: boolean;
  onClose: () => void;
  artistProfileId: number;
  artistName: string;
}

function normalizeAuthNumber(authNumber: string): string {
  return authNumber.replace(/\s/g, '');
}

const CertificateModal: React.FC<CertificateModalProps> = ({
  isOpen,
  onClose,
  artistProfileId,
  artistName,
}) => {
  const [certificate, setCertificate] = useState<HoldingCertificateData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen || !artistProfileId) return;

    let cancelled = false;
    setIsLoading(true);
    setCertificate(null);

    getHoldingCertificate(artistProfileId)
      .then((data) => {
        if (!cancelled) setCertificate(data);
      })
      .catch((err: { response?: { data?: { message?: string } } }) => {
        if (!cancelled) {
          toast.error(err?.response?.data?.message ?? 'Failed to load certificate');
          onClose();
        }
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [isOpen, artistProfileId, onClose]);

  const issuedDate = certificate?.issued_at
    ? format(new Date(certificate.issued_at), 'MMMM d, yyyy')
    : format(new Date(), 'MMMM d, yyyy');

  const collectorMessage =
    certificate?.artist.collector_message?.trim() || DEFAULT_COLLECTOR_MESSAGE;

  const ownerName = certificate?.owner.name ?? 'Collector';
  const shareCount = certificate?.share_count ?? 0;
  const displayArtistName = certificate?.artist.artist_name ?? artistName;

  const handleCopyAuthNumber = useCallback(async () => {
    if (!certificate) return;
    try {
      await navigator.clipboard.writeText(normalizeAuthNumber(certificate.auth_number));
      toast.success('Authentication number copied');
    } catch {
      toast.error('Failed to copy authentication number');
    }
  }, [certificate]);

  const handleDownloadPdf = useCallback(async () => {
    if (!contentRef.current || !certificate) return;

    setIsDownloading(true);
    try {
      const [{ default: html2canvas }, { default: jsPDF }] = await Promise.all([
        import('html2canvas'),
        import('jspdf'),
      ]);

      const canvas = await html2canvas(contentRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#0a0a0a',
        logging: false,
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 10;
      const contentWidth = pageWidth - margin * 2;
      const imgHeight = (canvas.height * contentWidth) / canvas.width;

      let heightLeft = imgHeight;
      let position = margin;

      pdf.addImage(imgData, 'PNG', margin, position, contentWidth, imgHeight);
      heightLeft -= pageHeight - margin * 2;

      while (heightLeft > 0) {
        position = heightLeft - imgHeight + margin;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', margin, position, contentWidth, imgHeight);
        heightLeft -= pageHeight - margin * 2;
      }

      const safeName = displayArtistName.replace(/[^\w\s-]/g, '').trim() || 'artist';
      pdf.save(`crestox-certificate-${safeName}.pdf`);
      toast.success('Certificate downloaded');
    } catch {
      toast.error('Failed to generate PDF');
    } finally {
      setIsDownloading(false);
    }
  }, [certificate, displayArtistName]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-background/80 backdrop-blur-md"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 16 }}
            transition={{ type: 'spring', damping: 28, stiffness: 320 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
          >
            <div className="pointer-events-auto w-full max-w-3xl max-h-[90vh] flex flex-col bg-card/95 border border-border shadow-[0_0_60px_rgba(0,0,0,0.55)] overflow-hidden relative backdrop-blur-2xl">
              <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-primary to-transparent opacity-50" />

              <button
                type="button"
                onClick={onClose}
                className="absolute top-4 right-4 z-20 text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Close certificate"
              >
                <X size={22} />
              </button>

              <div className="overflow-y-auto flex-1">
                {isLoading ? (
                  <div className="p-10 space-y-6">
                    <Skeleton className="h-10 w-3/4 mx-auto" />
                    <Skeleton className="h-24 w-full" />
                    <Skeleton className="h-32 w-full" />
                    <Skeleton className="h-16 w-full" />
                  </div>
                ) : certificate ? (
                  <div
                    ref={contentRef}
                    className="px-8 sm:px-12 py-10 bg-[#0a0a0a] text-foreground"
                  >
                    <h2 className="font-renaissance text-2xl sm:text-3xl text-center text-foreground tracking-wide leading-snug">
                      Certificate of Authentic Fractal Holding
                    </h2>

                    {certificate.artworks.length > 0 && (
                      <div className="mt-8 flex flex-wrap justify-center gap-6">
                        {certificate.artworks.map((artwork) => (
                          <div
                            key={artwork.artwork_id}
                            className="flex flex-col items-center gap-2 w-[88px] sm:w-[100px]"
                          >
                            <div className="w-full aspect-square overflow-hidden border border-border/40 bg-secondary/30">
                              <img
                                src={buildMediaUrl(artwork.artwork_image_url)}
                                alt={artwork.artwork_name}
                                className="w-full h-full object-cover"
                                crossOrigin="anonymous"
                              />
                            </div>
                            <p className="font-cyber text-[9px] uppercase text-center text-muted-foreground leading-tight line-clamp-2">
                              {artwork.artwork_name}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}

                    <p className="mt-10 font-renaissance text-base sm:text-lg text-center text-foreground/90 leading-relaxed max-w-2xl mx-auto">
                      This is to formally certify that{' '}
                      <strong className="text-foreground">{ownerName}</strong> holds{' '}
                      <strong className="text-foreground">{shareCount}</strong> authentic
                      Collector&apos;s Edition Fractal{shareCount === 1 ? '' : 's'} from the
                      portfolio of <strong className="text-foreground">{displayArtistName}</strong>
                      , as of <strong className="text-foreground">{issuedDate}</strong>.
                    </p>

                    <div className="mt-8 p-6 sm:p-8 bg-secondary/20 border border-border/30">
                      <h3 className="font-renaissance text-lg text-foreground mb-4">
                        A Message from {displayArtistName}
                      </h3>
                      <p className="font-renaissance text-sm sm:text-base italic text-foreground/80 leading-relaxed">
                        &ldquo;{collectorMessage}&rdquo;
                      </p>
                    </div>

                    <div className="mt-10 text-center">
                      <p className="font-cyber text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-3">
                        Authentication Number
                      </p>
                      <div className="flex items-start justify-center gap-2 max-w-2xl mx-auto">
                        <p className="font-renaissance text-sm sm:text-base text-foreground break-all leading-relaxed text-left flex-1">
                          {normalizeAuthNumber(certificate.auth_number)}
                        </p>
                        <button
                          type="button"
                          onClick={handleCopyAuthNumber}
                          className="shrink-0 p-2 text-muted-foreground hover:text-primary transition-colors"
                          title="Copy authentication number"
                          aria-label="Copy authentication number"
                        >
                          <Copy size={18} strokeWidth={1.5} />
                        </button>
                      </div>
                    </div>

                    <p className="mt-8 text-xs text-center text-muted-foreground leading-relaxed max-w-xl mx-auto">
                      This certificate affirms the authenticity of the Fractal(s) held by{' '}
                      {ownerName}, while clarifying that these do not constitute ownership rights
                      over the original physical or digital artwork by {displayArtistName}.
                    </p>

                    <div className="mt-10 pt-6 border-t border-border/20">
                      <p className="font-renaissance text-sm text-foreground/80">With appreciation,</p>
                      <p className="font-renaissance text-xl text-primary mt-1 tracking-wide">
                        Crestox
                      </p>
                    </div>
                  </div>
                ) : null}
              </div>

              {certificate && !isLoading && (
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-3 p-6 border-t border-border/40 bg-card/80">
                  <button
                    type="button"
                    onClick={handleDownloadPdf}
                    disabled={isDownloading}
                    className="flex items-center justify-center gap-2 px-5 py-3 border border-border text-foreground font-cyber text-xs uppercase tracking-widest hover:border-primary hover:text-primary transition-colors disabled:opacity-50"
                  >
                    <Download size={16} />
                    {isDownloading ? 'Generating…' : 'Download PDF'}
                  </button>
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-8 py-3 bg-primary text-primary-foreground font-cyber text-xs uppercase tracking-widest font-bold hover:bg-primary/90 transition-colors"
                  >
                    Close
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CertificateModal;
