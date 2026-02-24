"use client"

import { useEffect, Suspense, useRef } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { useAuthStore } from "@/store/useAuthStore"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { LoaderCircleIcon, CheckCircle2, XCircle } from "lucide-react"
import { setCookie } from "@/utils/cookieUtils"


function VerifyContent() {
    const searchParams = useSearchParams()
    const router = useRouter()
    const token = searchParams.get("token")
    const { verifyMagicLinkToken, fetchUserToken, clearStore, isLoading, isSuccess, error } = useAuthStore()
    const lastVerifiedToken = useRef<string | null>(null)

    useEffect(() => {
        const processToken = async () => {
            if (token && lastVerifiedToken.current !== token) {
                lastVerifiedToken.current = token
                const accessToken = await verifyMagicLinkToken(token)

                if (accessToken) {
                    setCookie("token", accessToken, 30);
                    window.location.href = "/"
                } else {
                    setTimeout(() => {
                        clearStore()
                        router.push("/login")
                    }, 2000)

                }
            }
        }

        processToken()
    }, [token, verifyMagicLinkToken, fetchUserToken, clearStore, router])

    return (
        <div className="flex min-h-screen items-center justify-center p-4">
            <Card className="w-full max-w-lg border-border/50 bg-card/50 backdrop-blur-sm">
                <CardHeader className="space-y-1 text-center pb-6">
                    <CardTitle className="text-2xl font-serif">Verifying Login</CardTitle>
                    <CardDescription className="font-sans">
                        Please wait while we verify your magic link
                    </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col items-center justify-center py-8">
                    {isLoading && (
                        <div className="flex flex-col items-center space-y-4">
                            <LoaderCircleIcon className="h-16 w-16 animate-spin text-primary" />
                            <p className="text-muted-foreground">Authenticating securely...</p>
                        </div>
                    )}

                    {error && !isLoading && (
                        <div className="flex flex-col items-center space-y-4">
                            <XCircle className="h-16 w-16 text-destructive" />
                            <p className="text-center font-medium text-destructive">Magic link has expired or is invalid. Please try again or contact support.</p>
                            <button
                                onClick={() => router.push("/login")}
                                className="mt-4 text-sm text-primary hover:underline underline-offset-4"
                            >
                                Return to login
                            </button>
                        </div>
                    )}

                    {isSuccess && !isLoading && (
                        <div className="flex flex-col items-center space-y-4">
                            <CheckCircle2 className="h-16 w-16 text-emerald-500" />
                            <p className="text-center font-medium text-emerald-500">
                                Successfully verified!
                            </p>
                            <p className="text-sm text-muted-foreground">Redirecting you...</p>
                        </div>
                    )}

                    {!token && !isLoading && !error && !isSuccess && (
                        <div className="flex flex-col items-center space-y-4">
                            <XCircle className="h-16 w-16 text-destructive" />
                            <p className="text-center font-medium text-destructive">
                                Invalid verification link. No token provided.
                            </p>
                            <button
                                onClick={() => router.push("/login")}
                                className="mt-4 text-sm text-primary hover:underline underline-offset-4"
                            >
                                Return to login
                            </button>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}

export default function Verify() {
    return (
        <Suspense fallback={
            <div className="flex min-h-screen items-center justify-center p-4">
                <LoaderCircleIcon className="h-8 w-8 animate-spin text-primary" />
            </div>
        }>
            <VerifyContent />
        </Suspense>
    )
}