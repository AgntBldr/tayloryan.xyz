
import pandas as pd
import os

file_path = r"C:\Users\tempv2\Desktop\PortfolioAgent\Ref Docs\About\Marketing Projects by Skill Segment.xlsx"

try:
    xl = pd.ExcelFile(file_path)
    print(f"Sheet names: {xl.sheet_names}")
    
    for sheet in xl.sheet_names:
        print(f"\n--- Sheet: {sheet} ---")
        df = pd.read_excel(file_path, sheet_name=sheet)
        print(df.head().to_string())
        print(f"Columns: {list(df.columns)}")
        
except Exception as e:
    print(f"Error reading Excel file: {e}")
