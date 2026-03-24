# Quick Setup Guide

## Get Your Gemini API Key

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the API key

## Configure the App

1. Open the `.env` file in the root directory
2. Replace `your_gemini_api_key_here` with your actual API key:

```env
GEMINI_API_KEY=AIzaSy...your_actual_key_here
DATABASE_URL="file:./dev.db"
```

## Run the App

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## What to Expect

1. **Welcome Screen**: Enter your name and select your class
2. **Subject Selection**: Choose Math → Pick a chapter → Select a topic
3. **Live Teaching**: Chat with AI teacher who explains concepts and asks questions
4. **Homework**: Get 5 personalized questions based on the lesson
5. **Report**: See your score, strengths, weaknesses, and recommendations

## Gemini Model Used

- **Model**: `gemini-1.5-flash`
- **Why**: Fast, cost-effective, and perfect for educational conversations
- **Cost**: Free tier includes 15 requests per minute, 1 million requests per day
- **Upgrade**: Can switch to `gemini-1.5-pro` for more complex reasoning by changing the model name in `lib/ai/client.ts`

## Troubleshooting

### "GEMINI_API_KEY is not set"
- Make sure you've added your API key to the `.env` file
- Restart the dev server after adding the key

### Database errors
- Run `npx prisma generate` and `npx prisma db push`

### Port already in use
- Stop other apps using port 3000, or run `npm run dev -- -p 3001` to use a different port

## Features

- ✅ Personalized teaching based on student performance
- ✅ Remembers weak and strong topics
- ✅ Adapts difficulty and pace
- ✅ Beautiful UI with animations
- ✅ Homework generation and evaluation
- ✅ Detailed progress reports
- ✅ SQLite database (no external DB needed)

Enjoy your AI Teacher! 🎓
