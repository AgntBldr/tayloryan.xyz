import os
import re
from urllib.parse import unquote

BASE_DIR = r"C:\Users\tempv2\Desktop\PortfolioAgent"

def verify_links():
    html_files = [f for f in os.listdir(BASE_DIR) if f.endswith('.html')]
    errors = []
    checked_count = 0

    print(f"Scanning {len(html_files)} HTML files for broken internal links...\n")

    for file in html_files:
        file_path = os.path.join(BASE_DIR, file)
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()

        # Find all hrefs
        # This regex is simple and might miss some edge cases but works for standard static sites
        links = re.findall(r'href=["\'](.*?)["\']', content)

        for link in links:
            # Skip external links, anchors, and scripts
            if link.startswith(('http', 'https', '#', 'mailto:', 'tel:', 'javascript:')):
                continue
            
            # Remove query params or anchors for file checking
            clean_link = link.split('#')[0].split('?')[0]
            if not clean_link:
                continue

            checked_count += 1
            
            # Check if file exists
            target_path = os.path.join(BASE_DIR, unquote(clean_link))
            if not os.path.exists(target_path):
                # Try relative resolution if it starts with ../ (though our site is flat mostly)
                # But wait, our site IS flat in the root.
                # Let's check if it's in assets
                if clean_link.startswith('assets/'):
                     pass # handled by os.path.join(BASE_DIR, clean_link) correctly
                
                if not os.path.exists(target_path):
                    errors.append(f"[{file}] Broken Link: {link}")

    print(f"Checked {checked_count} internal links.")
    
    if errors:
        print("\n❌ Found Broken Links:")
        for err in errors:
            print(err)
    else:
        print("\n✅ All internal links are valid!")

if __name__ == "__main__":
    verify_links()
