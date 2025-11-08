# Messaging System - Quick Start

## What Was Built

A complete real-time messaging system with:
- Chat list showing all conversations
- Individual chat windows with message history
- Real-time message delivery using Supabase
- Easy-to-use button to start chats with any user

## Files Created/Modified

### Components
- `components/chat-list.tsx` - List of all chats
- `components/chat-window.tsx` - Individual chat interface
- `components/start-chat-button.tsx` - Button to start a new chat

### API Routes
- `app/api/messages/route.ts` - Get all chats for current user
- `app/api/messages/[chatId]/route.ts` - Get/send messages in a chat
- `app/api/messages/create/route.ts` - Create or get chat with another user

### Pages
- `app/[lang]/messages/page.tsx` - Chat list page
- `app/[lang]/messages/[slug]/page.tsx` - Individual chat page

### Utilities
- `lib/supabase.ts` - Supabase client configuration
- `lib/chat.ts` - Chat utility functions
- `lib/utils.ts` - Added `formatDistanceToNow()` function

### Configuration
- `types/next-auth.d.ts` - NextAuth type definitions with user.id
- `.env.local.example` - Environment variable template

### Documentation
- `MESSAGING_SETUP.md` - Complete setup guide

## Quick Setup Steps

1. **Install Dependencies** ✅ (Already done)
   - `@supabase/supabase-js` installed

2. **Add Environment Variables**
   Create `.env.local` with:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

3. **Enable Realtime in Supabase**
   - Go to your Supabase Dashboard
   - Navigate to Database → Replication
   - Enable replication for the `ChatMessage` table

4. **Use the Components**

   ```tsx
   // In any profile page or user list
   import { StartChatButton } from '@/components/start-chat-button';
   
   <StartChatButton otherUserId={userId} lang="en" />
   ```

## How It Works

1. **Starting a Chat**
   - User clicks `<StartChatButton />`
   - API checks if chat exists, creates if not
   - User is redirected to chat window

2. **Real-time Messages**
   - Messages saved to database via API
   - Supabase Realtime broadcasts insert to all clients
   - UI updates instantly without refresh

3. **Chat List**
   - Shows all active conversations
   - Updates when new messages arrive
   - Displays last message preview

## Example Usage

### On a User Profile Page
```tsx
import { StartChatButton } from '@/components/start-chat-button';

export function UserProfile({ user }: { user: User }) {
  return (
    <div>
      <h1>{user.name}</h1>
      <StartChatButton otherUserId={user.id} lang="en">
        Send Message
      </StartChatButton>
    </div>
  );
}
```

### In a User List
```tsx
import { StartChatButton } from '@/components/start-chat-button';

export function UserList({ users }: { users: User[] }) {
  return (
    <div>
      {users.map((user) => (
        <div key={user.id}>
          <span>{user.name}</span>
          <StartChatButton 
            otherUserId={user.id} 
            lang="en"
            variant="outline"
            size="sm"
          />
        </div>
      ))}
    </div>
  );
}
```

## Testing

1. **Create Test Users**
   - Sign in with two different accounts

2. **Start a Chat**
   - Add `<StartChatButton otherUserId="other-user-id" />` somewhere
   - Click to create chat

3. **Test Real-time**
   - Open chat in two browser windows (different users)
   - Send messages from one
   - See them appear instantly in the other

## Next Steps

See `MESSAGING_SETUP.md` for:
- Detailed setup instructions
- Row Level Security policies
- Advanced configuration
- Troubleshooting guide
- Future enhancements
