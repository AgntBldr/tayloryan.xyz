import pandas as pd
import json
import os
from datetime import datetime

# Configuration
BASE_DIR = r"C:\Users\tempv2\Desktop\PortfolioAgent"
INPUT_FILE = r"C:\Users\tempv2\Desktop\PortfolioAgent\Ref Docs\Work\Podcasts\Podcast Portfolio - Taylor Ryan.xlsx"
OUTPUT_FILE = os.path.join(BASE_DIR, "assets", "data_podcasts.js")

def extract_podcast_data():
    if not os.path.exists(INPUT_FILE):
        print(f"File not found: {INPUT_FILE}")
        return

    try:
        # Sheet name had a leading/trailing space in probe: " Podcast Portfolio - Taylor Rya" (and typo "Rya")
        xls = pd.ExcelFile(INPUT_FILE)
        sheet_name = xls.sheet_names[0]
        
        df = pd.read_excel(INPUT_FILE, sheet_name=sheet_name)
        df.columns = [str(c).strip() for c in df.columns]
        
        # Columns: ['Podcast / Media', 'URL', 'Title', 'Description', 'Notes', 'Industry', 'Tags', 'Organization URL', 'Primary Theme', 'Live?', 'Date', 'Theme']
        
        podcasts = []
        
        for idx, row in df.iterrows():
            media_name = row.get('Podcast / Media')
            # Column A is 'Podcast / Media', but user said "Display each podcast (Column A) and the title"
            # Some rows might be headers (like "Podcasts" in row 0 of probe). 
            # Filter valid rows: Must have Title
            title = row.get('Title')
            
            if pd.isna(title) or str(title).strip() == "":
                continue
                
            # Date
            date_val = row.get('Date')
            date_str = ""
            if pd.isna(date_val):
                 pass
            elif isinstance(date_val, datetime):
                date_str = date_val.strftime("%B %d, %Y")
            else:
                 # Fallback
                 date_str = str(date_val).split(" ")[0]
            
            item = {
                "media": str(media_name).strip() if not pd.isna(media_name) else "Podcast",
                "title": str(title).strip(),
                "url": str(row.get('URL', '')) if not pd.isna(row.get('URL')) else "",
                "description": str(row.get('Description', '')) if not pd.isna(row.get('Description')) else "",
                "category": str(row.get('Theme', '')).strip() if not pd.isna(row.get('Theme')) else "Other Appearances",
                "industry": str(row.get('Industry', '')).strip() if not pd.isna(row.get('Industry')) else "",
                "date": date_str
            }
             # Map category names if needed to match: Podcasts, Linkedin Live, Other Appearances, Slides
            # Probe showed 'Theme' column has "Podcasts"
            
            podcasts.append(item)

        js_content = f"const PODCAST_DATA = {json.dumps(podcasts, indent=2)};"
        
        with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
            f.write(js_content)
            
        print(f"Successfully wrote {len(podcasts)} podcasts to {OUTPUT_FILE}")

    except Exception as e:
        print(f"Error extracting podcast data: {e}")

if __name__ == "__main__":
    extract_podcast_data()
