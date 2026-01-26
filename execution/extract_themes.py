import pandas as pd
import json
import re
import os

# Paths
excel_path = r'c:\Users\tempv2\Desktop\PortfolioAgent\Ref Docs\quests\Quests - Taylor Portfolio (2).xlsx'
js_path = r'c:\Users\tempv2\Desktop\PortfolioAgent\quests_data.js'

def main():
    print(f"Reading Excel: {excel_path}")
    # Read Excel - Column AA is index 26 (0-based)
    # But better to find column by name or just use letter AA if possible or assume structure
    # 'Theme' is the header. Let's try to read header and find 'Theme'.
    try:
        df = pd.read_excel(excel_path)
    except Exception as e:
        print(f"Error reading excel: {e}")
        return

    # User said Column AA is Theme. Let's verify if 'Theme' exists or use index 26.
    theme_col = None
    if 'Theme' in df.columns:
        theme_col = 'Theme'
    else:
        # Fallback to column index 26 (AA)
        if len(df.columns) > 26:
            theme_col = df.columns[26]
            print(f"Column 'Theme' not found by name. Using column index 26: {theme_col}")

    # User said Column Y is Environment. Column Y is index 24.
    env_col = None
    if 'Environment' in df.columns:
        env_col = 'Environment'
    else:
        if len(df.columns) > 24:
            env_col = df.columns[24]
            print(f"Column 'Environment' not found by name. Using column index 24: {env_col}")

    project_col = None
    # Look for 'Project' or similar
    possible_names = ['Project', 'Project Name', 'Protocol']
    for name in possible_names:
        if name in df.columns:
            project_col = name
            break
    
    if not project_col:
        print("Error: Could not find Project column.")
        return

    print(f"Using Project Column: {project_col}")
    print(f"Using Theme Column: {theme_col}")
    print(f"Using Environment Column: {env_col}")

    # Create Dictionary
    meta_map = {}
    for index, row in df.iterrows():
        proj = str(row[project_col]).strip().lower()
        if not proj or proj == 'nan': continue

        theme = str(row[theme_col]).strip() if theme_col else ''
        env = str(row[env_col]).strip() if env_col else ''
        
        meta_map[proj] = {
            'theme': theme if theme.lower() != 'nan' else 'Uncategorized',
            'environment': env if env.lower() != 'nan' else 'Unknown'
        }

    print(f"Found {len(meta_map)} projects with metadata.")

    # Read JS File
    print(f"Reading JS: {js_path}")
    with open(js_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Extract JSON part
    match = re.search(r'window\.quests\s*=\s*(\[.*\]);?', content, re.DOTALL)
    if not match:
        print("Error: Could not find window.quests array.")
        return

    json_str = match.group(1)
    
    try:
        data = json.loads(json_str)
    except json.JSONDecodeError:
        print("JSON Decode Error. Attempting to clean JS objects...")
        json_str = re.sub(r',\s*]', ']', json_str)
        json_str = re.sub(r',\s*}', '}', json_str)
        data = json.loads(json_str)

    # Update Data
    updated_count = 0
    for quest in data:
        q_proj = quest.get('project', '').strip().lower()
        
        # Try direct or fuzzy match
        matched_meta = meta_map.get(q_proj)
        
        if not matched_meta:
             for k, v in meta_map.items():
                if k in q_proj or q_proj in k:
                    matched_meta = v
                    break
        
        if matched_meta:
            quest['theme'] = matched_meta['theme']
            quest['environment'] = matched_meta['environment']
            updated_count += 1
        else:
             quest['theme'] = 'Uncategorized'
             quest['environment'] = 'Unknown'
             print(f"Warning: No metadata found for {quest.get('project')}")

    print(f"Updated {updated_count} quests with themes and environment.")

    # Write back
    new_content = f"window.quests = {json.dumps(data, indent=2)}"
    with open(js_path, 'w', encoding='utf-8') as f:
        f.write(new_content)
    
    print("Done.")

if __name__ == "__main__":
    main()
