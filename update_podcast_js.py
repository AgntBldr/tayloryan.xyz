import json
import os

input_file = r"C:\Users\tempv2\Desktop\PortfolioAgent\podcast_data_extracted.json"
output_file = r"C:\Users\tempv2\Desktop\PortfolioAgent\assets\js\podcast_data.js"

with open(input_file, 'r', encoding='utf-8') as f:
    raw_data = json.load(f)

processed_data = []

for item in raw_data:
    media = item.get("Podcast / Media", "").strip()
    title = item.get("Title", "").strip()
    url = item.get("URL", "").strip()
    
    # Skip empty entries
    if not media and not title and not url:
        continue
        
    url2 = item.get("Additional Media", "").strip()
    if url2 == "-" or url2.lower() == "nan":
        url2 = ""
        
    date_str = item.get("Date", "").strip()
    # If date is like 2025-03-11, existing format prefers "March 11, 2025" but date object parsing in JS handles ISO dates fine.
    # We will keep it as string, let JS handle it.
    
    category = item.get("Media Type", "").strip()
    if not category:
        category = "Podcasts"
        
    industry = item.get("Industry", "").strip()
    description = item.get("Description", "").strip()

    entry = {
        "media": media,
        "title": title,
        "url": url,
        "description": description,
        "category": category,
        "industry": industry,
        "date": date_str
    }
    
    if url2:
        entry["url2"] = url2
        
    processed_data.append(entry)

# Write to JS file
js_content = f"const PODCAST_DATA = {json.dumps(processed_data, indent=2)};"

with open(output_file, 'w', encoding='utf-8') as f:
    f.write(js_content)
    
print(f"Successfully updated {output_file} with {len(processed_data)} entries.")
