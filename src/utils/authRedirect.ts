import type { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { UserType } from "@/enums/userType";

export function buildSignupUrl(email: string, userType?: UserType | null) {
    const params = new URLSearchParams({ email, from: "login" });
    if (userType) {
        params.set("user_type", userType);
    }
    return `/signup?${params.toString()}`;
}

export function redirectUnknownUserToSignup(
    router: AppRouterInstance,
    email: string,
    userType?: UserType | null,
) {
    router.push(buildSignupUrl(email, userType));
}
