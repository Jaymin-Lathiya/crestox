"use client"

import ArtworkForm from "@/components/artwork/ArtworkForm"
import { useUserStore } from "@/store/useUserStore"
import { useEffect } from "react"
import { useRouter } from "next/navigation"

const ARTIST_PROFILE_ID_KEY = "artist_profile_id"

export default function CreateArtworkPage() {
    const router = useRouter()
    const { user } = useUserStore()

    useEffect(() => {
        if (user && user.artist_profile_approved !== true) {
            router.replace("/portfolio")
        }
    }, [user, router])

    // Keep a stable artist_profile_id in localStorage: never overwrite a valid stored id
    // with the default user state (race: useState(1) + sync effect used to write "1" last).
    useEffect(() => {
        if (typeof window === "undefined") return

        const stored = localStorage.getItem(ARTIST_PROFILE_ID_KEY)
        const parsedStored = stored ? parseInt(stored, 10) : NaN
        if (!Number.isNaN(parsedStored) && parsedStored > 0) {
            return
        }

        if (user?.id && (user as any).artist_profile_id != null) {
            const id = parseInt(String((user as any).artist_profile_id), 10)
            if (!Number.isNaN(id) && id > 0) {
                localStorage.setItem(ARTIST_PROFILE_ID_KEY, String(id))
            }
        }
    }, [user])

    const handleSubmit = async (_values: unknown) => {
        // Optional: Custom submit handler if needed
        // The form component handles the API call by default
    }

    return (
        <div className="min-h-screen pt-24 pb-12">
            <div className="flex items-center justify-center p-4">
                <ArtworkForm  onSubmit={handleSubmit} />
                </div>
        </div>
    )
}