import { NextRequest, NextResponse } from "next/server";
import { registerUser, sendVerificationEmail } from "@/lib/keycloak";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { email, password, firstName, lastName } = body;

        if (!email || !password) {
            return NextResponse.json(
                { error: "Email and password are required" },
                { status: 400 }
            );
        }

        if (password.length < 8) {
            return NextResponse.json(
                { error: "Password must be at least 8 characters" },
                { status: 400 }
            );
        }

        const result = await registerUser(email, password, firstName, lastName);

        if (!result.success) {
            return NextResponse.json(
                { error: result.error },
                { status: 400 }
            );
        }

        // Optionally send verification email
        if (result.userId) {
            await sendVerificationEmail(result.userId);
        }

        return NextResponse.json({
            success: true,
            message: "Registration successful",
            userId: result.userId,
        });
    } catch (error) {
        console.error("Registration error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
