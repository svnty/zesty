import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// Get all chats for current user
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const userId = (session?.user as any)?.id;
    
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const chats = await prisma.chat.findMany({
      where: {
        activeUsers: {
          some: {
            id: userId,
          },
        },
      },
      include: {
        activeUsers: {
          select: {
            id: true,
            slug: true,
            images: {
              where: { default: true },
              select: { url: true }
            }
          },
        },
        messages: {
          orderBy: {
            createdAt: 'desc',
          },
          take: 1,
          include: {
            sender: {
              select: {
                id: true,
                slug: true,
                images: {
                  where: { default: true },
                  select: { url: true }
                }
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Format the chats to include the other user and last message
    const formattedChats = chats.map((chat) => {
      const otherUser = chat.activeUsers.find((user) => user.id !== userId);
      const lastMessage = chat.messages[0] || null;

      return {
        id: chat.id,
        otherUser,
        lastMessage,
        createdAt: chat.createdAt,
      };
    });

    return NextResponse.json(formattedChats);
  } catch (error) {
    console.error("Error fetching chats:", error);
    return NextResponse.json({ error: "Failed to fetch chats" }, { status: 500 });
  }
}
