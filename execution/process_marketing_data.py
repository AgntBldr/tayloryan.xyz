import pandas as pd
import json
import os
import datetime

BASE_DIR = r"C:\Users\tempv2\Desktop\PortfolioAgent"
DATA_DIR = os.path.join(BASE_DIR, "Ref Docs", "Work", "Projects", "Marketing")
OUTPUT_FILE = os.path.join(BASE_DIR, "assets", "js", "marketing_data.js")

def safe_date_converter(o):
    if isinstance(o, (datetime.date, datetime.datetime)):
        return o.strftime("%Y-%b")
    return str(o)

def process_data():
    js_content = ""

    # 1. ANALYTICS
    perf_file = os.path.join(DATA_DIR, "Content Creator Preformance.xlsx")
    if os.path.exists(perf_file):
        print(f"Processing {perf_file}...")
        df = pd.read_excel(perf_file)
        # Clean data: Replace NaNs with 0 or empty string
        df = df.fillna(0)
        # Convert to list of dicts
        records = df.to_dict(orient='records')
        js_content += f"window.MARKETING_ANALYTICS = {json.dumps(records, default=safe_date_converter, indent=2)};\n\n"
    else:
        print(f"Warning: {perf_file} not found.")

    # 2. RESOURCES
    res_file = os.path.join(DATA_DIR, "Shared Resources - Content Creator - All Resources.xlsx")
    if os.path.exists(res_file):
        print(f"Processing {res_file}...")
        df = pd.read_excel(res_file)
        df = df.fillna("")
        
        # Normalize columns if needed
        # Expected: Link (Title), GoogleLink (URL), Description, Notes, Category (Maybe?)
        # Let's try to infer category or map it. 
        # If no category column, assign "General" or try to parse from Notes.
        
        records = df.to_dict(orient='records')
        js_content += f"window.MARKETING_RESOURCES = {json.dumps(records, indent=2)};\n"
    else:
        print(f"Warning: {res_file} not found.")

    with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
        f.write(js_content)
    
    print(f"Successfully wrote data to {OUTPUT_FILE}")

if __name__ == "__main__":
    process_data()
