
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    // Registration is disabled for security
    return new NextResponse("Registration is disabled. Please contact the administrator.", { status: 403 });
}
