import pandas as pd
import os

BASE_DIR = r"C:\Users\tempv2\Desktop\PortfolioAgent\Ref Docs\Work"
FILES = [
    os.path.join(BASE_DIR, "Writing", "Writing - All Articles.xlsx"),
    os.path.join(BASE_DIR, "Podcasts", "Podcast Portfolio - Taylor Ryan.xlsx")
]

for file in FILES:
    print(f"\n\n==================================================")
    print(f"PROBING: {os.path.basename(file)}")
    print(f"==================================================")
    
    try:
        xls = pd.ExcelFile(file)
        print(f"Sheet names: {xls.sheet_names}")
        
        for sheet in xls.sheet_names:
            print(f"\n--- SHEET: {sheet} ---")
            df = pd.read_excel(xls, sheet_name=sheet)
            print("Columns:", df.columns.tolist())
            print(df.head(3).to_string())
    except Exception as e:
        print(f"Error: {e}")
