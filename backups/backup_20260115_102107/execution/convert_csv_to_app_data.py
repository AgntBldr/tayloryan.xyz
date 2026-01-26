import csv
import json
import os

INPUT_CSV = r"Ref Docs\Quests - Taylor - Antigravity - Quests.csv"
OUTPUT_JSON = r"quest-portfolio\src\data\quests.json"

def convert():
    quests = []
    with open(INPUT_CSV, 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        for row in reader:
            # Map CSV columns to App Schema
            # Schema: id, title, description, project, type, activations, url, image(placeholder)
            
            # Skip empty rows
            if not row.get('Name of Quest'): continue
            
            quest = {
                "id": row.get('Name of Quest').lower().replace(' ', '-'),
                "title": row.get('Name of Quest'),
                "project": row.get('Project Name'),
                "description": row.get('Description', ''),
                "type": row.get('Type', 'Quest'),
                "activations": row.get('Activations', '0'),
                "url": row.get('URL'),
                "image": "/placeholder-quest.png", # Default
                "steps": [] # Empty for now
            }
            quests.append(quest)
            
    # Ensure dir
    os.makedirs(os.path.dirname(OUTPUT_JSON), exist_ok=True)
    
    with open(OUTPUT_JSON, 'w', encoding='utf-8') as f:
        json.dump(quests, f, indent=2)
        
    print(f"Converted {len(quests)} quests to {OUTPUT_JSON}")

if __name__ == "__main__":
    convert()
