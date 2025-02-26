# GitHub Guide for Click & Ship Tycoon

This document provides comprehensive instructions for managing the Click & Ship Tycoon project using Git and GitHub.

## Table of Contents

1. [Setting Up a Git Repository](#setting-up-a-git-repository)
2. [Pushing Code to GitHub](#pushing-code-to-github)
3. [Making and Pushing Updates](#making-and-pushing-updates)
4. [Working with Branches](#working-with-branches)
5. [Advanced Git Operations](#advanced-git-operations)
6. [Best Practices](#best-practices)

## Setting Up a Git Repository

### Initializing a New Repository

If you're starting from scratch:

1. **Initialize a Git repository**:
   ```bash
   cd /path/to/click-ship-tycoon
   git init
   ```

2. **Add a .gitignore file**:
   The project already has a .gitignore file, but ensure it includes:
   ```
   # Node.js
   node_modules/
   npm-debug.log
   
   # Python
   __pycache__/
   *.py[cod]
   *$py.class
   *.so
   .Python
   env/
   venv/
   ENV/
   
   # Build files
   frontend/dist/
   
   # Environment variables
   .env
   .env.local
   .env.development.local
   .env.test.local
   .env.production.local
   
   # Docker
   .dockerignore
   
   # IDE files
   .idea/
   .vscode/
   *.swp
   *.swo
   ```

3. **Make your first commit**:
   ```bash
   git add .
   git commit -m "Initial commit"
   ```

### Creating a GitHub Repository

1. **Go to GitHub** and log in to your account.

2. **Click the "+" icon** in the top-right corner and select "New repository".

3. **Fill in the repository details**:
   - Repository name: `click-ship-tycoon`
   - Description: "A mobile web game where players manage an order fulfillment business"
   - Visibility: Choose either Public or Private
   - Initialize with: Do NOT initialize with README, .gitignore, or license (since we already have these files)

4. **Click "Create repository"**.

5. **Connect your local repository to GitHub**:
   ```bash
   git remote add origin https://github.com/yourusername/click-ship-tycoon.git
   ```

## Pushing Code to GitHub

### First Push

After setting up your repository and making your initial commit:

1. **Push your code to GitHub**:
   ```bash
   git push -u origin main
   ```
   
   Note: If your default branch is named `master` instead of `main`, use:
   ```bash
   git push -u origin master
   ```

2. **Verify the push**:
   - Go to your GitHub repository in a web browser
   - You should see all your files and the commit message

### Authentication

GitHub now requires token-based authentication for command-line operations:

1. **Generate a Personal Access Token (PAT)**:
   - Go to GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
   - Click "Generate new token" → "Generate new token (classic)"
   - Give it a name, set an expiration, and select the necessary scopes (at minimum: `repo`)
   - Click "Generate token" and copy the token

2. **Use the token for authentication**:
   - When pushing, if prompted for a password, use the token instead
   - Or configure Git to use the token:
     ```bash
     git remote set-url origin https://YOUR_USERNAME:YOUR_TOKEN@github.com/yourusername/click-ship-tycoon.git
     ```

## Making and Pushing Updates

### Daily Workflow

1. **Check repository status**:
   ```bash
   git status
   ```

2. **Pull latest changes** (if collaborating with others):
   ```bash
   git pull origin main
   ```

3. **Make your changes** to the codebase.

4. **Stage your changes**:
   ```bash
   # Stage specific files
   git add file1.js file2.js
   
   # Stage all changes
   git add .
   ```

5. **Commit your changes**:
   ```bash
   git commit -m "Brief description of changes"
   ```

6. **Push your changes**:
   ```bash
   git push origin main
   ```

### Writing Good Commit Messages

Follow these guidelines for clear commit messages:

- Use the imperative mood ("Add feature" not "Added feature")
- Keep the first line under 50 characters
- Provide more details in the commit body if needed (separated by a blank line)
- Reference issue numbers if applicable (e.g., "Fix #123: Resolve CORS issue")

Example:
```bash
git commit -m "Add auto-build technology feature" -m "This implements the auto-build technology that automatically starts building a new product when the previous one is completed."
```

## Working with Branches

Branches allow you to develop features, fix bugs, or experiment without affecting the main codebase.

### Creating and Using Branches

1. **Create a new branch**:
   ```bash
   git checkout -b feature/auto-build
   ```

2. **Make changes** and commit them to your branch:
   ```bash
   git add .
   git commit -m "Implement auto-build feature"
   ```

3. **Push the branch to GitHub**:
   ```bash
   git push -u origin feature/auto-build
   ```

4. **Switch between branches**:
   ```bash
   # Switch to main branch
   git checkout main
   
   # Switch back to feature branch
   git checkout feature/auto-build
   ```

### Branch Naming Conventions

Follow these conventions for branch names:
- `feature/feature-name` - For new features
- `bugfix/issue-description` - For bug fixes
- `hotfix/critical-issue` - For urgent fixes to production
- `release/version-number` - For release preparation

### Merging Branches

#### Via Pull Request (Recommended)

1. **Push your branch** to GitHub:
   ```bash
   git push origin feature/auto-build
   ```

2. **Create a Pull Request**:
   - Go to your GitHub repository
   - Click "Pull requests" → "New pull request"
   - Select your branch as the "compare" branch
   - Click "Create pull request"
   - Add a title and description
   - Request reviews if needed
   - Click "Create pull request"

3. **Review and merge** the Pull Request on GitHub.

4. **Update your local main branch**:
   ```bash
   git checkout main
   git pull origin main
   ```

#### Via Command Line

1. **Switch to the target branch**:
   ```bash
   git checkout main
   ```

2. **Merge your feature branch**:
   ```bash
   git merge feature/auto-build
   ```

3. **Push the changes**:
   ```bash
   git push origin main
   ```

### Handling Merge Conflicts

If Git can't automatically merge changes, you'll need to resolve conflicts:

1. **Identify conflicting files**:
   ```bash
   git status
   ```

2. **Open each conflicting file** and look for conflict markers (`<<<<<<<`, `=======`, `>>>>>>>`).

3. **Edit the files** to resolve conflicts, removing the conflict markers.

4. **Stage the resolved files**:
   ```bash
   git add file1.js file2.js
   ```

5. **Complete the merge**:
   ```bash
   git commit
   ```

## Advanced Git Operations

### Stashing Changes

Temporarily store changes without committing:

```bash
# Stash changes
git stash save "Work in progress on auto-build feature"

# List stashes
git stash list

# Apply the most recent stash
git stash apply

# Apply a specific stash
git stash apply stash@{1}

# Remove a stash after applying
git stash drop stash@{1}

# Apply and remove in one command
git stash pop
```

### Viewing History

```bash
# View commit history
git log

# View compact history
git log --oneline

# View history with branch graph
git log --graph --oneline --all

# View changes in a specific commit
git show <commit-hash>
```

### Undoing Changes

```bash
# Discard changes in working directory
git checkout -- file.js

# Unstage a file
git reset HEAD file.js

# Amend the last commit
git commit --amend -m "New commit message"

# Revert a commit (creates a new commit that undoes changes)
git revert <commit-hash>

# Reset to a previous commit (caution: destructive)
git reset --hard <commit-hash>
```

### Tagging Releases

```bash
# Create a lightweight tag
git tag v1.0.0

# Create an annotated tag
git tag -a v1.0.0 -m "Version 1.0.0 release"

# Push tags to GitHub
git push origin --tags

# List tags
git tag

# Delete a tag
git tag -d v1.0.0
git push origin :refs/tags/v1.0.0  # Delete from remote
```

## Best Practices

### Collaboration Workflow

1. **Pull before you push** to avoid unnecessary merge conflicts.
2. **Use branches** for all new features and bug fixes.
3. **Review code** before merging to main.
4. **Keep commits focused** on single logical changes.
5. **Write descriptive commit messages**.

### Project-Specific Guidelines

For the Click & Ship Tycoon project:

1. **Feature branches** should be created for each new game feature.
2. **Test locally** before pushing changes.
3. **Update documentation** when changing APIs or game mechanics.
4. **Coordinate database migrations** with team members.
5. **Tag releases** using semantic versioning (e.g., v1.0.0).

### Git Hooks

Consider setting up Git hooks for automated tasks:

1. **pre-commit**: Run linters and tests before committing
2. **pre-push**: Run more comprehensive tests before pushing

Example `.git/hooks/pre-commit` script:
```bash
#!/bin/sh
cd frontend && npm run lint
```

Make the script executable:
```bash
chmod +x .git/hooks/pre-commit
```

### GitHub Features to Leverage

1. **Issues**: Track bugs, features, and tasks
2. **Projects**: Organize work with Kanban boards
3. **Actions**: Set up CI/CD workflows (already configured)
4. **Discussions**: Collaborate on ideas and announcements
5. **Wiki**: Document project architecture and processes