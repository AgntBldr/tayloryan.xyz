import os
import csv
import json
import time
import re
from playwright.sync_api import sync_playwright

# Configuration
INPUT_CSV = r"Ref Docs\Quests - Taylor - Antigravity - Quests.csv"
OUTPUT_DIR = r"quest_portfolio_data"
IMAGES_DIR = os.path.join(OUTPUT_DIR, "images")
DATA_FILE = os.path.join(OUTPUT_DIR, "quests.json")
LIMIT = 3

def clean_filename(text):
    return re.sub(r'[\\/*?:"<>|]', "", text)[:50].strip()

def ensure_dirs():
    if not os.path.exists(OUTPUT_DIR):
        os.makedirs(OUTPUT_DIR)
    if not os.path.exists(IMAGES_DIR):
        os.makedirs(IMAGES_DIR)

def scrape_quests():
    ensure_dirs()
    
    # Read CSV
    target_quests = []
    with open(INPUT_CSV, 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        for row in reader:
            if len(target_quests) >= LIMIT:
                break
            # Column E is 'Name of Quest' based on user description, 
            # checking CSV header it corresponds to 'Name of Quest'
            quest_name = row.get('Name of Quest', '').strip()
            if quest_name:
                target_quests.append(row)

    print(f"Loaded {len(target_quests)} quests to scrape.")

    with sync_playwright() as p:
        # HEADED mode for user interaction
        browser = p.chromium.launch(headless=False) 
        context = browser.new_context()
        page = context.new_page()

        # 1. Login Step
        print("\n" + "="*50)
        print("PLEASE LOG IN TO LAYER3 IN THE BROWSER WINDOW.")
        print("Navigate to: https://app.layer3.xyz/builder/dashboard")
        print("Waiting for you to reach the dashboard...")
        print("="*50 + "\n")
        
        page.goto("https://app.layer3.xyz/builder/dashboard", timeout=0)
        
        # Wait until we are redirected to dashboard or user signals readiness
        # We'll wait for a specific element that appears on dashboard, or just a long wait + checks
        try:
            page.wait_for_url("**/builder/**", timeout=0) # Wait effectively forever until user logs in
            print("Detected generic builder URL. Waiting a bit more for dashboard load...")
            page.wait_for_timeout(5000)
        except:
            print("Timed out waiting for login.")
            return

        quests_data = []

        # 2. Interactive Scraping Loop
        print("\n" + "="*50)
        print("INTERACTIVE MODE")
        print("1. Log in to Layer3.")
        print("2. Navigate to the 'Activations' tab.")
        print("3. Click and OPEN the Quest you want to scrape (enter the Editor).")
        print(f"4. The script will detect the editor and scrape data. (Goal: {LIMIT} quests)")
        print("="*50 + "\n")

        scraped_count = 0
        visited_urls = set()

        while scraped_count < LIMIT:
            try:
                # Poll current URL
                current_url = page.url
                
                # Check if we are in an editor (URL usually contains ID, not just 'activations')
                # Pattern guess: .../builder/activations/<UUID> or .../builder/quests/<UUID>
                # But NOT just .../builder/activations
                
                if ("/builder/activations/" in current_url or "/builder/quests/" in current_url) and current_url not in visited_urls and len(current_url.split('/')) > 5:
                    
                    print(f"Detected Quest Editor: {current_url}")
                    print("Waiting for content to load...")
                    page.wait_for_load_state('networkidle')
                    page.wait_for_timeout(3000)
                    
                    # Check if 'General' tab or similar is visible to ensure we have data
                    # Just scrape whatever is visible
                    
                    # Try to get Title
                    # Heuristic: The header usually has the Quest Name
                    title = page.title() # fallback
                    try:
                        # Try to find an h1 or high-level heading specific to the editor
                        title = page.locator("h1").first.inner_text()
                    except:
                        pass
                        
                    print(f"Scraping '{title}'...")
                    
                    quest_details = {
                        "url": current_url,
                        "title": title,
                        "timestamp": time.time(),
                        "steps": []
                    }
                    
                    # Screenshot Editor
                    clean_name = clean_filename(title)
                    shot_name = f"{clean_name}_{int(time.time())}.png"
                    shot_path = os.path.join(IMAGES_DIR, shot_name)
                    page.screenshot(path=shot_path)
                    quest_details['image'] = shot_name
                    
                    # Dump Text
                    quest_details['full_text'] = page.inner_text("body")
                    
                    # Add to list
                    quests_data.append(quest_details)
                    scraped_count += 1
                    visited_urls.add(current_url)
                    
                    print(f"SUCCESS! Scraped [{scraped_count}/{LIMIT}]")
                    print("Please navigate to the NEXT quest (Go back to dashboard and open another one).")
                    
                    # Save immediately
                    with open(DATA_FILE, 'w', encoding='utf-8') as f:
                        json.dump(quests_data, f, indent=2)

                else:
                    # Just wait and poll
                    time.sleep(2)
                    
            except Exception as e:
                print(f"Error checking page: {e}")
                time.sleep(2)
                
        print("\nAll 3 quests scraped! Closing browser.")
        browser.close()
        
if __name__ == "__main__":
    scrape_quests()
