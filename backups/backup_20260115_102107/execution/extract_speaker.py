import pandas as pd
import json
import os
from datetime import datetime

# Configuration
BASE_DIR = r"C:\Users\tempv2\Desktop\PortfolioAgent"
INPUT_FILE = r"C:\Users\tempv2\Desktop\PortfolioAgent\Ref Docs\Work\Public Speaking\Public Speaker - Taylor Ryan.xlsx"
OUTPUT_FILE = os.path.join(BASE_DIR, "assets", "data_speaker.js")

def extract_speaker_data():
    if not os.path.exists(INPUT_FILE):
        print(f"File not found: {INPUT_FILE}")
        return

    try:
        # Load the sheet "Keynote Speaker " (Note the trailing space based on probe likely, or just fetch first sheet)
        # Based on previous probe output: "Keynote Speaker " seems irrelevant, let's look at the probe output again.
        # Probe output said: "Sheet names: ['Keynote Speaker ', 'Speaker Topics']" (Hypothetically - let's check the read_terminal output)
        
        # Actually, let's just load the first sheet to be safe, as it's the main verified one.
        xls = pd.ExcelFile(INPUT_FILE)
        item_sheet = xls.sheet_names[0] # "Keynote Speaker " likely has a space
        df = pd.read_excel(INPUT_FILE, sheet_name=item_sheet)
        
        # Normalize columns
        df.columns = [str(c).strip() for c in df.columns]
        
        # Expected columns based on probe: 
        # 'Events', 'Date', 'Type', 'Organizer', 'Topic', 'Duration', 'Link', 'Testimonial', 'Video', 'Deck'
        
        engagements = []
        print(f"Columns found: {df.columns.tolist()}")
        
        for idx, row in df.iterrows():
            # Loose matching for "Events" column
            title_col = next((c for c in df.columns if 'event' in c.lower()), None)
            title = row.get(title_col) if title_col else None
            
            if pd.isna(title) or str(title).strip() == "":
                # print(f"Skipping row {idx}: No title found in {title_col}")
                continue
                
            # Date Handling
            # Find column with 'date' or specific patterns like '(DD/MM/YY)'
            date_col = next((c for c in df.columns if 'date' in c.lower() or 'dd/mm/yy' in c.lower()), None)
            date_val = row.get(date_col)
            
            date_str = ""
            year = ""
            if isinstance(date_val, datetime):
                date_str = date_val.strftime("%B %d, %Y")
                year = str(date_val.year)
            elif not pd.isna(date_val):
                date_str = str(date_val)
                # Try to extract year using regex for 4 digits
                import re
                match = re.search(r'20\d{2}', date_str)
                if match:
                    year = match.group(0)
                else:
                    # Fallback for 2-digit years if needed, or keeping it simple
                    year = '20' + date_str[-2:] if len(date_str) > 2 and date_str[-2:].isdigit() else 'Unknown'
            
            # Other cols
            type_val = row.get('Event Type', '')
            org_val = row.get('Organization', '')
            topic_val = row.get('Description', '')
            
            # URL might be 'URL'
            link_val = row.get('URL', '')
            
            # Video might be 'Full Length Video' or 'Teaser Video'
            video_full = row.get('Full Length Video', '')
            video_teaser = row.get('Teaser Video', '')
            video_val = video_full if not pd.isna(video_full) else (video_teaser if not pd.isna(video_teaser) else "")

            item = {
                "title": str(title).strip(),
                "date": date_str,
                "year": year,
                "type": str(type_val).strip() if not pd.isna(type_val) else "",
                "organizer": str(org_val).strip() if not pd.isna(org_val) else "",
                "topic": str(topic_val).strip() if not pd.isna(topic_val) else "",
                "link": str(link_val) if not pd.isna(link_val) else "",
                "video": str(video_val) if not pd.isna(video_val) else ""
            }
            engagements.append(item)

        # Sort by date (newest first) - assuming input might not be sorted
        # Simple text sort for year as fallback
        # Sort by date (newest first)
        engagements.sort(key=lambda x: x.get('year', '0'), reverse=True)

        # Calculate Stats for Dashboard
        stats = {
            "total_events": len(engagements),
            "years": {},
            "types": {}
        }
        
        for e in engagements:
            y = e.get('year', 'Unknown')
            t = e.get('type') or 'Keynote' # Default to keynote if missing
            
            # Normalize type slightly
            t = t.split('/')[0].strip() # Take first if multiple
            if not t: t = "Other"
            
            stats["years"][y] = stats["years"].get(y, 0) + 1
            stats["types"][t] = stats["types"].get(t, 0) + 1

        js_content = f"window.SPEAKER_DATA = {json.dumps(engagements, indent=2)};\n"
        js_content += f"window.SPEAKER_STATS = {json.dumps(stats, indent=2)};"
        
        with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
            f.write(js_content)
            
        print(f"Successfully wrote {len(engagements)} engagements and stats to {OUTPUT_FILE}")

    except Exception as e:
        print(f"Error extracting speaker data: {e}")

if __name__ == "__main__":
    extract_speaker_data()
