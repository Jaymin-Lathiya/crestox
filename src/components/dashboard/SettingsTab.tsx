import { motion } from "framer-motion";
import { Bell, Shield, CreditCard, Moon, Monitor, Smartphone } from "lucide-react";
import { cn } from "@/lib/utils";

interface SettingToggleProps {
  label: string;
  description: string;
  enabled: boolean;
  onChange: () => void;
}

const SettingToggle = ({ label, description, enabled, onChange }: SettingToggleProps) => (
  <div className="flex items-center justify-between py-4 border-b border-border">
    <div>
      <p className="text-sm text-foreground">{label}</p>
      <p className="text-xs text-muted-foreground">{description}</p>
    </div>
    <button
      onClick={onChange}
      className={cn(
        "w-12 h-6 rounded-full transition-colors relative",
        enabled ? "bg-accent" : "bg-zinc-800"
      )}
    >
      <div
        className={cn(
          "w-4 h-4 rounded-full bg-foreground absolute top-1 transition-transform",
          enabled ? "translate-x-7" : "translate-x-1"
        )}
      />
    </button>
  </div>
);

export const SettingsTab = () => {
  return (
    <div className="max-w-8xl mx-auto space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h1 className="text-3xl font-light text-foreground tracking-tight mb-2">
          Settings
        </h1>
        <p className="text-muted-foreground text-sm">
          Manage your account and preferences
        </p>
      </motion.div>

      {/* Notifications Section */}
      <motion.div
        className="glass-capsule p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="flex items-center gap-3 mb-4">
          <Bell className="w-5 h-5 text-muted-foreground" />
          <h3 className="text-label">Notifications</h3>
        </div>
        <div className="space-y-1">
          <SettingToggle
            label="Sale Notifications"
            description="Get notified when someone buys your fractals"
            enabled={true}
            onChange={() => {}}
          />
          <SettingToggle
            label="Price Alerts"
            description="Receive alerts for significant market movements"
            enabled={true}
            onChange={() => {}}
          />
          <SettingToggle
            label="Curator Updates"
            description="Updates on artwork review status"
            enabled={false}
            onChange={() => {}}
          />
        </div>
      </motion.div>

      {/* Security Section */}
      <motion.div
        className="glass-capsule p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="flex items-center gap-3 mb-4">
          <Shield className="w-5 h-5 text-muted-foreground" />
          <h3 className="text-label">Security</h3>
        </div>
        <div className="space-y-1">
          <SettingToggle
            label="Two-Factor Authentication"
            description="Add an extra layer of security"
            enabled={true}
            onChange={() => {}}
          />
          <SettingToggle
            label="Login Alerts"
            description="Get notified of new login attempts"
            enabled={true}
            onChange={() => {}}
          />
        </div>
        <button className="mt-4 text-sm text-primary hover:underline">
          Change Password
        </button>
      </motion.div>

      {/* Payment Section */}
      <motion.div
        className="glass-capsule p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <div className="flex items-center gap-3 mb-4">
          <CreditCard className="w-5 h-5 text-muted-foreground" />
          <h3 className="text-label">Payment Methods</h3>
        </div>
        <div className="space-y-3">
          <div className="flex items-center justify-between py-3 border border-border px-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-5 bg-gradient-to-r from-blue-600 to-blue-800 rounded" />
              <span className="text-sm text-foreground">•••• 4242</span>
            </div>
            <span className="text-xs text-muted-foreground">Default</span>
          </div>
          <button className="w-full py-3 border border-dashed border-border text-sm text-muted-foreground hover:text-foreground hover:border-zinc-600 transition-colors">
            + Add Payment Method
          </button>
        </div>
      </motion.div>

      {/* Appearance Section */}
      <motion.div
        className="glass-capsule p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <div className="flex items-center gap-3 mb-4">
          <Moon className="w-5 h-5 text-muted-foreground" />
          <h3 className="text-label">Appearance</h3>
        </div>
        <div className="flex gap-4">
          {[
            { icon: Moon, label: "Dark", active: true },
            { icon: Monitor, label: "System", active: false },
            { icon: Smartphone, label: "Light", active: false },
          ].map((theme) => (
            <button
              key={theme.label}
              className={cn(
                "flex-1 py-3 flex flex-col items-center gap-2 border transition-colors",
                theme.active
                  ? "border-primary bg-primary/10"
                  : "border-border hover:border-zinc-600"
              )}
            >
              <theme.icon className="w-5 h-5" />
              <span className="text-xs">{theme.label}</span>
            </button>
          ))}
        </div>
      </motion.div>

      {/* Danger Zone */}
      <motion.div
        className="border border-destructive/30 p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <h3 className="text-label text-destructive mb-2">Danger Zone</h3>
        <p className="text-xs text-muted-foreground mb-4">
          Irreversible actions. Please proceed with caution.
        </p>
        <div className="flex gap-4">
          <button className="px-4 py-2 border border-border text-sm text-muted-foreground hover:text-foreground transition-colors">
            Export Data
          </button>
          <button className="px-4 py-2 border border-destructive/50 text-sm text-destructive hover:bg-destructive/10 transition-colors">
            Delete Account
          </button>
        </div>
      </motion.div>
    </div>
  );
};
