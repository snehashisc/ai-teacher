# Migration from OpenAI to Google Gemini

## Summary of Changes

The application has been successfully migrated from OpenAI GPT to Google Gemini AI.

## Files Modified

### 1. `package.json`
- **Removed**: `openai` package
- **Added**: `@google/generative-ai` package

### 2. `lib/ai/client.ts`
- Replaced OpenAI client with Google Generative AI client
- Updated function `getOpenAIClient()` → `getGeminiClient()`
- Implemented message format conversion for Gemini's chat API
- Updated `chat()` function to use Gemini's API
- Updated `chatStream()` function for streaming responses
- Default model changed from `gpt-4o-mini` to `gemini-1.5-flash`

### 3. `.env` and `.env.example`
- Changed environment variable from `OPENAI_API_KEY` to `GEMINI_API_KEY`

### 4. `README.md`
- Updated tech stack section to mention Gemini 1.5 Flash
- Updated prerequisites to mention Gemini API key
- Updated setup instructions with Gemini API key link
- Updated AI system description

### 5. New File: `SETUP.md`
- Created quick setup guide specifically for Gemini
- Includes link to get Gemini API key
- Troubleshooting tips

## Key Differences

### API Structure
- **OpenAI**: Uses a simple messages array with roles (system, user, assistant)
- **Gemini**: Separates system instructions from conversation history
  - System messages become `systemInstruction`
  - Conversation is split into `history` and current `message`
  - Roles are mapped: `assistant` → `model`, `user` → `user`

### Model Names
- **OpenAI**: `gpt-4o-mini`, `gpt-4`, etc.
- **Gemini**: `gemini-1.5-flash`, `gemini-1.5-pro`, `gemini-1.0-pro`

### Configuration
- **OpenAI**: `max_tokens`, `temperature`
- **Gemini**: `maxOutputTokens`, `temperature` (similar but in `generationConfig`)

## Benefits of Gemini

1. **Cost-Effective**: Free tier is generous (15 RPM, 1M requests/day)
2. **Fast**: Gemini 1.5 Flash is optimized for speed
3. **Quality**: Comparable quality to GPT-4o-mini for educational tasks
4. **Multimodal**: Can easily add image support later
5. **Long Context**: Supports up to 1M tokens context window

## How to Get API Key

1. Visit: https://makersuite.google.com/app/apikey
2. Sign in with Google account
3. Click "Create API Key"
4. Copy and paste into `.env` file

## Switching Models

To use a more powerful model, edit `lib/ai/client.ts`:

```typescript
// Change this line in both chat() and chatStream() functions:
const modelName = options?.model || 'gemini-1.5-pro'; // Instead of 'gemini-1.5-flash'
```

Available models:
- `gemini-1.5-flash` - Fast, cost-effective (recommended for MVP)
- `gemini-1.5-pro` - More capable, better reasoning
- `gemini-1.0-pro` - Older but stable

## Testing

All existing functionality remains the same:
- ✅ Teaching mode with conversational AI
- ✅ Answer evaluation
- ✅ Homework generation
- ✅ Student progress tracking
- ✅ Personalized recommendations

No changes needed to any other parts of the application!
