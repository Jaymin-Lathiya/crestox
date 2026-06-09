"use client"

import { Suspense, useState, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { UserType } from "@/enums/userType"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import GradientButton from "@/components/ui/gradiant-button"
import { useAuthStore } from "@/store/useAuthStore"
import { useUserStore } from "@/store/useUserStore"
import { CheckCircle2, Mail, Pencil, Check, LoaderCircle } from "lucide-react"
import { useGoogleSignIn } from "@/hooks/useGoogleSignIn"
import { useAppleSignIn } from "@/hooks/useAppleSignIn"
import { toast } from "sonner"
import { redirectUnknownUserToSignup } from "@/utils/authRedirect"

const formSchema = z.object({
    email: z.string().email({
        message: "Please enter a valid email address.",
    }),
})

function LoginFormContent() {
    const { requestMagicLink, isLoading, isSuccess, error, googleSignIn, appleSignIn, clearStore } = useAuthStore()
    const searchParams = useSearchParams()
    const router = useRouter()
    const [isEditing, setIsEditing] = useState(false)
    const [googleLoading, setGoogleLoading] = useState(false)
    const [appleLoading, setAppleLoading] = useState(false)

    // `isSuccess` lives in the global auth store, so it would otherwise persist when
    // navigating between /login and /signup and show a stale success screen (with a
    // blank email, since the new form has no value). Reset it on mount.
    useEffect(() => {
        clearStore()
        setIsEditing(false)
    }, [clearStore])

    const rawType = searchParams.get("user_type")
    const userType = Object.values(UserType).includes(rawType as UserType)
        ? (rawType as UserType)
        : null

    const handleGoogleSuccess = async (idToken: string) => {
        setGoogleLoading(true);
        try {
            const result = await googleSignIn(idToken, userType || undefined, "login");
            if (result && "userNotFound" in result && result.userNotFound) {
                const email = result.email;
                toast.warning(
                    email
                        ? `No account found for ${email}. Please sign up to continue.`
                        : "No account found for this Google email. Please sign up to continue.",
                );
                if (email) {
                    redirectUnknownUserToSignup(router, email, userType);
                } else {
                    router.push(userType ? `/signup?user_type=${userType}&from=login` : "/signup?from=login");
                }
                return;
            }
            if (result && "accessToken" in result && result.accessToken) {
                // Kick off profile load before redirecting so the destination page shows
                // its skeleton instead of the signed-out state.
                void useUserStore.getState().initialize();
                toast.success("Successfully logged in with Google!");
                if (result.isNewArtist) {
                    router.push("/artist/onboarding");
                } else if (result.isNewCollector) {
                    router.push("/explore");
                } else {
                    router.push("/app");
                }
            }
        } catch (err) {
            console.error("Google sign-in error:", err);
            toast.error("Failed to log in with Google");
        } finally {
            setGoogleLoading(false);
        }
    };

    const { triggerGoogleSignIn } = useGoogleSignIn({
        onSuccess: handleGoogleSuccess,
        onError: (error) => {
            toast.error(error);
            setGoogleLoading(false);
        },
    });

    const handleAppleSuccess = async (data: { idToken: string; authorizationCode: string; name?: string }) => {
        setAppleLoading(true);
        try {
            const result = await appleSignIn(data.idToken, data.authorizationCode, data.name, userType || undefined, "login");
            if (result && "userNotFound" in result && result.userNotFound) {
                const email = result.email;
                toast.warning(
                    email
                        ? `No account found for ${email}. Please sign up to continue.`
                        : "No account found for this Apple email. Please sign up to continue.",
                );
                if (email) {
                    redirectUnknownUserToSignup(router, email, userType);
                } else {
                    router.push(userType ? `/signup?user_type=${userType}&from=login` : "/signup?from=login");
                }
                return;
            }
            if (result && "accessToken" in result && result.accessToken) {
                void useUserStore.getState().initialize();
                toast.success("Successfully logged in with Apple!");
                if (result.isNewArtist) {
                    router.push("/artist/onboarding");
                } else if (result.isNewCollector) {
                    router.push("/explore");
                } else {
                    router.push("/app");
                }
            }
        } catch (err) {
            console.error("Apple sign-in error:", err);
            toast.error("Failed to log in with Apple");
        } finally {
            setAppleLoading(false);
        }
    };

    const { triggerAppleSignIn } = useAppleSignIn({
        onSuccess: handleAppleSuccess,
        onError: (error) => {
            toast.error(error);
            setAppleLoading(false);
        },
    });

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
        },
        mode: "onChange"
    })

    async function onSubmit(values: z.infer<typeof formSchema>) {
        if (!values.email || values.email.trim() === "") {
            form.setError("email", { type: "manual", message: "Email is required" });
            return;
        }

        const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailPattern.test(values.email)) {
            form.setError("email", { type: "manual", message: "Please enter a valid email address." });
            return;
        }

        const result = await requestMagicLink(values.email, undefined, userType || undefined);
        if (!result.ok && "userNotFound" in result && result.userNotFound) {
            toast.warning("This email is not registered with Crestox. Please sign up to create an account.");
            redirectUnknownUserToSignup(router, result.email ?? values.email, userType);
            return;
        }
        if (result.ok) {
            setIsEditing(false);
        }
    }

    return (
        <div className="flex min-h-screen items-center justify-center p-4">
            <Card className="w-full max-w-lg border-border/50 bg-card/50 backdrop-blur-sm">
                <CardHeader className="space-y-1 text-center pb-6">
                    <CardTitle className="text-2xl font-serif">
                        {userType === UserType.ARTIST ? "Login as Artist" : "Login"}
                    </CardTitle>
                    <CardDescription className="font-sans">
                        {isSuccess
                            ? "Check your email for the magic link."
                            : "Enter your email below to login to your account"
                        }
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {isSuccess ? (
                        !isEditing ? (
                            <div className="flex flex-col items-center justify-center space-y-6 py-8">
                                <div className="text-center text-[17px] text-muted-foreground w-full">
                                    We've sent a secure login link to
                                </div>
                                <div className="flex items-center space-x-3 text-[19px]">
                                    <Mail className="h-6 w-6 text-primary" />
                                    <span className="font-semibold tracking-wide text-foreground">{form.getValues("email")}</span>
                                    <button onClick={() => setIsEditing(true)} className="text-muted-foreground hover:text-foreground transition-colors ml-2">
                                        <Pencil className="h-5 w-5" />
                                    </button>
                                </div>
                                <div className="text-center text-[15px] text-muted-foreground mt-4">
                                    Didn't get the email? Check spam or edit your email.
                                </div>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center space-y-8 py-4">
                                <div className="rounded-full border-[3px] border-primary p-3 mb-2 flex items-center justify-center h-16 w-16 bg-background">
                                    <Check className="h-8 w-8 text-primary" strokeWidth={3} />
                                </div>
                                <Form {...form}>
                                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 w-full max-w-sm">
                                        <FormField
                                            control={form.control}
                                            name="email"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormControl>
                                                        <Input placeholder="m@example.com" {...field} disabled={isLoading} className="bg-transparent border-input text-[15px] h-12 rounded-lg pl-4" />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <div className="flex items-center justify-center space-x-4 pt-2">
                                            <Button
                                                type="submit"
                                                className="bg-primary hover:bg-primary/90 text-primary-foreground font-medium px-6 h-11 rounded-lg"
                                                disabled={isLoading}
                                            >
                                                {isLoading ? "Updating..." : "Update Email"}
                                            </Button>
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                onClick={() => setIsEditing(false)}
                                                disabled={isLoading}
                                                className="text-muted-foreground hover:text-foreground px-6 h-11 rounded-lg"
                                            >
                                                Cancel
                                            </Button>
                                        </div>
                                        {error && (
                                            <div className="text-sm font-medium text-destructive mt-2 text-center">
                                                {error}
                                            </div>
                                        )}
                                    </form>
                                </Form>
                            </div>
                        )
                    ) : (
                        <>
                            <Form {...form}>
                                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                                    <FormField
                                        control={form.control}
                                        name="email"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Email</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="m@example.com" {...field} disabled={isLoading} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    {error && (
                                        <div className="text-sm font-medium text-destructive mt-2">
                                            {error}
                                        </div>
                                    )}

                                    <div className="flex justify-end pt-4">
                                        <GradientButton
                                            type="submit"
                                            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                                            label={isLoading ? "Sending..." : "Continue with Email"}
                                            onClick={() => {
                                                onSubmit(form.getValues())
                                            }}
                                            disabled={isLoading}
                                        />
                                    </div>
                                </form>
                            </Form>

                            <div className="relative my-8">
                                <div className="absolute inset-0 flex items-center">
                                    <span className="w-full border-t" />
                                </div>
                                <div className="relative flex justify-center text-xs uppercase">
                                    <span className="bg-card px-2 text-muted-foreground">
                                        Or continue with
                                    </span>
                                </div>
                            </div>

                            <div className="flex flex-col gap-3">
                                <Button 
                                    variant="outline" 
                                    className="w-full" 
                                    type="button" 
                                    disabled={isLoading || googleLoading || appleLoading}
                                    onClick={triggerGoogleSignIn}
                                >
                                    {googleLoading ? (
                                        <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                                    ) : (
                                        <svg className="mr-2 h-4 w-4" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512">
                                            <path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"></path>
                                        </svg>
                                    )}
                                    {googleLoading ? "Logging in..." : "Login with Google"}
                                </Button>

                                {/* <Button 
                                    variant="outline" 
                                    className="w-full" 
                                    type="button" 
                                    disabled={isLoading || googleLoading || appleLoading}
                                    onClick={triggerAppleSignIn}
                                >
                                    {appleLoading ? (
                                        <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                                    ) : (
                                        <svg className="mr-2 h-4 w-4" aria-hidden="true" focusable="false" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512">
                                            <path fill="currentColor" d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z"/>
                                        </svg>
                                    )}
                                    {appleLoading ? "Logging in..." : "Login with Apple"}
                                </Button> */}
                            </div>
                        </>
                    )}
                </CardContent>
                <CardFooter className="justify-center pb-6 border-t pt-6 bg-muted/20">
                    <div className="text-sm text-muted-foreground font-sans">
                        Don&apos;t have an account?{" "}
                        <Link
                            href={userType ? `/signup?user_type=${userType}` : "/signup"}
                            className="underline underline-offset-4 hover:text-primary"
                        >
                            Sign up
                        </Link>
                    </div>
                </CardFooter>
            </Card>
        </div>
    )
}

export default function LoginPage() {
    return (
        <Suspense fallback={<div className="flex min-h-screen items-center justify-center">Loading...</div>}>
            <LoginFormContent />
        </Suspense>
    )
}

