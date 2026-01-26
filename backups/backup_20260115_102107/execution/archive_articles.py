import csv
import os
import re
from playwright.sync_api import sync_playwright

INPUT_FILE = r'Ref Docs\Writing Port Taylor - Antigravity - Writing.csv'
OUTPUT_DIR = r'Ref Docs\Archived_PDFs'
TEST_LIMIT = 1000

def clean_filename(title):
    # Take first 7 words
    words = title.split()[:7]
    base = " ".join(words)
    # Remove invalid characters
    clean = re.sub(r'[\\/*?:"<>|]', "", base)
    return f"{clean} - Taylor [PDF].pdf"

def process_articles():
    if not os.path.exists(OUTPUT_DIR):
        os.makedirs(OUTPUT_DIR)

    rows = []
    with open(INPUT_FILE, 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        fieldnames = reader.fieldnames
        rows = list(reader)

    processed_count = 0
    
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(
             user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
        )
        
        for row in rows:
            if processed_count >= TEST_LIMIT:
                break
                
            # Skip if already PDF saved or marked Dead
            if (row.get('PDF Saved', '').strip().lower() == 'yes' or 
                row.get('Live?', '').strip().lower() == 'dead'):
                continue
                
            url = row['URL']
            title = row['Article Title']
            print(f"Processing: {title} ({url})")
            
            page = context.new_page()
            try:
                # Check Live
                response = page.goto(url, wait_until='domcontentloaded', timeout=30000)
                if not response or response.status >= 400:
                    print(f"  -> Failed to load: {response.status if response else 'No Response'}")
                    row['Live?'] = 'Dead'
                    # Don't increment processed_count for dead links if we want 3 PDFs? 
                    # User said "only do 3 articles at a time". 
                    # I'll count this as an attempt.
                    processed_count += 1
                    page.close()
                    continue
                
                row['Live?'] = 'Live'
                
                # FORCE LIVE STATUS if previously dead but now trying again? 
                # Actually, the user wants us to retry the batch.
                
                # --- AGGRESSIVE COOKIE / POPUP HANDLING ---
                # 1. Try clicking common acceptance buttons
                cookie_selectors = [
                    "button[id*='cookie']", "button[class*='cookie']", "a[id*='cookie']",
                    "button[id*='accept']", "button[class*='accept']", 
                    "button[id*='agree']", "button[class*='agree']",
                    "div[class*='cookie'] button", "div[id*='cookie'] button",
                    "text=Accept", "text=Agree", "text=Allow", "text=Accept all cookies",
                    "text=I Agree", "text=Got it", "text=Okay"
                ]
                for sel in cookie_selectors:
                    try:
                        if page.is_visible(sel):
                            page.click(sel, timeout=500)
                            print(f"  -> Clicked cookie button: {sel}")
                            page.wait_for_timeout(500)
                    except Exception:
                        pass

                # 2. Nuke sticky/fixed elements that might be overlays (Cookie banners often fixed at bottom)
                # Removing elements with 'cookie', 'consent', 'popup', 'newsletter' in ID/Class and fixed/sticky pos
                page.evaluate("""
                    () => {
                        const elements = document.querySelectorAll('*');
                        for (let el of elements) {
                            const style = window.getComputedStyle(el);
                            if (style.position === 'fixed' || style.position === 'sticky') {
                                const text = (el.className + ' ' + el.id + ' ' + el.innerText).toLowerCase();
                                if (text.includes('cookie') || text.includes('consent') || text.includes('newsletter') || text.includes('subscribe')) {
                                    el.remove();
                                    console.log('Removed overlay:', el);
                                }
                            }
                        }
                    }
                """)
                # ------------------------------------------

                # Emulate screen media
                page.emulate_media(media="screen")
                
                # Scroll to bottom to trigger lazy loading
                page.evaluate("window.scrollTo(0, document.body.scrollHeight)")
                page.wait_for_timeout(2000) 
                
                # Scroll back to top
                page.evaluate("window.scrollTo(0, 0)")
                page.wait_for_timeout(1000)

                # Get exact page height
                # Try to get the height of the main content if possible, otherwise body
                # Reducing whitespace: ensure we take the max of body or documentElement but NO buffer
                width = 1200
                height = page.evaluate("Math.max(document.body.scrollHeight, document.documentElement.scrollHeight)")
                
                # PDF
                filename = clean_filename(title)
                filepath = os.path.join(OUTPUT_DIR, filename)
                
                # Save PDF
                page.pdf(
                    path=filepath,
                    width=f"{width}px",
                    height=f"{height}px",
                    print_background=True,
                    margin={"top": "0", "bottom": "0", "left": "0", "right": "0"}
                )
                print(f"  -> Saved PDF: {filename}")
                
                row['PDF Saved'] = 'Yes'
                
                processed_count += 1
                
            except Exception as e:
                print(f"  -> Error: {e}")
                row['Live?'] = 'Error'
            finally:
                page.close()

        browser.close()

    # Write back
    with open(INPUT_FILE, 'w', newline='', encoding='utf-8') as f:
        # Verify headers match
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(rows)
    
    print("\nBatch complete.")

if __name__ == "__main__":
    process_articles()
