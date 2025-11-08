import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// Mark messages as read in a chat
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ chatId: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    const userId = (session?.user as any)?.id;
    
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { chatId } = await params;

    // Verify user is part of this chat
    const chat = await prisma.chat.findFirst({
      where: {
        id: chatId,
        activeUsers: {
          some: {
            id: userId,
          },
        },
      },
    });

    if (!chat) {
      return NextResponse.json({ error: "Chat not found" }, { status: 404 });
    }

    // Find all messages from others in this chat
    const messagesFromOthers = await prisma.chatMessage.findMany({
      where: {
        chatId: chatId,
        senderId: {
          not: userId,
        },
      },
      select: {
        id: true,
      },
    });

    if (messagesFromOthers.length === 0) {
      return NextResponse.json({ success: true, markedRead: 0 });
    }

    // Find which of these messages have already been read
    const alreadyRead = await prisma.messageRead.findMany({
      where: {
        messageId: {
          in: messagesFromOthers.map(m => m.id),
        },
        userId: userId,
      },
      select: {
        messageId: true,
      },
    });

    const alreadyReadIds = new Set(alreadyRead.map(r => r.messageId));
    const unreadMessages = messagesFromOthers.filter(m => !alreadyReadIds.has(m.id));

    // Mark all unread messages as read
    if (unreadMessages.length > 0) {
      await prisma.messageRead.createMany({
        data: unreadMessages.map((msg) => ({
          messageId: msg.id,
          userId: userId,
        })),
        skipDuplicates: true, // In case of race conditions
      });
    }

    return NextResponse.json({ success: true, markedRead: unreadMessages.length });
  } catch (error) {
    console.error("Error marking messages as read:", error);
    return NextResponse.json({ error: "Failed to mark messages as read" }, { status: 500 });
  }
}
