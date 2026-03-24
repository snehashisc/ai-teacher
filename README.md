# Full Stack AI Teacher

A personalized, syllabus-aligned, continuous AI teacher that remembers students and adapts to their learning style.

## Features

### 1. Remembers the Student
- Tracks weak topics and areas of difficulty
- Identifies strong topics and areas of mastery
- Adapts teaching pace based on student performance
- Maintains learning history across sessions

### 2. Teaches Like a Human Tutor
- Explains concepts step-by-step with real-world examples
- Asks questions to check understanding
- Provides homework assignments with mixed difficulty
- Evaluates answers and provides detailed feedback
- Guides students to discover answers rather than giving them directly

### 3. Closed Feedback Loop
- Student answers questions during teaching
- AI checks and evaluates responses
- AI adapts difficulty and pace based on performance
- Tracks progress over time

## Tech Stack

- **Frontend**: Next.js 14 (App Router), React, TypeScript, Tailwind CSS
- **State Management**: Zustand
- **Database**: Prisma + SQLite (easily upgradeable to PostgreSQL)
- **AI**: Google Gemini 1.5 Flash
- **Animations**: Framer Motion + Custom CSS
- **Icons**: Lucide React

## Project Structure

```
├── app/
│   ├── api/              # API routes
│   │   ├── student/      # Student management
│   │   ├── session/      # Session management
│   │   ├── tutor/        # AI tutor endpoints
│   │   ├── homework/     # Homework generation & submission
│   │   └── report/       # Student reports
│   ├── globals.css       # Global styles
│   ├── layout.tsx        # Root layout
│   └── page.tsx          # Main page
├── components/           # React components
│   ├── StudentSetup.tsx
│   ├── SubjectSelection.tsx
│   ├── TeachingMode.tsx
│   ├── HomeworkMode.tsx
│   ├── ReportMode.tsx
│   └── ...
├── lib/
│   ├── ai/              # AI logic
│   │   ├── client.ts    # Gemini AI client
│   │   ├── prompts.ts   # System prompts
│   │   ├── tutor.ts     # AI tutor class
│   │   └── homework.ts  # Homework generation
│   ├── curriculum/      # Curriculum data
│   │   ├── types.ts
│   │   ├── data/        # Subject data
│   │   └── index.ts
│   ├── db/              # Database utilities
│   │   ├── client.ts
│   │   └── student.ts
│   └── store/           # State management
│       └── session-store.ts
└── prisma/
    └── schema.prisma    # Database schema
```

## Getting Started

### Prerequisites

- Node.js 18+ (Note: The project was created with Node 18, but Next.js 16+ requires Node 20+. Consider upgrading Node.js)
- npm or yarn
- Google Gemini API key

### Installation

1. Clone the repository:
```bash
cd VirtualTutor
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

Edit `.env` and add your Google Gemini API key:
```
GEMINI_API_KEY=your_gemini_api_key_here
DATABASE_URL="file:./dev.db"
```

Get your free Gemini API key from: https://makersuite.google.com/app/apikey

4. Initialize the database:
```bash
npx prisma generate
npx prisma db push
```

5. Run the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage Flow

### 1. Student Setup
- Enter name and select class
- System creates or retrieves student profile

### 2. Subject Selection
- Choose Subject (e.g., Mathematics)
- Choose Chapter (e.g., Fractions)
- Choose Topic (e.g., Addition of Fractions)

### 3. Teaching Mode (Live Class Experience)
- AI teacher introduces the topic
- Explains concepts with examples
- Asks questions to check understanding
- Provides feedback on student answers
- Adapts based on student responses
- Beautiful chat-like interface with:
  - Teacher thinking indicator
  - Encouragement messages
  - Visual feedback (correct/incorrect)

### 4. Homework Mode
- AI generates 5-10 questions based on the lesson
- Mixed difficulty levels
- Hints available for each question
- Progress bar showing completion

### 5. Report Mode
- Overall score and accuracy
- Detailed feedback for each question
- Strengths and weaknesses identified
- Personalized recommendations
- Progress tracked in database

## Key Differentiators

### UX (The Moat)
Unlike typical chat interfaces, this app provides:

1. **Live Class Feel**
   - Teacher speaking with personality
   - Student responding in conversation
   - Progress indicators
   - Visual feedback

2. **Encouragement System**
   - "Good attempt, but check your denominator"
   - "You're on the right track!"
   - "Let's think about this together"

3. **Teacher Thinking Animation**
   - Shows AI is processing
   - Creates anticipation
   - Makes interaction feel human

4. **Beautiful Design**
   - Gradient backgrounds
   - Smooth animations
   - Color-coded feedback
   - Responsive design

## Database Schema

### Student
- Stores student information
- Links to sessions, progress, and weak topics

### Session
- Tracks learning sessions
- Contains interactions and homework

### Progress
- Tracks accuracy per topic
- Counts attempts
- Identifies mastery

### WeakTopic
- Identifies struggling areas
- Counts errors
- Prioritizes review

## AI System

### Teacher Prompts (Powered by Gemini)
- Personalized based on student context
- Adapts to weak/strong topics
- Adjusts pace (slow/medium/fast)
- Encourages discovery learning
- Uses Gemini 1.5 Flash for fast, cost-effective responses

### Answer Evaluation
- Checks correctness
- Identifies misconceptions
- Provides specific feedback
- Offers hints, not answers

### Homework Generation
- Syllabus-aligned questions
- Mixed difficulty
- Focuses on weak areas
- Age-appropriate language

## Extending the Project

### Adding New Subjects
1. Create new subject file in `lib/curriculum/data/`
2. Follow the structure of `class6-math.ts`
3. Add to `curriculumData` in `lib/curriculum/index.ts`

### Adding New Classes
1. Create curriculum data for the class
2. Update the class selection dropdown in `StudentSetup.tsx`

### Upgrading Database
To use PostgreSQL instead of SQLite:
1. Update `DATABASE_URL` in `.env`
2. Change `provider` in `prisma/schema.prisma` to `postgresql`
3. Run `npx prisma db push`

### Adding Voice
Integrate text-to-speech for teacher messages:
```typescript
// In TeacherMessage.tsx
const speak = (text: string) => {
  const utterance = new SpeechSynthesisUtterance(text);
  speechSynthesis.speak(utterance);
};
```

## Performance Optimization

- API routes use streaming where possible
- Database queries are optimized with Prisma
- State management with Zustand (lightweight)
- Images and assets can be optimized with Next.js Image component

## Future Enhancements

1. **Voice Input/Output**
   - Speech-to-text for student answers
   - Text-to-speech for teacher

2. **Video Explanations**
   - Generate or link to video content
   - Visual diagrams and animations

3. **Gamification**
   - Points and badges
   - Leaderboards
   - Streaks and achievements

4. **Parent Dashboard**
   - Progress tracking
   - Weekly reports
   - Areas of concern

5. **Multi-language Support**
   - Regional language support
   - Translation of content

6. **Offline Mode**
   - Download lessons
   - Sync when online

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - feel free to use this project for your own purposes.

## Support

For issues or questions, please open an issue on GitHub.
