import csv
import json
import os

CSV_PATH = r"C:\Users\tempv2\Desktop\PortfolioAgent\Ref Docs\Work\Podcasts\Podcast Portfolio - Taylor Ryan.csv"
OUTPUT_JS_PATH = r"C:\Users\tempv2\Desktop\PortfolioAgent\assets\js\podcast_data.js"

def parse_podcasts():
    podcasts = []
    
    with open(CSV_PATH, 'r', encoding='utf-8-sig') as f:
        reader = csv.DictReader(f)
        
        for row in reader:
            # Map columns to JS keys
            # CSV Headers: Podcast / Media, URL, Additional Media, Title, Description, Format, Industry, Tags, Organization, Organization URL, Organization Description, Theme, Live, Date, Format (Audio/Video), Media Type
            
            title = row.get('Title', '').strip()
            url = row.get('URL', '').strip()
            media = row.get('Podcast / Media', '').strip()
            
            # Skip empty rows (or section headers without titles/urls)
            if not title or not url:
                continue
                
            item = {
                "media": media,
                "title": title,
                "url": url,
                "description": row.get('Description', '').strip(),
                "category": row.get('Media Type', 'Podcast').strip() or "Podcast", # Default to Podcast if missing
                "industry": row.get('Industry', '').strip(),
                "date": row.get('Date', '').strip()
            }
            
            # Additional Media -> url2
            url2 = row.get('Additional Media', '').strip()
            if url2 and url2 != '-':
                 item["url2"] = url2
                 
            podcasts.append(item)
            
    # Generate JS Output
    js_content = f"const PODCAST_DATA = {json.dumps(podcasts, indent=2)};"
    
    with open(OUTPUT_JS_PATH, 'w', encoding='utf-8') as f:
        f.write(js_content)
        
    print(f"Successfully wrote {len(podcasts)} podcasts to {OUTPUT_JS_PATH}")

if __name__ == "__main__":
    parse_podcasts()
