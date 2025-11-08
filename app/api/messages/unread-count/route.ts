import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// Get count of unread messages for current user
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const userId = (session?.user as any)?.id;
    
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Count messages where:
    // 1. User is in the chat (active)
    // 2. Message was not sent by the user
    // 3. User has not read the message
    
    // First, get all messages from others in user's chats
    const messagesFromOthers = await prisma.chatMessage.findMany({
      where: {
        chat: {
          activeUsers: {
            some: {
              id: userId,
            },
          },
        },
        senderId: {
          not: userId,
        },
      },
      select: {
        id: true,
        chatId: true,
      },
    });

    if (messagesFromOthers.length === 0) {
      return NextResponse.json({
        totalUnread: 0,
        chatsWithUnread: 0,
        unreadByChat: [],
      });
    }

    // Find which messages have been read by this user
    const readMessages = await prisma.messageRead.findMany({
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

    const readMessageIds = new Set(readMessages.map(r => r.messageId));
    const unreadMessages = messagesFromOthers.filter(m => !readMessageIds.has(m.id));

    // Group unread messages by chat
    const unreadByChat = unreadMessages.reduce((acc, msg) => {
      if (!acc[msg.chatId]) {
        acc[msg.chatId] = 0;
      }
      acc[msg.chatId]++;
      return acc;
    }, {} as Record<string, number>);

    const chatUnreadCounts = Object.entries(unreadByChat).map(([chatId, count]) => ({
      chatId,
      count,
    }));

    return NextResponse.json({
      totalUnread: unreadMessages.length,
      chatsWithUnread: chatUnreadCounts.length,
      unreadByChat: chatUnreadCounts,
    });
  } catch (error) {
    console.error("Error fetching unread count:", error);
    return NextResponse.json({ error: "Failed to fetch unread count" }, { status: 500 });
  }
}
