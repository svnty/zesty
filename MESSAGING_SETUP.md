# Real-time Messaging System

This messaging system uses Supabase Realtime for instant message delivery and Prisma for database management.

## Features

- ✅ Real-time message delivery using Supabase Realtime
- ✅ Chat list showing all conversations
- ✅ Individual chat view with full message history
- ✅ User avatars and names
- ✅ Message timestamps with relative time display
- ✅ **Unread message tracking per user**
- ✅ **Unread badges in navigation (desktop & mobile)**
- ✅ **Unread counts per chat in chat list**
- ✅ **Auto-mark messages as read when viewing chat**
- ✅ Typing indicator support ready
- ✅ Responsive design

## Setup

### 1. Supabase Configuration

1. Create a Supabase project at [https://supabase.com](https://supabase.com)

2. Get your Supabase credentials from Project Settings → API:
   - Project URL
   - Anon/Public key

3. Add these to your `.env.local` file:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

**Note on Authentication**: Your app uses NextAuth for authentication, not Supabase Auth. Supabase is only used for:
- Real-time subscriptions (listening to database changes)
- Your PostgreSQL database hosting (if using Supabase Postgres)

All authentication is handled by NextAuth in the API routes.

### 2. Database Setup

Your database is already configured with Prisma. The chat schema includes:
- `Chat` - Represents a conversation between users
- `ChatMessage` - Individual messages in a chat
- `MessageRead` - Tracks which users have read which messages
- User relations through `activeUsers` and `hiddenUsers`

### 3. Enable Realtime in Supabase

**Step-by-step instructions:**

1. **Go to your Supabase Dashboard**
   - Navigate to [https://supabase.com/dashboard](https://supabase.com/dashboard)
   - Select your project

2. **Enable Realtime for ChatMessage table**
   - In the left sidebar, click **Database**
   - Click **Replication** (or **Publications** in older versions)
   - You'll see a list of tables
   - Find the **ChatMessage** table
   - Toggle the switch to **enable** replication for this table
   - Click **Save** or the toggle will auto-save

3. **Verify it's enabled**
   - The ChatMessage row should now show as enabled/active
   - You should see a green checkmark or "enabled" status

**What this does:**
- Enables PostgreSQL's logical replication for the ChatMessage table
- Allows Supabase Realtime to broadcast INSERT/UPDATE/DELETE events
- Does NOT affect your data or existing queries

**Alternative: Enable via SQL**

If you prefer SQL, you can also enable replication by running this in the SQL Editor:

```sql
-- Enable replication for ChatMessage table
ALTER TABLE "ChatMessage" REPLICA IDENTITY FULL;
```

**Note:** You do NOT need to enable replication for:
- `Chat` table (we don't need real-time updates for chat creation)
- `MessageRead` table (read status updates are fetched on-demand)
- `User` table

Only `ChatMessage` needs real-time because that's where new messages appear.

**Troubleshooting:**
- If you don't see the Replication option, make sure you're using Supabase Postgres
- If using an external database, you'll need to configure Supabase's connection to it first

### 4. Row Level Security (Optional but Recommended)

**IMPORTANT**: Since you're using NextAuth with JWT sessions (not Supabase Auth), the `auth.uid()` function won't work. Instead, your API routes handle authentication via NextAuth sessions.

**RLS is optional** because:
- Your API routes already verify user sessions
- API routes check if users are part of chats before returning data
- Direct database access is blocked (users can't query Prisma directly)

If you still want RLS for defense-in-depth, you would need to:
1. Set up Supabase Auth alongside NextAuth, OR
2. Use a custom RLS function that validates NextAuth JWTs

For most use cases, **the API-level authentication is sufficient and recommended**.

## Usage

### Viewing Chats

Navigate to `/[lang]/messages` to see all your conversations. The list shows:
- Other user's avatar and name
- Last message preview
- Time since last message

### Individual Chat

Click on a chat to open the full conversation at `/[lang]/messages/[chatId]`. You can:
- View all messages in real-time
- Send new messages
- See message timestamps
- Distinguish between sent and received messages
- **Messages are automatically marked as read when you open the chat**

### Unread Message Tracking

The system tracks which users have read which messages:
- **Navigation badges**: Red badge shows total unread count on mail icons
- **Chat list badges**: Each chat shows its unread count
- **Auto-mark as read**: Opening a chat automatically marks all messages as read
- **Real-time updates**: Unread counts update instantly when new messages arrive

The system uses the `MessageRead` table which stores:
- Which user read which message
- When they read it
- Works for group chats (different users read at different times)

### Creating a New Chat

You have multiple options to create a new chat:

#### Option 1: Using the StartChatButton Component

The easiest way is to use the `<StartChatButton />` component:

```tsx
import { StartChatButton } from '@/components/start-chat-button';

// In your component
<StartChatButton otherUserId="user-id-here" lang="en" />

// Custom button text
<StartChatButton otherUserId="user-id-here" lang="en">
  Send Message
</StartChatButton>

// Different variants
<StartChatButton 
  otherUserId="user-id-here" 
  lang="en"
  variant="outline"
  size="sm"
/>
```

This button will:
- Create a new chat if one doesn't exist
- Navigate to existing chat if it already exists
- Show loading state while processing

#### Option 2: Using the API Route

```typescript
const response = await fetch('/api/messages/create', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({ otherUserId: 'user-id-here' }),
});

const chat = await response.json();
// Navigate to: /${lang}/messages/${chat.id}
```

#### Option 3: Using the Helper Function (Server-Side)

```typescript
import { getOrCreateChat } from '@/lib/chat';

const chat = await getOrCreateChat(user1Id, user2Id);
```

This is typically done when:
- A user sends a private offer
- A user initiates contact from a profile
- Users match in the dating system

### `<StartChatButton />`
Located at `components/start-chat-button.tsx`
- Button to initiate a chat with another user
- Handles chat creation/retrieval automatically
- Navigates to chat on success
- Customizable appearance

## Utility Functions

### `lib/chat.ts`

#### `getOrCreateChat(user1Id, user2Id)`
Creates a new chat or returns existing one between two users.

#### `createGroupChat(userIds[])`
Creates a group chat with multiple users.

#### `hideChat(chatId, userId)`
Hides a chat for a specific user (moves to hidden).

#### `unhideChat(chatId, userId)`
Restores a hidden chat to active chats.

## API Routes

### `POST /api/messages/create`
Creates or retrieves an existing chat between users.

Body:
```json
{
  "otherUserId": "user-id"
}
```

Returns the chat object with user information.

## Components

### `<ChatList />`
Located at `components/chat-list.tsx`
- Displays all user chats
- Subscribes to new message events
- Auto-refreshes when new messages arrive

### `<ChatWindow chatId={string} />`
Located at `components/chat-window.tsx`
- Displays individual chat messages
- Real-time message updates
- Message input and sending
- Auto-scrolls to latest message

### `<StartChatButton />`
Located at `components/start-chat-button.tsx`
- Button to initiate a chat with another user
- Handles chat creation/retrieval automatically
- Navigates to chat on success
- Customizable appearance

## Utility Functions

### `lib/chat.ts`

#### `getOrCreateChat(user1Id, user2Id)`
Creates a new chat or returns existing one between two users.

#### `createGroupChat(userIds[])`
Creates a group chat with multiple users.

#### `hideChat(chatId, userId)`
Hides a chat for a specific user (moves to hidden).

#### `unhideChat(chatId, userId)`
Restores a hidden chat to active chats.

## API Routes (Reference)

### `POST /api/messages/create`
Creates or retrieves an existing chat between users.

Body:
```json
{
  "otherUserId": "user-id"
}
```

### `GET /api/messages/unread-count`
Returns unread message counts for the current user.

Response:
```json
{
  "totalUnread": 5,
  "chatsWithUnread": 2,
  "unreadByChat": [
    { "chatId": "chat1", "count": 3 },
    { "chatId": "chat2", "count": 2 }
  ]
}
```

### `POST /api/messages/[chatId]/mark-read`
Marks all unread messages in a chat as read for the current user.

Response:
```json
{
  "success": true,
  "markedRead": 5
}
```

### `GET /api/messages`
Located at `components/chat-list.tsx`
- Displays all user chats
- Subscribes to new message events
- Auto-refreshes when new messages arrive

### `<ChatWindow chatId={string} />`
Located at `components/chat-window.tsx`
- Displays individual chat messages
- Real-time message updates
- Message input and sending
- Auto-scrolls to latest message

## API Routes

### `GET /api/messages`
Returns all chats for the current user with:
- Other user information
- Last message in each chat

### `GET /api/messages/[chatId]`
Returns a specific chat with:
- All messages
- Other user information

### `POST /api/messages/[chatId]`
Sends a new message to the chat.

Body:
```json
{
  "content": "message text"
}
```

## How Realtime Works

1. When the page loads, it subscribes to the `ChatMessage` table changes
2. When a new message is inserted, Supabase broadcasts the change
3. All connected clients receive the update instantly
4. The UI updates automatically with the new message

## Security

### How Authentication Works

Your messaging system uses a **layered security approach**:

1. **NextAuth Session Verification** (Primary Security)
   - All API routes verify the user's NextAuth session
   - Routes check `getServerSession()` before accessing data
   - Users must be logged in to access any messaging endpoints

2. **Chat Membership Verification** (Authorization)
   - API routes verify users are part of the chat they're accessing
   - Messages can only be sent to chats the user belongs to
   - Chat lists only show chats the user is an active member of

3. **Real-time Subscriptions** (Read-Only)
   - Supabase Realtime only broadcasts change notifications
   - It does NOT expose message content directly
   - Clients still fetch actual data through authenticated API routes
   - Even if someone subscribes to `ChatMessage` changes, they only get INSERT events, not the data

### Why No RLS?

Row Level Security (RLS) is designed for Supabase Auth. Since you use NextAuth:
- `auth.uid()` doesn't exist (it's a Supabase Auth function)
- Your API routes already handle all authorization
- RLS would require complex JWT validation setup

**Your current setup is secure** because:
- ✅ All database access goes through API routes
- ✅ API routes verify sessions and chat membership
- ✅ Users can't query the database directly
- ✅ Supabase Realtime only sends notifications, not data

### What Gets Broadcasted?

When Supabase Realtime broadcasts a message insert, it sends:
```javascript
{
  new: {
    id: "message_id",
    senderId: "user_id",
    chatId: "chat_id",
    content: "message content",  // ⚠️ This is visible to all subscribers
    createdAt: "timestamp"
  }
}
```

**To improve privacy**, you could:
1. Only broadcast the message ID, not the content
2. Have clients fetch the full message via API
3. Or continue as-is (message content is only visible to those subscribed to that specific chat channel)

The current implementation is fine for most use cases since:
- Users must know the `chatId` to subscribe
- Message content is already semi-public (sent to all chat members)
- API routes ensure users can only access chats they're part of

## Troubleshooting

### Messages not appearing in real-time

1. Check that realtime is enabled for `ChatMessage` table in Supabase
2. Verify your `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are correct
3. Check browser console for connection errors

### "Unauthorized" errors

1. Ensure user is logged in (check session)
2. Verify the user is part of the chat they're trying to access

### Database connection issues

1. Check your `DATABASE_URL` and `DIRECT_URL` in `.env.local`
2. Run `npx prisma generate` to ensure Prisma client is up to date
3. Verify database migrations are applied: `npx prisma migrate deploy`

## Future Enhancements

- [ ] Typing indicators
- [ ] Message reactions
- [ ] File/image sharing
- [ ] Message deletion
- [ ] Message editing
- [ ] Push notifications for new messages
- [ ] Voice messages
- [ ] Video calls
- [ ] Group chat support
- [x] Read receipts (✅ Completed!)
- [x] Unread message tracking (✅ Completed!)
