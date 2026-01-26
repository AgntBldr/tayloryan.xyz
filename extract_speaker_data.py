import pandas as pd
import json

file_path = r"C:\Users\tempv2\Desktop\PortfolioAgent\Ref Docs\Work\Public Speaking\Taylor Ryan - Speaker Engagements.csv"

try:
    df = pd.read_csv(file_path)
    
    # Clean datetime objects if any (CSV reads as strings mainly, but let's keep logic if it auto-detects)
    # Pandas read_csv doesn't auto-parse dates unless specified, so columns likely strings already.
    # But let's safe-guard for column loops.
            
    # Fill NaN
    df = df.fillna("")
    
    # Save to JSON
    output_path = r"C:\Users\tempv2\Desktop\PortfolioAgent\speaker_data_extracted.json"
    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(df.to_dict(orient='records'), f, indent=2)
        
    print("Done")
except Exception as e:
    print(f"Error: {e}")
