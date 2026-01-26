import pandas as pd
import json
import os

# Configuration
BASE_DIR = r"C:\Users\tempv2\Desktop\PortfolioAgent"
INPUT_FILE = r"C:\Users\tempv2\Desktop\PortfolioAgent\Ref Docs\Work\Public Speaking\Speaker Topics.xlsx"
OUTPUT_FILE = os.path.join(BASE_DIR, "assets", "data_speaker_topics.js")

def extract_topics():
    if not os.path.exists(INPUT_FILE):
        print(f"File not found: {INPUT_FILE}")
        return

    try:
        xls = pd.ExcelFile(INPUT_FILE)
        # Sheet name is 'Speaker Topics' based on probe
        df = pd.read_excel(xls, sheet_name='Speaker Topics')
        
        # Normalize columns
        df.columns = [str(c).strip() for c in df.columns]
        
        topics = []
        
        for idx, row in df.iterrows():
            title = row.get('Title')
            if pd.isna(title) or str(title).strip() == "":
                continue
            
            # Extract fields
            item = {
                "title": str(title).strip(),
                "focus": str(row.get('Topic Focus', '')).strip() if not pd.isna(row.get('Topic Focus')) else "",
                "description": str(row.get('Description', '')).strip() if not pd.isna(row.get('Description')) else "",
                "theme": str(row.get('Theme', '')).strip() if not pd.isna(row.get('Theme')) else "",
                "elements": str(row.get('Elements', '')).strip() if not pd.isna(row.get('Elements')) else "",
                "niche": str(row.get('Niche', '')).strip() if not pd.isna(row.get('Niche')) else "",
                "tags": [t.strip() for t in str(row.get('Tags', '')).split(',')] if not pd.isna(row.get('Tags')) else []
            }
            topics.append(item)
        
        js_content = f"window.SPEAKER_TOPICS = {json.dumps(topics, indent=2)};"
        
        with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
            f.write(js_content)
            
        print(f"Successfully wrote {len(topics)} topics to {OUTPUT_FILE}")

    except Exception as e:
        print(f"Error extracting topics: {e}")

if __name__ == "__main__":
    extract_topics()
