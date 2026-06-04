"use client"

import ArtworkForm from "@/components/artwork/ArtworkForm"
import { useUserStore } from "@/store/useUserStore"
import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"

export default function CreateArtworkPage() {
    const router = useRouter()
    const { user, isLoading: profileLoading, isInitialized: profileInitialized } = useUserStore()

    useEffect(() => {
        if (user && user.artist_profile_approved !== true) {
            router.replace("/portfolio")
        }
    }, [user, router])

    const handleSubmit = async (_values: unknown) => {
        // Optional: Custom submit handler if needed
        // The form component handles the API call by default
    }

    // Wait for the profile so the approval check (above) can run before the form shows.
    if (!user && (profileLoading || !profileInitialized)) {
        return (
            <div className="min-h-screen pt-24 pb-12 flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
            </div>
        )
    }

    return (
        <div className="min-h-screen pt-24 pb-12">
            <div className="flex items-center justify-center p-4">
                <ArtworkForm  onSubmit={handleSubmit} />
                </div>
        </div>
    )
}