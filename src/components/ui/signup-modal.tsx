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
                            <RadioGroupItem value={UserType.ARTIST} id="artist" />
                            <Label htmlFor="artist" className="flex-1 font-medium cursor-pointer">
                                List art
                            </Label>
                        </div>
                        <div className="flex items-center space-x-3 space-y-0 rounded-lg border border-border/50 p-4 bg-muted/20 hover:bg-muted/30 transition-colors">
                            <RadioGroupItem value={UserType.COLLECTOR} id="collector" />
                            <Label htmlFor="collector" className="flex-1 font-medium cursor-pointer">
                                Collect art
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
                        className="w-full bg-[#3B82F6] hover:bg-[#2563EB] text-white"
                        onClick={handleContinue}
                    />
                </div>
            </DialogContent>
        </Dialog>
    )
}
