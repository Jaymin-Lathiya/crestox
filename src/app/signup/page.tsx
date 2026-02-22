"use client"

import { useState } from "react"
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
import { PasswordInput } from "@/components/ui/password-input"
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
import { CheckIcon, LoaderCircleIcon } from "lucide-react"
import GradientButton from "@/components/ui/gradiant-button"
import ArtistProfileForm from "./ArtistProfileForm"

const formSchema = z.object({
    firstName: z.string().min(1, { message: "First name is required." }),
    lastName: z.string().min(1, { message: "Last name is required." }),
    email: z.string().email({ message: "Please enter a valid email address." }),
    password: z.string().min(6, { message: "Password must be at least 6 characters." }),
})

export default function SignupPage() {
    const [activeStep, setActiveStep] = useState(1);
    const [isSuccess, setIsSuccess] = useState(false);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            firstName: "",
            lastName: "",
            email: "",
            password: "",
        },
        mode: "onChange"
    })

    function onSubmit(values: z.infer<typeof formSchema>) {
        console.log("Form submitted:", values)
        setIsSuccess(true)
    }

    const nextStep = async () => {
        let isValid = false;
        if (activeStep === 1) {
            isValid = await form.trigger(["firstName", "lastName"]);
        } else if (activeStep === 2) {
            isValid = await form.trigger("email");
        }

        if (isValid) {
            setActiveStep((prev) => Math.min(prev + 1, 3));
        }
    };

    const prevStep = () => {
        setActiveStep((prev) => Math.max(prev - 1, 1));
    };

    return (
        <div className="flex min-h-screen items-center justify-center p-4">
            {isSuccess ? (
                <div className="w-full flex justify-center py-10">
                    <ArtistProfileForm />
                </div>
            ) : (
                <Card className="w-full max-w-lg border-border/50 bg-card/50 backdrop-blur-sm">
                    <CardHeader className="space-y-1 text-center pb-2">
                        <CardTitle className="text-2xl font-serif">Sign Up</CardTitle>
                        <CardDescription className="font-sans">
                            Create your account in 3 simple steps
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-6">
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
                                        <StepperSeparator className="group-data-[state=completed]/step:bg-primary" />
                                    </StepperItem>

                                    <StepperItem step={3}>
                                        <StepperTrigger className="cursor-default">
                                            <StepperIndicator className="data-[state=completed]:bg-primary data-[state=completed]:text-white">
                                                3
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

                                        <StepperContent value={3} className="space-y-4">
                                            <FormField
                                                control={form.control}
                                                name="password"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Password</FormLabel>
                                                        <FormControl>
                                                            <PasswordInput {...field} />
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

                                            {activeStep < 3 ? (
                                                <GradientButton
                                                    type="button"
                                                    onClick={nextStep}

                                                    className="bg-[#3B82F6] hover:bg-[#2563EB] text-white"
                                                    label="Next"
                                                >
                                                </GradientButton>
                                            ) : (
                                                <GradientButton
                                                    type="submit"
                                                    className="bg-[#3B82F6] hover:bg-[#2563EB] text-white"
                                                    label="Create Account"
                                                >

                                                </GradientButton>
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
                    </CardContent>
                    <CardFooter className="justify-center pb-6">
                        <div className="text-sm text-muted-foreground font-sans">
                            Already have an account?{" "}
                            <Link href="/login" className="underline underline-offset-4 hover:text-primary">
                                Login
                            </Link>
                        </div>
                    </CardFooter>
                </Card>
            )}
        </div>
    )
}
