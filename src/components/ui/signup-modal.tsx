"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { UserType } from "@/enums/userType"
import GradientButton from "@/components/ui/gradiant-button"
import { Label } from "@/components/ui/label"

interface SignupModalProps {
    isOpen: boolean
    onClose: () => void
}

export function SignupModal({ isOpen, onClose }: SignupModalProps) {
    const router = useRouter()
    const [selectedType, setSelectedType] = useState<string>("skip")

    const handleContinue = () => {
        onClose()
        if (selectedType === "skip") {
            router.push("/signup")
        } else {
            router.push(`/signup?user_type=${selectedType}`)
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-md border-border/50 bg-card/95 backdrop-blur-sm">
                <DialogHeader className="mb-4">
                    <DialogTitle className="text-2xl font-serif">Welcome to Crestox</DialogTitle>
                    <DialogDescription className="font-sans">
                        What brings you to our platform today?
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-6">
                    <RadioGroup
                        value={selectedType}
                        onValueChange={setSelectedType}
                        className="flex flex-col space-y-3"
                    >
                        <div className="flex items-center space-x-3 space-y-0 rounded-lg border border-border/50 p-4 bg-muted/20 hover:bg-muted/30 transition-colors">
                            <RadioGroupItem value={UserType.COLLECTOR} id="collector" />
                            <Label htmlFor="collector" className="flex-1 font-medium cursor-pointer">
                                Collect art
                                <span className="block text-xs font-normal text-muted-foreground">
                                    Buy and hold fractional ownership of artworks
                                </span>
                            </Label>
                        </div>
                        <div className="flex items-center space-x-3 space-y-0 rounded-lg border border-border/50 p-4 bg-muted/20 hover:bg-muted/30 transition-colors">
                            <RadioGroupItem value={UserType.ARTIST} id="artist" />
                            <Label htmlFor="artist" className="flex-1 font-medium cursor-pointer">
                                Join as an Artist
                                <span className="block text-xs font-normal text-muted-foreground">
                                    List your work and grow your collector base
                                </span>
                            </Label>
                        </div>
                        <div className="flex items-center space-x-3 space-y-0 rounded-lg border border-border/50 p-4 bg-muted/20 hover:bg-muted/30 transition-colors">
                            <RadioGroupItem value={UserType.CURATOR} id="curator" />
                            <Label htmlFor="curator" className="flex-1 font-medium cursor-pointer">
                                Join as a Curator
                                <span className="block text-xs font-normal text-muted-foreground">
                                    Curate exhibitions and feature standout work
                                </span>
                            </Label>
                        </div>
                        <div className="flex items-center space-x-3 space-y-0 rounded-lg border border-border/50 p-4 bg-muted/20 hover:bg-muted/30 transition-colors">
                            <RadioGroupItem value={UserType.OWNER} id="owner" />
                            <Label htmlFor="owner" className="flex-1 font-medium cursor-pointer">
                                Join as an Owner
                                <span className="block text-xs font-normal text-muted-foreground">
                                    Showcase and manage your art collection
                                </span>
                            </Label>
                        </div>
                        <div className="flex items-center space-x-3 space-y-0 rounded-lg border border-border/50 p-4 bg-muted/20 hover:bg-muted/30 transition-colors">
                            <RadioGroupItem value="skip" id="skip" />
                            <Label htmlFor="skip" className="flex-1 font-normal cursor-pointer text-muted-foreground w-full">
                                Skip / Continue
                            </Label>
                        </div>
                    </RadioGroup>

                    <GradientButton
                        label="Continue"
                        className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                        onClick={handleContinue}
                    />
                </div>
            </DialogContent>
        </Dialog>
    )
}
