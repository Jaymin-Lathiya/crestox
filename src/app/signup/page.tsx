"use client"

import { useState, Suspense } from "react"
import { useSearchParams } from "next/navigation"
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
import {
    Stepper,
    StepperContent,
    StepperItem,
    StepperNav,
    StepperTrigger,
    StepperIndicator,
    StepperTitle,
    StepperDescription,
    StepperSeparator,
    StepperPanel
} from "@/components/reui/stepper"
import { CheckIcon, LoaderCircleIcon, CheckCircle2 } from "lucide-react"
import GradientButton from "@/components/ui/gradiant-button"
import ArtistProfileForm from "./ArtistProfileForm"
import { useAuthStore } from "@/store/useAuthStore"

const formSchema = z.object({
    firstName: z.string().min(1, { message: "First name is required." }),
    lastName: z.string().min(1, { message: "Last name is required." }),
    email: z.string().email({ message: "Please enter a valid email address." }),
    user_type: z.nativeEnum(UserType).default(UserType.COLLECTOR),
})

function SignupFormContent() {
    const { requestMagicLink, isLoading, isSuccess, error } = useAuthStore()
    const [activeStep, setActiveStep] = useState(1);

    const searchParams = useSearchParams();

    const rawType = searchParams.get("user_type");
    const userType = Object.values(UserType).includes(rawType as UserType)
        ? (rawType as UserType)
        : UserType.COLLECTOR;

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            firstName: "",
            lastName: "",
            email: "",
            user_type: userType,
        },
        mode: "onChange"
    })

    async function onSubmit(values: z.infer<typeof formSchema>) {
        const name = `${values.firstName} ${values.lastName}`.trim();
        await requestMagicLink(values.email, name, values.user_type);
    }

    const nextStep = async () => {
        let isValid = false;
        if (activeStep === 1) {
            isValid = await form.trigger(["firstName", "lastName"]);
        } else if (activeStep === 2) {
            isValid = await form.trigger("email");
        }

        if (isValid) {
            setActiveStep((prev) => Math.min(prev + 1, 2));
        }
    };

    const prevStep = () => {
        setActiveStep((prev) => Math.max(prev - 1, 1));
    };

    return (
        <div className="flex min-h-screen items-center justify-center p-4">
            <Card className="w-full max-w-lg border-border/50 bg-card/50 backdrop-blur-sm">
                <CardHeader className="space-y-1 text-center pb-2">
                    <CardTitle className="text-2xl font-serif">
                        {userType === UserType.ARTIST ? "Join as an Artist" : "Create Your Collector Account"}
                    </CardTitle>
                    <CardDescription className="font-sans">
                        {isSuccess
                            ? "Check your email for the verification link."
                            : "Create your account in 3 simple steps"
                        }
                    </CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                    {isSuccess ? (
                        <div className="flex flex-col items-center justify-center space-y-4 py-8">
                            <CheckCircle2 className="h-16 w-16 text-primary" />
                            <p className="text-center text-muted-foreground">
                                We've sent a secure verification link to <strong>{form.getValues("email")}</strong>.
                                Please check your inbox.
                            </p>
                        </div>
                    ) : (
                        <>
                            <Stepper
                                value={activeStep}
                                onValueChange={setActiveStep}
                                orientation="vertical"
                                className="flex flex-col items-center justify-center gap-10"
                                indicators={{
                                    completed: (
                                        <CheckIcon className="size-3.5" />
                                    ),
                                    loading: (
                                        <LoaderCircleIcon className="size-3.5 animate-spin" />
                                    ),
                                }}
                            >

                                <StepperPanel className="flex w-full">
                                    <StepperNav className="justify-center items-center mt-5 gap-2 me-3">
                                        <StepperItem step={1} completed={activeStep > 1}>
                                            <StepperTrigger onClick={() => { if (activeStep > 1) setActiveStep(1) }}>
                                                <StepperIndicator className="data-[state=completed]:bg-primary data-[state=completed]:text-white">
                                                    1
                                                </StepperIndicator>
                                            </StepperTrigger>
                                            <StepperSeparator className="group-data-[state=completed]/step:bg-primary" />
                                        </StepperItem>

                                        <StepperItem step={2} completed={activeStep > 2}>
                                            <StepperTrigger onClick={async () => {
                                                if (activeStep > 2) {
                                                    setActiveStep(2)
                                                } else if (activeStep === 1) {
                                                    const isValid = await form.trigger(["firstName", "lastName"]);
                                                    if (isValid) setActiveStep(2);
                                                }
                                            }}>
                                                <StepperIndicator className="data-[state=completed]:bg-primary data-[state=completed]:text-white">
                                                    2
                                                </StepperIndicator>
                                            </StepperTrigger>
                                        </StepperItem>
                                    </StepperNav>

                                    <Form {...form}>
                                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 min-h-[200px] flex flex-col w-full">
                                            <StepperContent value={1} className="space-y-4">
                                                <div className="grid grid-cols-2 gap-4">
                                                    <FormField
                                                        control={form.control}
                                                        name="firstName"
                                                        render={({ field }) => (
                                                            <FormItem>
                                                                <FormLabel>First name</FormLabel>
                                                                <FormControl>
                                                                    <Input placeholder="Max" {...field} />
                                                                </FormControl>
                                                                <FormMessage />
                                                            </FormItem>
                                                        )}
                                                    />
                                                    <FormField
                                                        control={form.control}
                                                        name="lastName"
                                                        render={({ field }) => (
                                                            <FormItem>
                                                                <FormLabel>Last name</FormLabel>
                                                                <FormControl>
                                                                    <Input placeholder="Robinson" {...field} />
                                                                </FormControl>
                                                                <FormMessage />
                                                            </FormItem>
                                                        )}
                                                    />
                                                </div>
                                            </StepperContent>

                                            <StepperContent value={2} className="space-y-4">
                                                <FormField
                                                    control={form.control}
                                                    name="email"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>Email</FormLabel>
                                                            <FormControl>
                                                                <Input placeholder="m@example.com" {...field} />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                            </StepperContent>

                                            <div className="flex justify-between !mt-[50px]">
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    onClick={prevStep}
                                                    disabled={activeStep === 1}
                                                    className={`rounded-lg ${activeStep === 1 ? "opacity-0" : ""}`}
                                                >
                                                    Back
                                                </Button>

                                                {activeStep < 2 ? (
                                                    <GradientButton
                                                        type="button"
                                                        onClick={nextStep}

                                                        className="bg-[#3B82F6] hover:bg-[#2563EB] text-white"
                                                        label="Next"
                                                    >
                                                    </GradientButton>
                                                ) : (
                                                    <div className="flex flex-col w-full text-right items-end gap-2">
                                                        <GradientButton
                                                            type="submit"
                                                            className="bg-[#3B82F6] hover:bg-[#2563EB] text-white w-40"
                                                            label={isLoading ? "Loading..." : "Create Account"}
                                                            onClick={form.handleSubmit(onSubmit)}
                                                            disabled={isLoading}
                                                        />
                                                        {error && (
                                                            <span className="text-sm text-destructive">{error}</span>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        </form>
                                    </Form>
                                </StepperPanel>
                            </Stepper>

                            <div className="relative my-6">
                                <div className="absolute inset-0 flex items-center">
                                    <span className="w-full border-t" />
                                </div>
                                <div className="relative flex justify-center text-xs uppercase">
                                    <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
                                </div>
                            </div>

                            <Button variant="outline" className="w-full" type="button">
                                <svg className="mr-2 h-4 w-4" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512">
                                    <path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"></path>
                                </svg>
                                Sign up with Google
                            </Button>
                        </>
                    )}
                </CardContent>
                <CardFooter className="justify-center pb-6 border-t pt-6 bg-muted/20">
                    <div className="text-sm text-muted-foreground font-sans">
                        Already have an account?{" "}
                        <Link href="/login" className="underline underline-offset-4 hover:text-primary">
                            Login
                        </Link>
                    </div>
                </CardFooter>
            </Card>
        </div>
    )
}

export default function SignupPage() {
    return (
        <Suspense fallback={<div className="flex min-h-screen items-center justify-center">Loading...</div>}>
            <SignupFormContent />
        </Suspense>
    )
}
