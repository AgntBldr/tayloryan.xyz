# Directive: Build Quest Portfolio

## Goal
Create a web-based portfolio item that simulates the "Quest" experience from Layer3.xyz.

## Inputs
1.  **CSV**: `Ref Docs/Quest/Quests - Taylor - Antigravity - Quests.csv`
2.  **Layer3 Access**: User credentials + 2FA (Taylor@klintmarketing.com).

## Tools
1.  **Scraper**: `execution/scrape_quests.py` (Playwright).
2.  **Web Framework**: Next.js (React).

## Process

### Step 1: Scrape Content (Limit 3)
1.  Run `execution/scrape_quests.py`.
2.  **Manual Action**: User logs in to Layer3 in the opened browser window.
3.  Script navigates to `https://app.layer3.xyz/builder/activations?publishedState=published`.
4.  Script matches quests from CSV (first 3).
5.  Script extracts:
    -   Quest Metadata (Title, Description, Activations).
    -   Quest Steps (The "Cards": Content, Links, Images).
6.  Save output to `quest_portfolio/data/quests.json`.

### Step 2: Build App
1.  Scaffold Next.js app.
2.  **Dashboard**: Grid of quests using data from CSV + JSON.
3.  **Simulation**:
    -   View individual quest.
    -   "Next" button navigation.
    -   Show content exactly as scraped (or close approximation).
    -   **Important**: Disable actual verification logic (just simulate success).

### Step 3: Verification
1.  Validate correct images are loaded.
2.  Validate text matches Layer3.
3.  Ensure UX is smooth.

## Output
-   A Next.js application source code.
-   `quests.json` database.
-   Downloaded assets.
