import pandas as pd
import os

base_path = r"C:\Users\tempv2\Desktop\PortfolioAgent\Ref Docs\Work\Projects\Marketing"
files = [
    "Content Creator Preformance.xlsx",
    "Shared Resources - Content Creator - All Resources.xlsx"
]

for file in files:
    path = os.path.join(base_path, file)
    print(f"\n--- FILE: {file} ---")
    try:
        xl = pd.ExcelFile(path)
        print(f"Sheets: {xl.sheet_names}")
        for sheet in xl.sheet_names:
            print(f"\n  Sheet: {sheet}")
            df = xl.parse(sheet)
            print(f"  Columns: {list(df.columns)}")
            print(f"  Row Count: {len(df)}")
            print(f"  First 2 rows:\n{df.head(2).to_string()}")
    except Exception as e:
        print(f"  Error reading {file}: {e}")
