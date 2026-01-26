import json
import os

input_file = r"C:\Users\tempv2\Desktop\PortfolioAgent\speaker_data_extracted.json"
output_file = r"C:\Users\tempv2\Desktop\PortfolioAgent\assets\js\speaker_data.js"

with open(input_file, 'r', encoding='utf-8') as f:
    raw_data = json.load(f)

# Filter out empty entries or headers (where "Event Name" is just a year number)
processed_data = []

for item in raw_data:
    event_name = str(item.get("Event Name", "")).strip()
    
    # Skip empty
    if not event_name:
        continue
        
    # Skip if event name is likely a year header (4 digits)
    if event_name.isdigit() and len(event_name) == 4:
        continue
    
    # Ensure Date is present (some entries might lack date, we can perhaps keep them but `work_speaker.html` filters them out: .filter(item => item["Date (DD/MM/YY)"] && item["Event Name"])
    # So we don't strictly need to filter here, but cleaner if we do or at least pass them through validly.
    
    # We want to keep all fields as is to match what `work_speaker.html` expects.
    # The HTML expects keys: "Date (DD/MM/YY)", "Event Name", "City, Country", "Organization", "Title", "Event Type", "Theme", "Niche", "Tags", "Program URL", "Full Length Video", etc.
    # The JSON extracted from Excel has these keys.
    
    processed_data.append(item)

# Manual Override for JetBrains to 2026 as per user request
for item in processed_data:
    if "JetBrains" in str(item.get("Event Name", "")):
        # Check if it's the specific event or all JetBrains. Assuming the one we saw.
        # Original date was "Jan 19, 2025". Let's update it to 2026.
        if "2025" in str(item.get("Date (DD/MM/YY)", "")):
             item["Date (DD/MM/YY)"] = item["Date (DD/MM/YY)"].replace("2025", "2026")

js_content = f"const SPEAKER_ENGAGEMENTS = {json.dumps(processed_data, indent=2)};"

with open(output_file, 'w', encoding='utf-8') as f:
    f.write(js_content)
    
print(f"Successfully updated {output_file} with {len(processed_data)} entries.")
