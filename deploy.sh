#!/bin/bash

echo "🚀 AI Teacher Deployment Helper"
echo "================================"
echo ""

# Check if git remote exists
if git remote | grep -q "origin"; then
  echo "✓ Git remote 'origin' already exists"
  git remote -v
else
  echo "📝 Please create a GitHub repository first:"
  echo "   1. Go to https://github.com/new"
  echo "   2. Name it: ai-teacher"
  echo "   3. Create the repository"
  echo ""
  read -p "Enter your GitHub repository URL: " repo_url
  git remote add origin "$repo_url"
  echo "✓ Remote added!"
fi

echo ""
echo "📤 Pushing to GitHub..."
git branch -M main
git push -u origin main

echo ""
echo "✓ Code pushed to GitHub!"
echo ""
echo "📋 Next Steps:"
echo "1. Go to https://vercel.com/new"
echo "2. Import your GitHub repository"
echo "3. Add environment variables:"
echo "   - GEMINI_API_KEY: AIzaSyClYKtHFM299pUJtVSjtqU94ARB9e11-DY"
echo "   - DATABASE_URL: (your PostgreSQL connection string)"
echo "4. Deploy!"
echo ""
echo "📖 Full guide: See GITHUB_AND_VERCEL_DEPLOY.md"
