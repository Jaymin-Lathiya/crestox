import { useState } from "react";
import { motion } from "framer-motion";
import { Camera, Plus, X } from "lucide-react";

interface Credential {
  id: string;
  name: string;
  year: string;
  status: "verified" | "pending";
}

export const ProfileTab = () => {
  const [credentials, setCredentials] = useState<Credential[]>([
    { id: "1", name: "MFA, Royal Academy of Arts", year: "2019", status: "verified" },
    { id: "2", name: "Solo Exhibition, Gagosian Gallery", year: "2022", status: "verified" },
    { id: "3", name: "Art Basel Miami Participant", year: "2023", status: "pending" },
  ]);

  return (
    <div className="max-w-3xl mx-auto space-y-12">
      {/* Header with Avatar */}
      <motion.div
        className="flex flex-col items-center text-center"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        {/* Profile Image */}
        <div className="relative mb-8 group">
          <div className="w-32 h-32 rounded-full border border-border overflow-hidden bg-card">
            <img
              src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face"
              alt="Artist"
              className="w-full h-full object-cover"
            />
          </div>
          <button className="absolute inset-0 flex items-center justify-center bg-zinc-950/80 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
            <Camera className="w-6 h-6 text-foreground" />
          </button>
        </div>

        {/* Name Input - Manifesto Style */}
        <input
          type="text"
          defaultValue="Marcus Chen"
          placeholder="Your Name"
          className="text-display bg-transparent border-none text-center focus:outline-none placeholder:text-zinc-700 w-full"
        />
      </motion.div>

      {/* Bio Section */}
      <motion.div
        className="space-y-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <label className="text-label block">Artist Statement</label>
        <textarea
          defaultValue="I explore the intersection of organic forms and digital precision, creating works that question the boundaries between natural beauty and artificial perfection. My practice draws from the tension between chaos and order, finding harmony in their collision."
          placeholder="Write your artist statement..."
          rows={4}
          className="w-full bg-transparent border-none text-base leading-relaxed text-zinc-300 focus:outline-none resize-none placeholder:text-zinc-700"
        />
      </motion.div>

      {/* Credentials Section */}
      <motion.div
        className="space-y-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="flex items-center justify-between">
          <label className="text-label">Credentials & Achievements</label>
          <button className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors">
            <Plus className="w-3 h-3" />
            Add
          </button>
        </div>
        
        <div className="flex flex-wrap gap-3">
          {credentials.map((cred, i) => (
            <motion.div
              key={cred.id}
              className="glass-capsule px-4 py-2 flex items-center gap-3 group"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 + i * 0.05 }}
            >
              <div>
                <p className="text-sm text-foreground">{cred.name}</p>
                <p className="text-xs text-muted-foreground">{cred.year}</p>
              </div>
              {cred.status === "pending" && (
                <span className="text-[10px] uppercase tracking-wider text-primary px-2 py-0.5 border border-primary/30 bg-primary/10">
                  Pending
                </span>
              )}
              <button className="opacity-0 group-hover:opacity-100 transition-opacity">
                <X className="w-3 h-3 text-muted-foreground hover:text-destructive" />
              </button>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Contact & Links */}
      <motion.div
        className="space-y-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <label className="text-label block">Contact & Links</label>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-xs text-muted-foreground">Email</label>
            <input
              type="email"
              defaultValue="marcus@studio.art"
              className="input-skiper w-full px-4 py-3 text-sm"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs text-muted-foreground">Website</label>
            <input
              type="url"
              defaultValue="https://marcuschen.art"
              className="input-skiper w-full px-4 py-3 text-sm"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs text-muted-foreground">Instagram</label>
            <input
              type="text"
              defaultValue="@marcuschen.studio"
              className="input-skiper w-full px-4 py-3 text-sm"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs text-muted-foreground">Location</label>
            <input
              type="text"
              defaultValue="Brooklyn, NY"
              className="input-skiper w-full px-4 py-3 text-sm"
            />
          </div>
        </div>
      </motion.div>

      {/* Save Indicator */}
      <motion.div
        className="fixed bottom-6 right-6 flex items-center gap-2 text-xs text-accent"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
        Auto-saved
      </motion.div>
    </div>
  );
};
