
import json
import re

try:
    # Read directly from the source to avoid PowerShell re-encoding
    path = r'DEPLOY_CLOUDFLARE\DEPLOY_PUBLIC\assets\js\speaker_data.js'
    try:
        with open(path, 'r', encoding='utf-8') as f:
            content = f.read()
    except UnicodeDecodeError:
        print("UTF-8 decode failed, trying utf-16")
        with open(path, 'r', encoding='utf-16') as f:
            content = f.read()
    
    # Strip variable declaration
    # Assuming it starts with "const SPEAKER_ENGAGEMENTS = [" and ends with "];"
    start_index = content.find('[')
    end_index = content.rfind(']')
    
    if start_index == -1 or end_index == -1:
        print("Could not find array brackets")
        exit(1)
        
    json_str = content[start_index:end_index+1]
    
    # It might contain single quotes or trailing commas which standard JSON doesn't like.
    # But usually these dumped files are JSON-compliant or close.
    # Let's try flexible parsing or just check basic syntax.
    
    # If it's pure JSON, this works:
    try:
        data = json.loads(json_str)
        print("Successfully parsed as valid JSON.")
        print(f"Count: {len(data)}")
        
        # Rewrite the file as UTF-8 to ensure browser compatibility
        with open(path, 'w', encoding='utf-8') as f:
            f.write(content)
        print("Rewrote file as UTF-8.")
        
    except json.JSONDecodeError as e:
        print(f"JSON Parse Error: {e}")
        # Identify location
        lines = json_str.split('\n')
        if e.lineno <= len(lines):
             print(f"Line {e.lineno}: {lines[e.lineno-1]}")

except Exception as e:
    print(f"Error: {e}")
