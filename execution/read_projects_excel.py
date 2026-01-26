import pandas as pd
import json

file_path = r"C:\Users\tempv2\Desktop\PortfolioAgent\Ref Docs\Work\Projects\Project Portfolio - Vibecode projects.xlsx"

try:
    df = pd.read_excel(file_path)
    # Convert to list of dicts, handling NaNs
    data = df.where(pd.notnull(df), None).to_dict(orient='records')
    print(json.dumps(data, indent=2))
except Exception as e:
    print(f"Error reading excel: {e}")
