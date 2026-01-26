import pandas as pd
import json
import os
from datetime import datetime

# Configuration
BASE_DIR = r"C:\Users\tempv2\Desktop\PortfolioAgent"
INPUT_FILE = r"C:\Users\tempv2\Desktop\PortfolioAgent\Ref Docs\Work\Writing\Writing - All Articles.xlsx"
OUTPUT_FILE = os.path.join(BASE_DIR, "assets", "data_writing.js")

def extract_writing_data():
    if not os.path.exists(INPUT_FILE):
        print(f"File not found: {INPUT_FILE}")
        return

    try:
        df = pd.read_excel(INPUT_FILE, sheet_name="Writing Portfolio - Taylor Ryan")
        df.columns = [str(c).strip() for c in df.columns]
        
        # Columns: ['Article Title', 'URL', 'Description', 'Article Format', 'Primary Theme', 'Industry', 'Tags', 'Organization', 'Organization URL', 'Status', 'Date', 'PDF Saved', 'Contributor']
        
        articles = []
        
        for idx, row in df.iterrows():
            title = row.get('Article Title')
            if pd.isna(title) or str(title).strip() == "":
                continue
            
            # Status Filter: Only "Live" or "Dead" (maybe include dead if PDF exists?)
            # User said: "Segment by Status: Live or Dead"
            status = str(row.get('Status', '')).strip()
            
            # Format Date
            date_val = row.get('Date')
            date_str = ""
            if isinstance(date_val, datetime):
                date_str = date_val.strftime("%B %d, %Y")
            elif not pd.isna(date_val):
                date_str = str(date_val).split(" ")[0]

            item = {
                "title": str(title).strip(),
                "url": str(row.get('URL', '')) if not pd.isna(row.get('URL')) else "",
                "description": str(row.get('Description', '')) if not pd.isna(row.get('Description')) else "",
                "format": str(row.get('Article Format', '')) if not pd.isna(row.get('Article Format')) else "",
                "theme": str(row.get('Primary Theme', '')) if not pd.isna(row.get('Primary Theme')) else "",
                "tags": str(row.get('Tags', '')).split(',') if not pd.isna(row.get('Tags')) else [],
                "status": status,
                "date": date_str,
                "pdf": str(row.get('PDF Saved', '')) if not pd.isna(row.get('PDF Saved')) else ""
            }
            # Clean tags
            item['tags'] = [t.strip() for t in item['tags'] if t.strip()]
            
            articles.append(item)

        # Sort by date
        # articles.sort(key=lambda x: x['date'], reverse=True) # Simple sort might fail on string dates

        js_content = f"const WRITING_DATA = {json.dumps(articles, indent=2)};"
        
        with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
            f.write(js_content)
            
        print(f"Successfully wrote {len(articles)} articles to {OUTPUT_FILE}")

    except Exception as e:
        print(f"Error extracting writing data: {e}")

if __name__ == "__main__":
    extract_writing_data()
