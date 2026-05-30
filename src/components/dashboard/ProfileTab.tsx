"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Camera, Loader2, Plus, Save, X } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  getMyArtistProfile,
  updateMyArtistProfile,
  addMyAchievement,
  deleteMyAchievement,
  type MyArtistProfile,
  type MyArtistProfileAchievement,
} from "@/apis/my-portfolio/myPortfolioActions";
import { useUserStore } from "@/store/useUserStore";
import { strings } from "@/utils/strings";
import { cn } from "@/lib/utils";

const PLACEHOLDER_AVATAR = "/placeholder.svg";

function buildMediaUrl(filePath: string | null | undefined): string {
  if (!filePath) return PLACEHOLDER_AVATAR;
  if (filePath.startsWith("http")) return filePath;
  const base = strings.base_url?.replace(/\/api\/?$/, "") ?? "";
  return filePath.startsWith("/") ? `${base}${filePath}` : `${base}/${filePath}`;
}

function achievementSubtitle(a: MyArtistProfileAchievement): string {
  if (a.description?.trim()) return a.description;
  try {
    return new Date(a.created_at).getFullYear().toString();
  } catch {
    return "";
  }
}

function normalizeInstagramUrl(input: string): string {
  const t = input.trim();
  if (!t) return "";
  if (/^https?:\/\//i.test(t)) return t;
  const handle = t.startsWith("@") ? t.slice(1) : t;
  return `https://instagram.com/${handle.replace(/^\//, "")}`;
}

function mergeSocialLinksForSave(
  profile: MyArtistProfile,
  instagramInput: string
): { platform: string; url: string }[] {
  const rest = profile.social_media_links.filter(
    (l) => l.platform.toLowerCase() !== "instagram"
  );
  const ig = normalizeInstagramUrl(instagramInput);
  if (ig) {
    return [...rest, { platform: "instagram", url: ig }];
  }
  return rest;
}

export const ProfileTab = () => {
  const queryClient = useQueryClient();
  const {
    user,
    fetchProfile,
    isLoading: profileLoading,
    isInitialized: profileInitialized,
  } = useUserStore();

  const [artistName, setArtistName] = useState("");
  const [artistBio, setArtistBio] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [website, setWebsite] = useState("");
  const [instagram, setInstagram] = useState("");
  const [location, setLocation] = useState("");
  const [university, setUniversity] = useState("");

  const [newAchTitle, setNewAchTitle] = useState("");
  const [newAchDesc, setNewAchDesc] = useState("");
  const [showAddAch, setShowAddAch] = useState(false);

  const profileQuery = useQuery({
    queryKey: ["my-artist-profile"],
    queryFn: async () => {
      const res = await getMyArtistProfile()();
      const payload = res?.data as { data?: MyArtistProfile };
      return payload?.data as MyArtistProfile;
    },
    enabled: !!user,
  });

  const profile = profileQuery.data;
  const notFound =
    profileQuery.isError &&
    (profileQuery.error as { response?: { status?: number } })?.response?.status ===
      404;

  useEffect(() => {
    if (!profile) return;
    setArtistName(profile.artist_name);
    setArtistBio(profile.artist_bio ?? "");
    setEmail(profile.email);
    setPhoneNumber(profile.phone_number ?? "");
    setWebsite(profile.website ?? "");
    setInstagram(profile.instagram ?? "");
    setLocation(profile.location ?? "");
    setUniversity(profile.university ?? "");
  }, [profile]);

  const saveMutation = useMutation({
    mutationFn: async () => {
      if (!profile) return;
      const name = artistName.trim();
      if (!name) {
        toast.error("Artist name is required");
        throw new Error("Validation");
      }
      const res = await updateMyArtistProfile({
        artist_name: name,
        artist_bio: artistBio.trim() || undefined,
        location: location.trim() || undefined,
        university: university.trim() || undefined,
        website_portfolio_link: website.trim() || undefined,
        email: email.trim() || undefined,
        phone_number: phoneNumber.trim() || undefined,
        social_links: mergeSocialLinksForSave(profile, instagram),
      })();
      return (res?.data as { data?: MyArtistProfile })?.data;
    },
    onSuccess: async () => {
      toast.success("Profile saved");
      await queryClient.invalidateQueries({ queryKey: ["my-artist-profile"] });
      await fetchProfile();
    },
    onError: (err: unknown) => {
      if (err instanceof Error && err.message === "Validation") return;
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message ?? "Failed to save profile";
      toast.error(msg);
    },
  });

  const addAchMutation = useMutation({
    mutationFn: async () => {
      const title = newAchTitle.trim();
      if (!title) {
        toast.error("Title is required");
        throw new Error("Validation");
      }
      const res = await addMyAchievement({
        title,
        description: newAchDesc.trim() || undefined,
      })();
      return (res?.data as { data?: unknown })?.data;
    },
    onSuccess: () => {
      toast.success("Achievement added");
      setNewAchTitle("");
      setNewAchDesc("");
      setShowAddAch(false);
      queryClient.invalidateQueries({ queryKey: ["my-artist-profile"] });
    },
    onError: (err: unknown) => {
      if (err instanceof Error && err.message === "Validation") return;
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message ?? "Failed to add achievement";
      toast.error(msg);
    },
  });

  const deleteAchMutation = useMutation({
    mutationFn: async (id: number) => {
      await deleteMyAchievement(id)();
    },
    onSuccess: () => {
      toast.success("Achievement removed");
      queryClient.invalidateQueries({ queryKey: ["my-artist-profile"] });
    },
    onError: (err: unknown) => {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message ?? "Failed to delete";
      toast.error(msg);
    },
  });

  const onDeleteAchievement = useCallback(
    (id: number) => {
      if (!confirm("Remove this achievement?")) return;
      deleteAchMutation.mutate(id);
    },
    [deleteAchMutation]
  );

  const avatarSrc = useMemo(
    () => buildMediaUrl(profile?.avatar_url ?? null),
    [profile?.avatar_url]
  );

  // Profile still loading (e.g. a hard refresh): show a spinner instead of the
  // signed-out message, which would otherwise flash for logged-in users.
  if (!user && (profileLoading || !profileInitialized)) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!user) {
    return (
      <p className="text-sm text-muted-foreground text-center max-w-md mx-auto">
        Sign in to manage your artist profile.
      </p>
    );
  }

  if (profileQuery.isLoading && !profile) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="max-w-lg mx-auto text-center space-y-4 py-12">
        <p className="text-muted-foreground">
          You don&apos;t have an artist profile yet. Apply as an artist to edit your
          profile here.
        </p>
      </div>
    );
  }

  if (profileQuery.isError && !notFound) {
    return (
      <p className="text-sm text-destructive text-center">
        Could not load profile. Try again later.
      </p>
    );
  }

  if (!profile) {
    return null;
  }

  const isSaving = saveMutation.isPending;
  const achievements = profile.achievements;

  return (
    <div className="max-w-3xl mx-auto space-y-12">
      {/* Header with Avatar */}
      <motion.div
        className="flex flex-col items-center text-center"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="relative mb-8 group">
          <div className="w-32 h-32 rounded-sm border border-border overflow-hidden bg-card">
            <img
              src={avatarSrc}
              alt="Artist"
              className="w-full h-full object-cover"
            />
          </div>
          <button
            type="button"
            className="absolute inset-0 flex items-center justify-center bg-background/80 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
            title="Avatar changes use media upload in a future update"
          >
            <Camera className="w-6 h-6 text-foreground" />
          </button>
        </div>

        <input
          type="text"
          value={artistName}
          onChange={(e) => setArtistName(e.target.value)}
          placeholder="Your Name"
          className="text-display bg-transparent border-none text-center focus:outline-none placeholder:text-muted-foreground/60 w-full"
        />
        {!profile.is_approved && (
          <p className="text-xs text-primary mt-2 uppercase tracking-wider">
            Profile pending approval
          </p>
        )}
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
          value={artistBio}
          onChange={(e) => setArtistBio(e.target.value)}
          placeholder="Write your artist statement..."
          rows={4}
          className="w-full bg-transparent border-none text-base leading-relaxed text-foreground/80 focus:outline-none resize-none placeholder:text-muted-foreground/60"
        />
      </motion.div>

      {/* Credentials Section */}
      <motion.div
        className="space-y-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <label className="text-label">Credentials & Achievements</label>
          <button
            type="button"
            onClick={() => setShowAddAch((v) => !v)}
            className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            <Plus className="w-3 h-3" />
            Add
          </button>
        </div>

        {showAddAch && (
          <div className="glass-capsule p-4 space-y-3 text-left">
            <input
              placeholder="Title (e.g. MFA, Royal Academy)"
              value={newAchTitle}
              onChange={(e) => setNewAchTitle(e.target.value)}
              className="input-skiper w-full px-3 py-2 text-sm"
            />
            <input
              placeholder="Details or year (optional)"
              value={newAchDesc}
              onChange={(e) => setNewAchDesc(e.target.value)}
              className="input-skiper w-full px-3 py-2 text-sm"
            />
            <div className="flex gap-2">
              <Button
                type="button"
                size="sm"
                disabled={addAchMutation.isPending}
                onClick={() => addAchMutation.mutate()}
              >
                {addAchMutation.isPending ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  "Save"
                )}
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => {
                  setShowAddAch(false);
                  setNewAchTitle("");
                  setNewAchDesc("");
                }}
              >
                Cancel
              </Button>
            </div>
          </div>
        )}

        <div className="flex flex-wrap gap-3">
          {achievements.map((cred, i) => (
            <motion.div
              key={cred.id}
              className="glass-capsule px-4 py-2 flex items-center gap-3 group"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 + i * 0.05 }}
            >
              <div>
                <p className="text-sm text-foreground">{cred.title}</p>
                <p className="text-xs text-muted-foreground">
                  {achievementSubtitle(cred)}
                </p>
              </div>
              <button
                type="button"
                disabled={deleteAchMutation.isPending}
                onClick={() => onDeleteAchievement(cred.id)}
                className="opacity-0 group-hover:opacity-100 transition-opacity"
                aria-label="Remove achievement"
              >
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
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input-skiper w-full px-4 py-3 text-sm"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs text-muted-foreground">Phone</label>
            <input
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="input-skiper w-full px-4 py-3 text-sm"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs text-muted-foreground">Website</label>
            <input
              type="url"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              placeholder="https://"
              className="input-skiper w-full px-4 py-3 text-sm"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs text-muted-foreground">Instagram</label>
            <input
              type="url"
              value={instagram}
              onChange={(e) => setInstagram(e.target.value)}
              placeholder="https://instagram.com/..."
              className="input-skiper w-full px-4 py-3 text-sm"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs text-muted-foreground">Location</label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="input-skiper w-full px-4 py-3 text-sm"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs text-muted-foreground">University</label>
            <input
              type="text"
              value={university}
              onChange={(e) => setUniversity(e.target.value)}
              className="input-skiper w-full px-4 py-3 text-sm"
            />
          </div>
        </div>
      </motion.div>

      <motion.div
        className="flex justify-end flex-wrap gap-3"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <Button
          type="button"
          className={cn("gap-2", isSaving && "opacity-80")}
          disabled={isSaving}
          onClick={() => saveMutation.mutate()}
        >
          {isSaving ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          Save
        </Button>
      </motion.div>
    </div>
  );
};
