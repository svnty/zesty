import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getOrCreateChat } from "@/lib/chat";

// Create or get existing chat with another user
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const userSlug = (session?.user as any)?.slug;
    
    if (!userSlug) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { otherUserSlug } = await req.json();

    if (!otherUserSlug) {
      return NextResponse.json({ error: "otherUserId is required" }, { status: 400 });
    }

    if (otherUserSlug === userSlug) {
      return NextResponse.json({ error: "Cannot create chat with yourself" }, { status: 400 });
    }

    // Get or create the chat
    const chat = await getOrCreateChat(userSlug, otherUserSlug);

    return NextResponse.json(chat);
  } catch (error) {
    console.error("Error creating/getting chat:", error);
    return NextResponse.json({ error: "Failed to create chat" }, { status: 500 });
  }
}
