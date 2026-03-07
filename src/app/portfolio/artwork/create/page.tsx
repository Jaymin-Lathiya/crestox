"use client"

import ArtworkForm from "@/components/artwork/ArtworkForm"
import { useUserStore } from "@/store/useUserStore"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

const ARTIST_PROFILE_ID_KEY = "artist_profile_id"

export default function CreateArtworkPage() {
    const router = useRouter()
    const { user } = useUserStore()
    const [artistProfileId, setArtistProfileId] = useState<number>(1)

    useEffect(() => {
        if (user && user.artist_profile_approved !== true) {
            router.replace("/portfolio")
        }
    }, [user, router])

    useEffect(() => {
        const stored = localStorage.getItem(ARTIST_PROFILE_ID_KEY)
        const parsed = stored ? parseInt(stored, 10) : NaN
        if (!isNaN(parsed) && parsed > 0) {
            setArtistProfileId(parsed)
        }
    }, [])

    useEffect(() => {
        if (user?.id && (user as any).artist_profile_id != null) {
            const id = parseInt(String((user as any).artist_profile_id), 10)
            if (!isNaN(id) && id > 0) {
                setArtistProfileId(id)
                localStorage.setItem(ARTIST_PROFILE_ID_KEY, String(id))
            }
        }
    }, [user])

    useEffect(() => {
        localStorage.setItem(ARTIST_PROFILE_ID_KEY, String(artistProfileId))
    }, [artistProfileId])

    const handleSubmit = async (values: any) => {
        // Optional: Custom submit handler if needed
        // The form component handles the API call by default
        console.log("Artwork submitted:", values)
    }

    return (
        <div className="min-h-screen pt-24 pb-12">
            <div className="flex items-center justify-center p-4">
                <ArtworkForm  onSubmit={handleSubmit} />
                </div>
        </div>
    )
}