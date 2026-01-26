import pandas as pd
import json
import os

# Configuration
BASE_DIR = r"C:\Users\tempv2\Desktop\PortfolioAgent"
INPUT_FILE = r"C:\Users\tempv2\Desktop\PortfolioAgent\Ref Docs\Awards\Awards - Taylor Ryan.xlsx"
OUTPUT_FILE = os.path.join(BASE_DIR, "assets", "data_awards.js")

def extract_awards_data():
    if not os.path.exists(INPUT_FILE):
        print(f"File not found: {INPUT_FILE}")
        return

    try:
        xls = pd.ExcelFile(INPUT_FILE)
        sheet_name = xls.sheet_names[0]
        df = pd.read_excel(INPUT_FILE, sheet_name=sheet_name)
        df.columns = [str(c).strip() for c in df.columns]
        
        # Columns: ['Award', 'URL', 'Organization', 'Date', 'Placing', 'Receiver']
        
        awards = []
        
        for idx, row in df.iterrows():
            title = row.get('Award')
            if pd.isna(title) or str(title).strip() == "":
                continue
            
            item = {
                "title": str(title).strip(),
                "url": str(row.get('URL', '')) if not pd.isna(row.get('URL')) else "",
                "organization": str(row.get('Organization', '')).strip() if not pd.isna(row.get('Organization')) else "",
                "year": str(row.get('Date', '')).strip() if not pd.isna(row.get('Date')) else "",
                "placement": str(row.get('Placing', '')).strip() if not pd.isna(row.get('Placing')) else "",
                "receiver": str(row.get('Receiver', '')).strip() if not pd.isna(row.get('Receiver')) else ""
            }
            awards.append(item)
        
        # Sort by Year Desc
        awards.sort(key=lambda x: str(x['year']), reverse=True)

        js_content = f"const AWARDS_DATA = {json.dumps(awards, indent=2)};"
        
        with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
            f.write(js_content)
            
        print(f"Successfully wrote {len(awards)} awards to {OUTPUT_FILE}")

    except Exception as e:
        print(f"Error extracting awards data: {e}")

if __name__ == "__main__":
    extract_awards_data()
