#!/bin/bash
set -e

echo "==================================="
echo "  Downtown Irwin - Publish to GitHub"
echo "==================================="
echo ""

# Check if we're in a git repository
if ! git rev-parse --is-inside-work-tree > /dev/null 2>&1; then
    echo "Error: Not in a git repository"
    exit 1
fi

# Check if remote origin exists
if ! git remote get-url origin > /dev/null 2>&1; then
    echo "Error: No remote 'origin' configured"
    echo "Run: git remote add origin <your-github-repo-url>"
    exit 1
fi

echo "1. Running type check..."
npm run check || {
    echo "Error: TypeScript check failed"
    exit 1
}

echo ""
echo "2. Building site..."
npm run build || {
    echo "Error: Build failed"
    exit 1
}

echo ""
echo "3. Creating 404.html for client-side routing..."
cp dist/index.html dist/404.html 2>/dev/null || echo "Note: dist/index.html not found, skipping 404.html"

echo ""
echo "4. Checking git status..."

# Stage all changes
git add -A

# Check if there are changes to commit
if git diff --cached --quiet; then
    echo "No changes to publish. Site is already up to date."
    exit 0
fi

# Generate commit message with timestamp
TIMESTAMP=$(date +"%Y-%m-%d %H:%M:%S")
COMMIT_MSG="Publish site - $TIMESTAMP"

echo ""
echo "5. Committing changes..."
git commit -m "$COMMIT_MSG"

echo ""
echo "6. Pushing to GitHub..."
# Use GIT_URL secret if available, otherwise try default push
if [ -n "$GIT_URL" ]; then
    git push "$GIT_URL" main
else
    git push origin main
fi

echo ""
echo "==================================="
echo "  Published successfully!"
echo "==================================="
echo ""
echo "GitHub Actions will now deploy to GitHub Pages."
echo "Your site will be live at: https://downtownirwin.github.io/downtown-irwin/"
echo ""
