"use client"

import { useState } from "react"
import { useFieldArray, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { PlusCircle, Upload, Twitter, Instagram, Linkedin, User, Trash2 } from "lucide-react"

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

const profileFormSchema = z.object({
    artistName: z.string().min(1, { message: "Artist name is required." }),
    bio: z.string().min(1, { message: "Bio is required." }),
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
    const form = useForm<z.infer<typeof profileFormSchema>>({
        resolver: zodResolver(profileFormSchema),
        defaultValues: {
            artistName: "",
            bio: "",
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

    function onSubmit(values: z.infer<typeof profileFormSchema>) {
        console.log("Profile submitted:", values)
        // Redirect or move to next step here
    }

    return (
        <Card className="w-full max-w-3xl border-border/50 bg-card/50 backdrop-blur-sm mx-auto">
            <CardHeader className="space-y-1 pb-6">
                <CardTitle className="text-2xl font-serif">Create Your Artist Profile</CardTitle>
                <CardDescription className="font-sans">
                    Tell the world about your unique artistic vision. You can edit this information later.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                        {/* Avatar */}
                        <div className="space-y-3">
                            <FormLabel>Avatar</FormLabel>
                            <div className="flex items-center gap-6">
                                <div className="w-20 h-20 rounded-full border border-border/50 bg-muted/20 flex items-center justify-center">
                                    <User className="w-8 h-8 text-muted-foreground" />
                                </div>
                                <Button variant="outline" type="button" size="sm" className="font-sans">
                                    Upload Image
                                </Button>
                            </div>
                            <p className="text-[13px] text-muted-foreground">
                                Choose a public avatar. Use a square image (PNG/JPG, max 2MB) for best results.
                            </p>
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
                            {awardFields.map((field, index) => (
                                <div key={field.id} className="p-4 border border-border/40 rounded-lg space-y-4 relative group">
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
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormControl>
                                                            <div className="flex items-center gap-2 border border-input bg-background/50 px-3 py-2 rounded-md h-10 text-sm overflow-hidden text-muted-foreground w-full">
                                                                <span className="font-semibold text-foreground shrink-0 cursor-pointer">Choose file</span>
                                                                <span className="truncate">No file chosen</span>
                                                                <Input
                                                                    type="file"
                                                                    className="hidden"
                                                                    onChange={(e) => field.onChange(e.target.files)}
                                                                />
                                                            </div>
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            className="text-destructive hover:bg-destructive/10 hover:text-destructive shrink-0"
                                            onClick={() => removeAward(index)}
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
                            {exhibitionFields.map((field, index) => (
                                <div key={field.id} className="p-4 border border-border/40 rounded-lg space-y-4 relative group">
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
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormControl>
                                                            <div className="flex items-center gap-2 border border-input bg-background/50 px-3 py-2 rounded-md h-10 text-sm overflow-hidden text-muted-foreground w-full">
                                                                <span className="font-semibold text-foreground shrink-0 cursor-pointer">Choose files</span>
                                                                <span className="truncate">No file chosen</span>
                                                                <Input
                                                                    type="file"
                                                                    className="hidden"
                                                                    multiple
                                                                    onChange={(e) => field.onChange(e.target.files)}
                                                                />
                                                            </div>
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            className="text-destructive hover:bg-destructive/10 hover:text-destructive shrink-0"
                                            onClick={() => removeExhibition(index)}
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

                            {soldArtworkFields.map((field, index) => (
                                <div key={field.id} className="p-5 border border-border/40 rounded-lg space-y-6 relative group">
                                    <div className="absolute right-4 top-4">
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                                            onClick={() => removeSoldArtwork(index)}
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
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="text-xs text-muted-foreground">Artwork Image</FormLabel>
                                                    <FormControl>
                                                        <div className="flex items-center gap-2 border border-input bg-background/50 px-3 py-2 rounded-md h-10 text-sm overflow-hidden text-muted-foreground w-full">
                                                            <span className="font-semibold text-foreground shrink-0 cursor-pointer">Choose file</span>
                                                            <span className="truncate">No file chosen</span>
                                                            <Input
                                                                type="file"
                                                                className="hidden"
                                                                onChange={(e) => field.onChange(e.target.files)}
                                                            />
                                                        </div>
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={form.control}
                                            name={`soldArtworks.${index}.proofOfSale`}
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="text-xs text-muted-foreground">Proof of Sale</FormLabel>
                                                    <FormControl>
                                                        <div className="flex items-center gap-2 border border-input bg-background/50 px-3 py-2 rounded-md h-10 text-sm overflow-hidden text-muted-foreground w-full">
                                                            <span className="font-semibold text-foreground shrink-0 cursor-pointer">Choose file</span>
                                                            <span className="truncate">No file chosen</span>
                                                            <Input
                                                                type="file"
                                                                className="hidden"
                                                                onChange={(e) => field.onChange(e.target.files)}
                                                            />
                                                        </div>
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
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

                        <div className="pt-4">
                            <GradientButton
                                type="submit"
                                className="bg-[#3B82F6] hover:bg-[#2563EB] text-white px-8"
                                label="Create Profile & Continue"
                            />
                        </div>
                    </form>
                </Form>
            </CardContent>
        </Card>
    )
}
