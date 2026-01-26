import csv
import json
import os

def convert_csv_to_json():
    # Paths
    csv_path = r"c:\Users\tempv2\Desktop\PortfolioAgent\Ref Docs\Work\Public Speaking\Taylor Ryan - Speaker Engagements.csv"
    json_path = r"c:\Users\tempv2\Desktop\PortfolioAgent\assets\js\speaker_data.json"

    print(f"Reading CSV from: {csv_path}")
    
    data = []
    
    try:
        with open(csv_path, mode='r', encoding='utf-8-sig') as csv_file:
            # Use DictReader to automatically map headers to values
            csv_reader = csv.DictReader(csv_file)
            
            for row in csv_reader:
                # Basic cleaning: filtered out empty rows if needed, but logic checks keys later
                # We want to keep all keys as they are because the frontend expects specific column names
                
                # Check if row is essentially empty (ignoring year markers if they exist in some formats, but here likely standard)
                # The file has year rows e.g. "2026,,,,..." which we should probably exclude or let frontend filter.
                # Frontend filters: .filter(item => item["Date (DD/MM/YY)"] && item["Event Name"])
                # So we can just dump everything and let frontend handle it, OR filter here.
                # Let's filter here to keep JSON clean.
                
                if row.get("Date (DD/MM/YY)") and row.get("Event Name"):
                    data.append(row)
                    
        print(f"Parsed {len(data)} valid engagements.")
        
        # Write JSON
        with open(json_path, 'w', encoding='utf-8') as json_file:
            json.dump(data, json_file, indent=2, ensure_ascii=False)
            
        print(f"Successfully wrote JSON to: {json_path}")
        return True

    except Exception as e:
        print(f"Error converting CSV to JSON: {e}")
        return False

if __name__ == "__main__":
    convert_csv_to_json()
