import pandas as pd
import json
import os
import datetime

# Configuration
BASE_DIR = r"C:\Users\tempv2\Desktop\PortfolioAgent"
INPUT_FILE = r"C:\Users\tempv2\Desktop\PortfolioAgent\Ref Docs\Work\Short Video Tutorials - Taylor Portfolio.xlsx"
OUTPUT_FILE = os.path.join(BASE_DIR, "assets", "data_tutorials.js")

def extract_tutorials_data():
    if not os.path.exists(INPUT_FILE):
        print(f"File not found: {INPUT_FILE}")
        return

    try:
        xls = pd.ExcelFile(INPUT_FILE)
        # Using the first sheet dynamically
        sheet_name = xls.sheet_names[0]
        df = pd.read_excel(INPUT_FILE, sheet_name=sheet_name)
        
        # Clean column names
        df.columns = [str(c).strip() for c in df.columns]
        
        # Columns: ['Video', 'Video URL', 'Length', 'description', 'Date', 'Project']
        
        tutorials = []
        
        for idx, row in df.iterrows():
            title = row.get('Video')
            if pd.isna(title) or str(title).strip() == "":
                continue
            
            # Date formatting
            date_val = row.get('Date')
            date_str = ""
            if pd.isna(date_val):
                 pass
            elif isinstance(date_val, datetime.datetime):
                date_str = date_val.strftime("%B %d, %Y")
            else:
                 date_str = str(date_val).split(" ")[0]

            item = {
                "title": str(title).strip(),
                "url": str(row.get('Video URL', '')) if not pd.isna(row.get('Video URL')) else "#",
                "length": str(row.get('Length', '')).strip() if not pd.isna(row.get('Length')) else "",
                "description": str(row.get('description', '')).strip() if not pd.isna(row.get('description')) else "",
                "project": str(row.get('Project', '')).strip() if not pd.isna(row.get('Project')) else "",
                "date": date_str
            }
            tutorials.append(item)
        
        # Sort by Date Desc if available (roughly)
        # We'll just leave them in order or sort by date if possible, but date string might vary.
        # Let's simple reverse to show newest first if excel is chronologically added? 
        # Actually, let's just keep excel order for now.

        js_content = f"const TUTORIALS_DATA = {json.dumps(tutorials, indent=2)};"
        
        with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
            f.write(js_content)
            
        print(f"Successfully wrote {len(tutorials)} tutorials to {OUTPUT_FILE}")

    except Exception as e:
        print(f"Error extracting tutorials data: {e}")

if __name__ == "__main__":
    extract_tutorials_data()
