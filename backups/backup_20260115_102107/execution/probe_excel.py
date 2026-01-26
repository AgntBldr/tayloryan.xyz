import pandas as pd
import os

FILE = r"C:\Users\tempv2\Desktop\PortfolioAgent\Ref Docs\Resources Tab\All Quest Portfolio Resources.xlsx"

try:
    df = pd.read_excel(FILE)
    print("Columns found:")
    for c in df.columns:
        print(f" - '{c}'")
    print("-" * 20)
    print(df.head(2).to_string())
except Exception as e:
    print(f"Error: {e}")
