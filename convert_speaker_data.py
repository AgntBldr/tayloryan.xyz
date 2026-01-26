
import pandas as pd
import json
import os

excel_path = r"Ref Docs\Work\Public Speaking\Public Speaker - Speaker Engagements - Taylor Ryan.xlsx"
output_path = r"assets/js/speaker_data.js"

def convert_to_json():
    if not os.path.exists(excel_path):
        print(f"File not found: {excel_path}")
        return

    try:
        # Read Excel
        df = pd.read_excel(excel_path)
        
        # Print columns for debugging
        print("Columns found:", df.columns.tolist())
        
        # Convert to list of dicts
        data = df.to_dict(orient='records')
        
        # Clean up data (handle NaNs, date formatting)
        cleaned_data = []
        for row in data:
            new_row = {}
            for k, v in row.items():
                if pd.isna(v):
                    new_row[k] = None # or ""
                elif isinstance(v, pd.Timestamp):
                     new_row[k] = v.strftime('%Y-%m-%d')
                else:
                    new_row[k] = v
            cleaned_data.append(new_row)

        # Wrap in a variable assignment for JS
        js_content = f"const SPEAKER_ENGAGEMENTS = {json.dumps(cleaned_data, indent=2)};"
        
        with open(output_path, 'w', encoding='utf-8') as f:
            f.write(js_content)
            
        print(f"Successfully wrote {len(cleaned_data)} records to {output_path}")

    except Exception as e:
        print(f"Error converting excel: {e}")

if __name__ == "__main__":
    convert_to_json()
