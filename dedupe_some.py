
import json
import re

file_path = r'C:\Users\tempv2\Desktop\PortfolioAgent\assets\js\some_work_data.js'

with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Try stripping prefix/suffix approach which is more robust for big files than regex sometimes
content_clean = content.replace('const SOME_WORK_DATA = ', '').strip()
if content_clean.endswith(';'):
    content_clean = content_clean[:-1]

try:
    data = json.loads(content_clean)
except json.JSONDecodeError as e:
    print(f"Direct JSON failed: {e}. Trying simple regex extraction...")
    # Regex as fallback
    match = re.search(r'\[.*\]', content, re.DOTALL)
    if match:
        try:
            data = json.loads(match.group(0))
        except Exception as e2:
             # Last resort: eval
            import ast
            try:
                data = ast.literal_eval(match.group(0))
            except Exception as e3:
                print(f"All parsing failed. {e3}")
                exit(1)
    else:
        print("Regex failed to find array")
        exit(1)

print(f"Original count: {len(data)}")

seen_titles = set()
deduped_data = []

# Keep the FIRST occurrence of each title
for item in data:
    title = item.get('title', '').strip()
    if title:
        if title not in seen_titles:
            seen_titles.add(title)
            deduped_data.append(item)
    else:
        # If no title, keep it? Or duplicates might exist without titles?
        # Let's assume title is key.
        deduped_data.append(item)

print(f"Deduped count: {len(deduped_data)}")
print(f"Removed {len(data) - len(deduped_data)} duplicates")

# Serialize back to JS
new_content = f"const SOME_WORK_DATA = {json.dumps(deduped_data, indent=2)};"

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(new_content)

print(f"Successfully wrote parsed data back to {file_path}")
