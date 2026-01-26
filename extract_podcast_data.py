import pandas as pd
import json
import os

file_path = r"C:\Users\tempv2\Desktop\PortfolioAgent\Ref Docs\Work\Podcasts\Podcast Portfolio - Taylor Ryan.xlsx"

try:
    df = pd.read_excel(file_path)
    # Convert dates to string to avoid serialization issues
    for col in df.columns:
        if pd.api.types.is_datetime64_any_dtype(df[col]):
            df[col] = df[col].dt.strftime('%Y-%m-%d')
    
    # Fill NaN with empty string
    df = df.fillna("")
    
    with open('podcast_data_extracted.json', 'w', encoding='utf-8') as f:
        json.dump(df.to_dict(orient='records'), f, indent=2)
    print("Done")
except Exception as e:
    print(f"Error: {e}")
