"use client"

import { useState, useEffect } from "react"
import { useFieldArray, useForm } from "react-hook-form"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { PlusCircle, Upload, Twitter, Instagram, Linkedin, User, Trash2, FileText } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
    FormDescription,
} from "@/components/ui/form"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import GradientButton from "@/components/ui/gradiant-button"
import { Skeleton } from "@/components/ui/skeleton"
import { getProfile } from "@/apis/user/userActions"
import { applyAsArtist } from "@/apis/artists/artistActions"
import { uploadMedia } from "@/apis/media/mediaActions"
import { toast } from "sonner"

const profileFormSchema = z.object({
    artistName: z.string().min(1, { message: "Artist name is required." }),
    bio: z.string().min(1, { message: "Bio is required." }),
    avatar_media_id: z.string().optional(),
    collectorMessage: z.string().optional(),
    twitter: z.string().optional(),
    instagram: z.string().optional(),
    linkedin: z.string().optional(),
    location: z.string().optional(),
    university: z.string().optional(),
    portfolioUrl: z.string().optional(),
    artisticStyle: z.string().optional(),
    awards: z.array(z.object({
        name: z.string().min(1, { message: "Award name is required." }),
        file: z.any().optional(),
    })).optional(),
    exhibitions: z.array(z.object({
        name: z.string().min(1, { message: "Exhibition name is required." }),
        file: z.any().optional(),
    })).optional(),
    soldArtworks: z.array(z.object({
        name: z.string().min(1, { message: "Artwork name is required." }),
        image: z.any().optional(),
        proofOfSale: z.any().optional(),
        saleValue: z.string().optional(),
    })).optional(),
})

export default function ArtistProfileForm() {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)
    const [isFetchingUser, setIsFetchingUser] = useState(true)
    const [profileError, setProfileError] = useState<string | null>(null)
    const [submitError, setSubmitError] = useState<string | null>(null)
    const [avatarFile, setAvatarFile] = useState<File | null>(null)
    const [avatarPreview, setAvatarPreview] = useState<string | null>(null)
    const [isUploadingAvatar, setIsUploadingAvatar] = useState(false)
    // Store preview and filename for file uploads (keyed by field id for stability)
    const [filePreviews, setFilePreviews] = useState<Record<string, string>>({})
    const [fileNames, setFileNames] = useState<Record<string, string>>({})

    const form = useForm<z.infer<typeof profileFormSchema>>({
        resolver: zodResolver(profileFormSchema),
        defaultValues: {
            artistName: "",
            bio: "",
            avatar_media_id: "",
            collectorMessage: "",
            twitter: "",
            instagram: "",
            linkedin: "",
            location: "",
            university: "",
            portfolioUrl: "",
            artisticStyle: "",
            awards: [],
            exhibitions: [],
            soldArtworks: [],
        },
    })

    useEffect(() => {
        const fetchUserData = async () => {
            setIsFetchingUser(true);
            try {
                const fetchProfileAction = getProfile();
                const profileRes = await fetchProfileAction();
                if (profileRes.data && profileRes.data.data) {
                    const userData = profileRes.data.data;
                    form.reset({
                        ...form.getValues(),
                        artistName: userData.name || "",
                    });
                }
            } catch (err) {
                console.error("Failed to fetch profile", err);
                setProfileError("Could not verify your profile details. Please try refreshing.");
            } finally {
                setIsFetchingUser(false);
            }
        };

        fetchUserData();
    }, [form]);

    const { fields: awardFields, append: appendAward, remove: removeAward } = useFieldArray({
        control: form.control,
        name: "awards",
    })

    const { fields: exhibitionFields, append: appendExhibition, remove: removeExhibition } = useFieldArray({
        control: form.control,
        name: "exhibitions",
    })

    const { fields: soldArtworkFields, append: appendSoldArtwork, remove: removeSoldArtwork } = useFieldArray({
        control: form.control,
        name: "soldArtworks",
    })

    const extractMediaIdFromResponse = (response: any): string | null => {
        if (!response?.data) return null;
        const d = response.data;
        // Handle array response: { data: [{ media_id: 2, ... }] }
        const dataArray = Array.isArray(d?.data) ? d.data : null;
        if (dataArray?.[0]?.media_id != null) {
            return String(dataArray[0].media_id);
        }
        // Try other common response structures
        const candidates = [
            d?.data?.id,
            d?.data?.media_id,
            d?.data?.mediaId,
            d?.id,
            d?.media_id,
            d?.mediaId,
            d?.data, // when id is returned directly as data
        ];
        for (const c of candidates) {
            if (c != null && c !== "") {
                return String(c);
            }
        }
        return null;
    }

    const handleAvatarUpload = async (file: File) => {
        // Validate file type
        const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'image/bmp', 'image/svg+xml'];
        if (!validTypes.includes(file.type)) {
            toast.error("Invalid file type", {
                description: "Please upload a JPEG, PNG, JPG, GIF, WEBP, BMP, or SVG file.",
            });
            return;
        }

        // Validate file size (max 5MB)
        const maxSize = 5 * 1024 * 1024; // 5MB
        if (file.size > maxSize) {
            toast.error("File too large", {
                description: "Please upload an image smaller than 5MB.",
            });
            return;
        }

        setIsUploadingAvatar(true);
        try {
            const uploadAction = uploadMedia(file);
            const response = await uploadAction();
            
            const mediaId = extractMediaIdFromResponse(response);
            
            if (mediaId) {
                form.setValue("avatar_media_id", mediaId);
                setAvatarFile(file);
                
                // Create preview
                const reader = new FileReader();
                reader.onloadend = () => {
                    setAvatarPreview(reader.result as string);
                };
                reader.readAsDataURL(file);
                
                toast.success("Avatar uploaded successfully");
            } else {
                console.warn("Upload succeeded but media ID not found. Response:", response?.data);
                toast.error("Upload succeeded but could not get media ID", {
                    description: "Please try again or contact support. Response structure may have changed.",
                });
            }
        } catch (error: any) {
            console.error("Avatar upload error:", error);
            const errMsg = error?.response?.data?.message || error?.message || "Please try again.";
            toast.error("Failed to upload avatar", {
                description: errMsg,
            });
        } finally {
            setIsUploadingAvatar(false);
        }
    }

    const handleAvatarFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            handleAvatarUpload(file);
        }
    }

    const handleFileSelect = (
        e: React.ChangeEvent<HTMLInputElement>,
        fieldId: string,
        onChange: (file: File | null) => void
    ) => {
        const file = e.target.files?.[0];
        if (file) {
            onChange(file);
            setFileNames((prev) => ({ ...prev, [fieldId]: file.name }));
            // Only create image preview for image files
            if (file.type.startsWith("image/")) {
                const reader = new FileReader();
                reader.onloadend = () => {
                    setFilePreviews((prev) => ({ ...prev, [fieldId]: reader.result as string }));
                };
                reader.readAsDataURL(file);
            } else {
                // For PDF etc, use empty string - we'll show a document icon
                setFilePreviews((prev) => ({ ...prev, [fieldId]: "document" }));
            }
        }
        e.target.value = ""; // Reset so same file can be selected again
    }

    const clearFile = (fieldId: string, onChange: (value: null) => void) => {
        onChange(null);
        setFilePreviews((prev) => {
            const next = { ...prev };
            delete next[fieldId];
            return next;
        });
        setFileNames((prev) => {
            const next = { ...prev };
            delete next[fieldId];
            return next;
        });
    }

    const uploadFileAndGetMediaId = async (file: File | FileList | null | undefined): Promise<string | null> => {
        if (!file) return null;
        
        // Handle FileList (multiple files) - take first file
        const fileToUpload = file instanceof FileList ? file[0] : file instanceof File ? file : null;
        if (!fileToUpload) return null;

        try {
            const uploadAction = uploadMedia(fileToUpload);
            const response = await uploadAction();
            
            const mediaId = extractMediaIdFromResponse(response);
            return mediaId;
        } catch (error: any) {
            console.error("File upload error:", error);
            const errMsg = error?.response?.data?.message || error?.message || "Unknown error";
            toast.error("Failed to upload file", {
                description: errMsg,
            });
            throw new Error(`Failed to upload file: ${errMsg}`);
        }
    }

    async function onSubmit(values: z.infer<typeof profileFormSchema>) {
        setIsLoading(true);
        setSubmitError(null);

        try {
            // Ensure avatar is uploaded before submission
            if (avatarFile && !values.avatar_media_id) {
                toast.error("Please wait for avatar upload to complete");
                setIsLoading(false);
                return;
            }

            // Upload award files
            const achievements = await Promise.all(
                (values.awards || []).map(async (award) => {
                    const mediaId = await uploadFileAndGetMediaId(award.file);
                    return {
                        title: award.name,
                        description: "",
                        media_id: mediaId ? parseInt(mediaId, 10) : undefined,
                    };
                })
            );

            // Upload exhibition files
            const history = await Promise.all(
                (values.exhibitions || []).map(async (exhibition) => {
                    const mediaId = await uploadFileAndGetMediaId(exhibition.file);
                    return {
                        title: exhibition.name,
                        description: "",
                        media_id: mediaId ? parseInt(mediaId, 10) : undefined,
                    };
                })
            );

            // Upload sold artwork images and proof of sale files
            const previously_sold_artworks = await Promise.all(
                (values.soldArtworks || []).map(async (artwork) => {
                    const artworkImageMediaId = await uploadFileAndGetMediaId(artwork.image);
                    const proofOfSaleMediaId = await uploadFileAndGetMediaId(artwork.proofOfSale);
                    
                    return {
                        artwork_name: artwork.name,
                        artwork_image_media_id: artworkImageMediaId ? parseInt(artworkImageMediaId, 10) : undefined,
                        proof_of_sale_media_id: proofOfSaleMediaId ? parseInt(proofOfSaleMediaId, 10) : undefined,
                        sell_value: artwork.saleValue ? parseInt(artwork.saleValue, 10) : 0,
                    };
                })
            );

            const payload = {
                avatar_media_id: values.avatar_media_id ? parseInt(values.avatar_media_id, 10) : undefined,
                artist_name: values.artistName,
                artist_bio: values.bio,
                collector_message: values.collectorMessage || "",
                location: values.location || "",
                university: values.university || "",
                website_portfolio_link: values.portfolioUrl || "",
                artist_style: values.artisticStyle || "",
                achievements,
                history,
                previously_sold_artworks,
                social_links: [
                    ...(values.twitter ? [{ platform: "twitter", url: values.twitter }] : []),
                    ...(values.instagram ? [{ platform: "instagram", url: values.instagram }] : []),
                    ...(values.linkedin ? [{ platform: "linkedin", url: values.linkedin }] : []),
                ]
            };

            const submitAction = applyAsArtist(payload);
            const response = await submitAction();

            // Show success message
            toast.success("Artist profile created successfully!", {
                description: "Your profile has been submitted and is being reviewed.",
            });

            // Success! Route them to their new portfolio or dashboard
            router.push("/portfolio");
        } catch (error: any) {
            console.error("Submission error:", error);
            const errorMessage = error?.response?.data?.message || error.message || "Failed to create artist profile";
            setSubmitError(errorMessage);
            toast.error("Failed to create artist profile", {
                description: errorMessage,
            });
        } finally {
            setIsLoading(false);
        }
    }

    if (isFetchingUser) {
        return (
            <Card className="w-full max-w-3xl border-border/50 bg-card/50 backdrop-blur-sm mx-auto mb-20 mt-40">
                <CardHeader className="space-y-1 pb-6">
                    <Skeleton className="h-8 w-64" />
                    <Skeleton className="h-4 w-full max-w-md" />
                </CardHeader>
                <CardContent className="space-y-8">
                    <div className="space-y-3">
                        <Skeleton className="h-4 w-16" />
                        <div className="flex items-center gap-6">
                            <Skeleton className="w-20 h-20 rounded-full shrink-0" />
                            <Skeleton className="h-9 w-28" />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-40" />
                        <Skeleton className="h-10 w-full" />
                    </div>
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-[120px] w-full" />
                    </div>
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-48" />
                        <Skeleton className="h-[120px] w-full" />
                    </div>
                    <div className="space-y-4">
                        <Skeleton className="h-4 w-20" />
                        <Skeleton className="h-10 w-full" />
                        <Skeleton className="h-10 w-full" />
                    </div>
                    <div className="flex justify-end pt-4">
                        <Skeleton className="h-11 w-32" />
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="w-full max-w-3xl border-border/50 bg-card/50 backdrop-blur-sm mx-auto mb-20 mt-40">
            <CardHeader className="space-y-1 pb-6">
                <CardTitle className="text-2xl font-serif">Create Your Artist Profile</CardTitle>
                <CardDescription className="font-sans">
                    Tell the world about your unique artistic vision. You can edit this information later.
                </CardDescription>
            </CardHeader>
            <CardContent>
                {profileError && (
                    <div className="mb-6 p-4 bg-destructive/10 text-destructive rounded-md text-sm border border-destructive/20">
                        {profileError}
                    </div>
                )}
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                        {/* Avatar */}
                        <div className="space-y-3">
                            <FormLabel>Avatar</FormLabel>
                            <div className="flex items-center gap-6">
                                <div className="relative w-20 h-20 rounded-full border border-border/50 bg-muted/20 flex items-center justify-center overflow-hidden">
                                    {avatarPreview ? (
                                        <img 
                                            src={avatarPreview} 
                                            alt="Avatar preview" 
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <User className="w-8 h-8 text-muted-foreground" />
                                    )}
                                    {isUploadingAvatar && (
                                        <div className="absolute inset-0 bg-background/80 flex items-center justify-center">
                                            <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                                        </div>
                                    )}
                                </div>
                                <div className="relative">
                                    <Button 
                                        variant="outline" 
                                        type="button" 
                                        size="sm" 
                                        className="font-sans"
                                        disabled={isUploadingAvatar}
                                        onClick={() => {
                                            const input = document.getElementById("avatar-upload-input");
                                            input?.click();
                                        }}
                                    >
                                        {isUploadingAvatar ? "Uploading..." : "Upload Image"}
                                    </Button>
                                    <input
                                        id="avatar-upload-input"
                                        type="file"
                                        accept="image/jpeg,image/jpg,image/png,image/gif,image/webp,image/bmp,image/svg+xml"
                                        className="hidden"
                                        onChange={handleAvatarFileChange}
                                    />
                                </div>
                            </div>
                            <p className="text-[13px] text-muted-foreground">
                                Choose a public avatar. Supported formats: JPEG, PNG, JPG, GIF, WEBP, BMP, SVG (max 5MB).
                            </p>
                            {form.watch("avatar_media_id") && (
                                <p className="text-[12px] text-primary">Avatar uploaded successfully ✓</p>
                            )}
                        </div>

                        {/* Artist Name */}
                        <FormField
                            control={form.control}
                            name="artistName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Artist Name / Pseudonym</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Jaymin Lathiya" {...field} />
                                    </FormControl>
                                    <FormDescription>This is your public display name.</FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Artist Bio */}
                        <FormField
                            control={form.control}
                            name="bio"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Artist Bio</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Tell us a little bit about yourself and your art..."
                                            className="min-h-[120px]"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormDescription>Share your story, your process, and what inspires you.</FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Collector Message */}
                        <FormField
                            control={form.control}
                            name="collectorMessage"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Message to Your Collectors (Optional)</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Write a personal message that will be shared with people who collect your art..."
                                            className="min-h-[120px]"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormDescription>
                                        This message is exclusive to your fractal holders. It will be required before your first artwork can be collected.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Awards */}
                        <div className="space-y-4">
                            <FormLabel className="text-base text-foreground/90">Awards</FormLabel>
                            {awardFields.map((awardField, index) => (
                                <div key={awardField.id} className="p-4 border border-border/40 rounded-lg space-y-4 relative group">
                                    <div className="flex gap-4">
                                        <div className="flex-1 space-y-4">
                                            <FormField
                                                control={form.control}
                                                name={`awards.${index}.name`}
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormControl>
                                                            <Input placeholder="e.g., Digital Art Prize 2024" className="bg-background/50" {...field} />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={form.control}
                                                name={`awards.${index}.file`}
                                                render={({ field }) => {
                                                    const fieldId = `awards-${awardField.id}`;
                                                    const preview = filePreviews[fieldId];
                                                    const filename = fileNames[fieldId];
                                                    return (
                                                        <FormItem>
                                                            <FormLabel className="text-xs text-muted-foreground">Award Certificate / Image</FormLabel>
                                                            <FormControl>
                                                                <div className="flex items-center gap-4">
                                                                    <div className="relative w-16 h-16 rounded-lg border border-border/50 bg-muted/20 flex items-center justify-center overflow-hidden shrink-0">
                                                                        {preview ? (
                                                                            <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                                                                        ) : (
                                                                            <Upload className="w-6 h-6 text-muted-foreground" />
                                                                        )}
                                                                    </div>
                                                                    <div className="flex-1 min-w-0 flex flex-col gap-1">
                                                                        <div
                                                                            className="flex items-center gap-2 border border-input bg-background/50 px-3 py-2 rounded-md min-h-10 text-sm overflow-hidden text-muted-foreground w-full cursor-pointer hover:bg-background/70 transition-colors"
                                                                            onClick={() => document.getElementById(`awards-file-${awardField.id}`)?.click()}
                                                                        >
                                                                            <Upload className="w-4 h-4 shrink-0" />
                                                                            <span className="font-semibold text-foreground shrink-0">Choose file</span>
                                                                            <span className="truncate text-muted-foreground">{filename || "No file chosen"}</span>
                                                                        </div>
                                                                        <input
                                                                            id={`awards-file-${awardField.id}`}
                                                                            type="file"
                                                                            accept="image/jpeg,image/jpg,image/png,image/gif,image/webp,image/bmp,image/svg+xml"
                                                                            className="hidden"
                                                                            onChange={(e) => handleFileSelect(e, fieldId, (f) => field.onChange(f))}
                                                                        />
                                                                        {filename && (
                                                                            <Button
                                                                                type="button"
                                                                                variant="ghost"
                                                                                size="sm"
                                                                                className="h-7 text-xs text-destructive hover:text-destructive"
                                                                                onClick={() => clearFile(fieldId, () => field.onChange(null))}
                                                                            >
                                                                                Remove file
                                                                            </Button>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    );
                                                }}
                                            />
                                        </div>
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            className="text-destructive hover:bg-destructive/10 hover:text-destructive shrink-0"
                                            onClick={() => {
                                                setFilePreviews((p) => { const n = { ...p }; delete n[`awards-${awardField.id}`]; return n; });
                                                setFileNames((p) => { const n = { ...p }; delete n[`awards-${awardField.id}`]; return n; });
                                                removeAward(index);
                                            }}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            ))}
                            <div>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    type="button"
                                    className="gap-2 font-sans"
                                    onClick={() => appendAward({ name: "" })}
                                >
                                    <PlusCircle className="w-4 h-4" />
                                    Add Award
                                </Button>
                            </div>
                        </div>

                        {/* Exhibitions */}
                        <div className="space-y-4">
                            <FormLabel className="text-base text-foreground/90">Exhibitions</FormLabel>
                            {exhibitionFields.map((exhibitionField, index) => (
                                <div key={exhibitionField.id} className="p-4 border border-border/40 rounded-lg space-y-4 relative group">
                                    <div className="flex gap-4">
                                        <div className="flex-1 space-y-4">
                                            <FormField
                                                control={form.control}
                                                name={`exhibitions.${index}.name`}
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormControl>
                                                            <Input placeholder="e.g., 'Future Visions' at Modern Gallery" className="bg-background/50" {...field} />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={form.control}
                                                name={`exhibitions.${index}.file`}
                                                render={({ field }) => {
                                                    const fieldId = `exhibitions-${exhibitionField.id}`;
                                                    const preview = filePreviews[fieldId];
                                                    const filename = fileNames[fieldId];
                                                    return (
                                                        <FormItem>
                                                            <FormLabel className="text-xs text-muted-foreground">Exhibition Image</FormLabel>
                                                            <FormControl>
                                                                <div className="flex items-center gap-4">
                                                                    <div className="relative w-16 h-16 rounded-lg border border-border/50 bg-muted/20 flex items-center justify-center overflow-hidden shrink-0">
                                                                        {preview ? (
                                                                            <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                                                                        ) : (
                                                                            <Upload className="w-6 h-6 text-muted-foreground" />
                                                                        )}
                                                                    </div>
                                                                    <div className="flex-1 min-w-0 flex flex-col gap-1">
                                                                        <div
                                                                            className="flex items-center gap-2 border border-input bg-background/50 px-3 py-2 rounded-md min-h-10 text-sm overflow-hidden text-muted-foreground w-full cursor-pointer hover:bg-background/70 transition-colors"
                                                                            onClick={() => document.getElementById(`exhibitions-file-${exhibitionField.id}`)?.click()}
                                                                        >
                                                                            <Upload className="w-4 h-4 shrink-0" />
                                                                            <span className="font-semibold text-foreground shrink-0">Choose file</span>
                                                                            <span className="truncate text-muted-foreground">{filename || "No file chosen"}</span>
                                                                        </div>
                                                                        <input
                                                                            id={`exhibitions-file-${exhibitionField.id}`}
                                                                            type="file"
                                                                            accept="image/jpeg,image/jpg,image/png,image/gif,image/webp,image/bmp,image/svg+xml"
                                                                            className="hidden"
                                                                            onChange={(e) => handleFileSelect(e, fieldId, (f) => field.onChange(f))}
                                                                        />
                                                                        {filename && (
                                                                            <Button
                                                                                type="button"
                                                                                variant="ghost"
                                                                                size="sm"
                                                                                className="h-7 text-xs text-destructive hover:text-destructive"
                                                                                onClick={() => clearFile(fieldId, () => field.onChange(null))}
                                                                            >
                                                                                Remove file
                                                                            </Button>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    );
                                                }}
                                            />
                                        </div>
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            className="text-destructive hover:bg-destructive/10 hover:text-destructive shrink-0"
                                            onClick={() => {
                                                setFilePreviews((p) => { const n = { ...p }; delete n[`exhibitions-${exhibitionField.id}`]; return n; });
                                                setFileNames((p) => { const n = { ...p }; delete n[`exhibitions-${exhibitionField.id}`]; return n; });
                                                removeExhibition(index);
                                            }}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            ))}
                            <div>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    type="button"
                                    className="gap-2 font-sans"
                                    onClick={() => appendExhibition({ name: "" })}
                                >
                                    <PlusCircle className="w-4 h-4" />
                                    Add Exhibition
                                </Button>
                            </div>
                        </div>

                        {/* Previously Sold Artworks */}
                        <div className="space-y-4">
                            <div className="space-y-1">
                                <FormLabel className="text-base text-foreground/90">Previously Sold Artworks</FormLabel>
                                <p className="text-[13px] text-muted-foreground">
                                    Showcase your sales history to build credibility. This is optional.
                                </p>
                            </div>

                            {soldArtworkFields.map((soldField, index) => (
                                <div key={soldField.id} className="p-5 border border-border/40 rounded-lg space-y-6 relative group">
                                    <div className="absolute right-4 top-4">
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                                            onClick={() => {
                                                setFilePreviews((p) => {
                                                    const n = { ...p };
                                                    delete n[`soldArtworks-${soldField.id}-image`];
                                                    delete n[`soldArtworks-${soldField.id}-proofOfSale`];
                                                    return n;
                                                });
                                                setFileNames((p) => {
                                                    const n = { ...p };
                                                    delete n[`soldArtworks-${soldField.id}-image`];
                                                    delete n[`soldArtworks-${soldField.id}-proofOfSale`];
                                                    return n;
                                                });
                                                removeSoldArtwork(index);
                                            }}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>

                                    <FormField
                                        control={form.control}
                                        name={`soldArtworks.${index}.name`}
                                        render={({ field }) => (
                                            <FormItem className="pr-12">
                                                <FormLabel className="text-xs text-muted-foreground">Artwork Name</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="e.g., Celestial Bloom" className="bg-background/50 border-blue-500/50 focus-visible:ring-blue-500/50" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <FormField
                                            control={form.control}
                                            name={`soldArtworks.${index}.image`}
                                            render={({ field }) => {
                                                const fieldId = `soldArtworks-${soldField.id}-image`;
                                                const preview = filePreviews[fieldId];
                                                const filename = fileNames[fieldId];
                                                return (
                                                    <FormItem>
                                                        <FormLabel className="text-xs text-muted-foreground">Artwork Image</FormLabel>
                                                        <FormControl>
                                                            <div className="flex items-center gap-4">
                                                                <div className="relative w-16 h-16 rounded-lg border border-border/50 bg-muted/20 flex items-center justify-center overflow-hidden shrink-0">
                                                                    {preview ? (
                                                                        <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                                                                    ) : (
                                                                        <Upload className="w-6 h-6 text-muted-foreground" />
                                                                    )}
                                                                </div>
                                                                <div className="flex-1 min-w-0 flex flex-col gap-1">
                                                                    <div
                                                                        className="flex items-center gap-2 border border-input bg-background/50 px-3 py-2 rounded-md min-h-10 text-sm overflow-hidden text-muted-foreground w-full cursor-pointer hover:bg-background/70 transition-colors"
                                                                        onClick={() => document.getElementById(`sold-image-${soldField.id}`)?.click()}
                                                                    >
                                                                        <Upload className="w-4 h-4 shrink-0" />
                                                                        <span className="font-semibold text-foreground shrink-0">Choose file</span>
                                                                        <span className="truncate text-muted-foreground">{filename || "No file chosen"}</span>
                                                                    </div>
                                                                    <input
                                                                        id={`sold-image-${soldField.id}`}
                                                                        type="file"
                                                                        accept="image/jpeg,image/jpg,image/png,image/gif,image/webp,image/bmp,image/svg+xml"
                                                                        className="hidden"
                                                                        onChange={(e) => handleFileSelect(e, fieldId, (f) => field.onChange(f))}
                                                                    />
                                                                    {filename && (
                                                                        <Button
                                                                            type="button"
                                                                            variant="ghost"
                                                                            size="sm"
                                                                            className="h-7 text-xs text-destructive hover:text-destructive"
                                                                            onClick={() => clearFile(fieldId, () => field.onChange(null))}
                                                                        >
                                                                            Remove file
                                                                        </Button>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                );
                                            }}
                                        />

                                        <FormField
                                            control={form.control}
                                            name={`soldArtworks.${index}.proofOfSale`}
                                            render={({ field }) => {
                                                const fieldId = `soldArtworks-${soldField.id}-proofOfSale`;
                                                const preview = filePreviews[fieldId];
                                                const filename = fileNames[fieldId];
                                                return (
                                                    <FormItem>
                                                        <FormLabel className="text-xs text-muted-foreground">Proof of Sale</FormLabel>
                                                        <FormControl>
                                                            <div className="flex items-center gap-4">
                                                                    <div className="relative w-16 h-16 rounded-lg border border-border/50 bg-muted/20 flex items-center justify-center overflow-hidden shrink-0">
                                                                    {preview === "document" ? (
                                                                        <FileText className="w-6 h-6 text-muted-foreground" />
                                                                    ) : preview ? (
                                                                        <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                                                                    ) : (
                                                                        <Upload className="w-6 h-6 text-muted-foreground" />
                                                                    )}
                                                                </div>
                                                                <div className="flex-1 min-w-0 flex flex-col gap-1">
                                                                    <div
                                                                        className="flex items-center gap-2 border border-input bg-background/50 px-3 py-2 rounded-md min-h-10 text-sm overflow-hidden text-muted-foreground w-full cursor-pointer hover:bg-background/70 transition-colors"
                                                                        onClick={() => document.getElementById(`sold-proof-${soldField.id}`)?.click()}
                                                                    >
                                                                        <Upload className="w-4 h-4 shrink-0" />
                                                                        <span className="font-semibold text-foreground shrink-0">Choose file</span>
                                                                        <span className="truncate text-muted-foreground">{filename || "No file chosen"}</span>
                                                                    </div>
                                                                    <input
                                                                        id={`sold-proof-${soldField.id}`}
                                                                        type="file"
                                                                        accept="image/jpeg,image/jpg,image/png,image/gif,image/webp,image/bmp,image/svg+xml,application/pdf"
                                                                        className="hidden"
                                                                        onChange={(e) => handleFileSelect(e, fieldId, (f) => field.onChange(f))}
                                                                    />
                                                                    {filename && (
                                                                        <Button
                                                                            type="button"
                                                                            variant="ghost"
                                                                            size="sm"
                                                                            className="h-7 text-xs text-destructive hover:text-destructive"
                                                                            onClick={() => clearFile(fieldId, () => field.onChange(null))}
                                                                        >
                                                                            Remove file
                                                                        </Button>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                );
                                            }}
                                        />
                                    </div>

                                    <FormField
                                        control={form.control}
                                        name={`soldArtworks.${index}.saleValue`}
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-xs text-muted-foreground">Sale Value (₹)</FormLabel>
                                                <FormControl>
                                                    <div className="relative">
                                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-sans">₹</span>
                                                        <Input type="number" placeholder="0" className="pl-7 bg-background/50" {...field} />
                                                    </div>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            ))}
                            <div>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    type="button"
                                    className="gap-2 font-sans"
                                    onClick={() => appendSoldArtwork({ name: "", saleValue: "" })}
                                >
                                    <PlusCircle className="w-4 h-4" />
                                    Add Sold Artwork
                                </Button>
                            </div>
                        </div>

                        {/* Social Links */}
                        <div className="space-y-4">
                            <FormLabel>Social Links</FormLabel>

                            <FormField
                                control={form.control}
                                name="twitter"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <div className="flex items-center">
                                                <div className="w-10 flex items-center justify-center border border-r-0 border-input bg-muted/20 h-10 rounded-l-md">
                                                    <Twitter className="w-4 h-4 text-muted-foreground" />
                                                </div>
                                                <Input className="rounded-l-none" placeholder="https://twitter.com/..." {...field} />
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="instagram"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <div className="flex items-center">
                                                <div className="w-10 flex items-center justify-center border border-r-0 border-input bg-muted/20 h-10 rounded-l-md">
                                                    <Instagram className="w-4 h-4 text-muted-foreground" />
                                                </div>
                                                <Input className="rounded-l-none" placeholder="https://instagram.com/..." {...field} />
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="linkedin"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <div className="flex items-center">
                                                <div className="w-10 flex items-center justify-center border border-r-0 border-input bg-muted/20 h-10 rounded-l-md">
                                                    <Linkedin className="w-4 h-4 text-muted-foreground" />
                                                </div>
                                                <Input className="rounded-l-none" placeholder="https://linkedin.com/in/..." {...field} />
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        {/* Location */}
                        <FormField
                            control={form.control}
                            name="location"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Location</FormLabel>
                                    <FormControl>
                                        <Input placeholder="e.g., Berlin, Germany" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* University */}
                        <FormField
                            control={form.control}
                            name="university"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>University (Optional)</FormLabel>
                                    <FormControl>
                                        <Input placeholder="e.g., National Institute of Design" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Website / Portfolio Link */}
                        <FormField
                            control={form.control}
                            name="portfolioUrl"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Website / Portfolio Link</FormLabel>
                                    <FormControl>
                                        <Input placeholder="https://your-portfolio.com" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Artistic Style */}
                        <FormField
                            control={form.control}
                            name="artisticStyle"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Artistic Style</FormLabel>
                                    <FormControl>
                                        <Input placeholder="e.g., Generative, Abstract, Algorithmic" {...field} />
                                    </FormControl>
                                    <FormDescription>Comma-separated keywords describing your art.</FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="pt-4 space-y-4">
                            {submitError && (
                                <div className="p-3 bg-destructive/10 text-destructive text-sm rounded border border-destructive/20 text-center">
                                    {submitError}
                                </div>
                            )}
                            <GradientButton
                                type="submit"
                                className="bg-[#3B82F6] hover:bg-[#2563EB] text-white px-8"
                                label={isLoading ? "Submitting Application..." : "Create Profile & Continue"}
                                disabled={isLoading}
                            />
                        </div>
                    </form>
                </Form>
            </CardContent>
        </Card>
    )
}
