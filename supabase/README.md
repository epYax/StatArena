# Supabase Edge Functions Setup

This project uses Supabase Edge Functions to securely handle Riot API calls server-side.

## Prerequisites

1. [Supabase CLI](https://supabase.com/docs/guides/cli) installed
2. Supabase project created
3. Riot API key from [Riot Developer Portal](https://developer.riotgames.com/)

## Setup Steps

### 1. Install Supabase CLI
```bash
npm install -g supabase
```

### 2. Login to Supabase
```bash
supabase login
```

### 3. Link to your project
```bash
supabase link --project-ref YOUR_PROJECT_REF
```

### 4. Deploy the Edge Function
```bash
supabase functions deploy riot-api
```

### 5. Set Environment Variables
Go to your Supabase dashboard → Edge Functions → Settings and add:

- `RIOT_API_KEY`: Your Riot API key (SECURE, server-side only)
- `SUPABASE_URL`: Your Supabase project URL
- `SUPABASE_ANON_KEY`: Your Supabase anon key

### 6. Test the Function
```bash
supabase functions serve riot-api
```

## Security Benefits

✅ **Riot API key is secure** - Never exposed to the client  
✅ **Authentication required** - Only logged-in users can access  
✅ **Rate limiting** - Controlled on server-side  
✅ **CORS handled** - No browser restrictions  

## Usage

The frontend will automatically use the secure Edge Function instead of direct API calls when users are authenticated.

## Development

For local development:
```bash
supabase start
supabase functions serve riot-api
```

## Environment Variables

Frontend (.env):
```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_anon_key
VITE_RIOT_REGIONAL=americas
```

Edge Function (Supabase Dashboard):
```
RIOT_API_KEY=your_riot_api_key_secure
```