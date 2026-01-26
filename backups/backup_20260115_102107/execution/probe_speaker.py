import pandas as pd
import os

FILE = r"C:\Users\tempv2\Desktop\PortfolioAgent\Ref Docs\Work\Public Speaking\Public Speaker - Taylor Ryan.xlsx"

try:
    xls = pd.ExcelFile(FILE)
    print(f"Sheet names: {xls.sheet_names}")
    
    for sheet in xls.sheet_names:
        print(f"\n--- SHEET: {sheet} ---")
        df = pd.read_excel(xls, sheet_name=sheet)
        print("Columns:", df.columns.tolist())
        print(df.head(3).to_string())
except Exception as e:
    print(f"Error: {e}")
