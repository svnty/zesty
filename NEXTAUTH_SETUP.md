# NextAuth.js Configuration Guide

## ✅ Setup Complete!

Your NextAuth.js is now configured and ready to use. Here's what was set up:

## 📁 Files Created/Updated

1. **`app/api/auth/[...nextauth]/route.ts`** - NextAuth API route handler
2. **`lib/auth.ts`** - NextAuth configuration with OAuth providers
3. **`lib/session.ts`** - Server-side session helpers
4. **`types/next-auth.d.ts`** - TypeScript type definitions
5. **`prisma/schema.prisma`** - Updated with Session and VerificationToken models
6. **`.env`** - Environment variables template
7. **`.env.example`** - Example environment variables

## 🚀 Next Steps

### 1. Configure Environment Variables

Edit your `.env` file and add:

```bash
# Generate a secure secret
openssl rand -base64 32
```

Add your database connection strings and OAuth credentials:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/zesty"
DIRECT_URL="postgresql://user:password@localhost:5432/zesty"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-generated-secret"
```

### 2. Run Database Migration

```bash
npx prisma migrate dev --name add-nextauth-models
```

### 3. Set Up OAuth Providers (Optional)

#### Google OAuth:
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URI: `http://localhost:3000/api/auth/callback/google`
6. Add credentials to `.env`:
```env
GOOGLE_ID="your-client-id"
GOOGLE_SECRET="your-client-secret"
```

#### Facebook OAuth:
1. Go to [Facebook Developers](https://developers.facebook.com/)
2. Create a new app
3. Add Facebook Login product
4. Add redirect URI: `http://localhost:3000/api/auth/callback/facebook`
5. Add credentials to `.env`:
```env
FACEBOOK_ID="your-app-id"
FACEBOOK_SECRET="your-app-secret"
```

#### Azure AD OAuth:
1. Go to [Azure Portal](https://portal.azure.com/)
2. Navigate to Azure Active Directory > App registrations
3. Create a new registration
4. Add redirect URI: `http://localhost:3000/api/auth/callback/azure-ad`
5. Create a client secret
6. Add credentials to `.env`:
```env
AZURE_AD_CLIENT_ID="your-client-id"
AZURE_AD_CLIENT_SECRET="your-client-secret"
AZURE_AD_TENANT_ID="your-tenant-id"
```

## 📖 Usage Examples

### Server Component (App Router)

```tsx
import { getSession, getCurrentUser } from "@/lib/session";
import { redirect } from "next/navigation";

export default async function MyPage() {
  const session = await getSession();
  
  if (!session) {
    redirect("/api/auth/signin");
  }

  return <div>Welcome {session.user?.name}</div>;
}
```

### Client Component

```tsx
"use client";

import { useSession, signIn, signOut } from "next-auth/react";

export default function MyComponent() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  if (!session) {
    return <button onClick={() => signIn()}>Sign In</button>;
  }

  return (
    <div>
      <p>Welcome {session.user?.name}</p>
      <button onClick={() => signOut()}>Sign Out</button>
    </div>
  );
}
```

### Add Session Provider to Root Layout

To use `useSession()` in client components, wrap your app with SessionProvider:

```tsx
// app/layout.tsx
import { SessionProvider } from "next-auth/react";

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  );
}
```

## 🔒 API Routes

- **Sign In**: `/api/auth/signin`
- **Sign Out**: `/api/auth/signout`
- **Session**: `/api/auth/session`
- **CSRF Token**: `/api/auth/csrf`
- **Providers**: `/api/auth/providers`

## 🔧 Customization

### Custom Sign-In Page

The auth configuration already points to a custom sign-in page at `/auth/signin`. Create this page or update the path in `lib/auth.ts`:

```tsx
// app/auth/signin/page.tsx
import { getProviders } from "next-auth/react";

export default async function SignIn() {
  const providers = await getProviders();
  
  return (
    <div>
      {Object.values(providers).map((provider) => (
        <button key={provider.name} onClick={() => signIn(provider.id)}>
          Sign in with {provider.name}
        </button>
      ))}
    </div>
  );
}
```

## 📝 Database Schema

Your Prisma schema now includes these NextAuth models:
- `Account` - OAuth accounts
- `Session` - User sessions (updated)
- `VerificationToken` - Email verification tokens
- `User` - Updated with `emailVerified` and `sessions` relation

## 🐛 Troubleshooting

### "No session found"
- Make sure `NEXTAUTH_SECRET` is set in `.env`
- Check that `NEXTAUTH_URL` matches your app URL
- Verify database connection is working

### "Provider error"
- Ensure OAuth credentials are correct
- Check redirect URIs match exactly
- Verify OAuth apps are enabled in provider dashboards

### Database errors
- Run `npx prisma migrate dev` to apply migrations
- Check database connection strings
- Ensure PostgreSQL is running

## 📚 Documentation

- [NextAuth.js Docs](https://next-auth.js.org/)
- [Prisma Adapter Docs](https://authjs.dev/reference/adapter/prisma)
- [Next.js App Router](https://nextjs.org/docs/app)

## Test Page

Visit `/protected` to test authentication (page created at `app/protected/page.tsx`)
