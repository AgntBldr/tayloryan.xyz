import pandas as pd
import json
import os

# Configuration
INPUT_FILE = r"C:\Users\tempv2\Desktop\PortfolioAgent\Ref Docs\About\Marketing Projects by Skill Segment.xlsx"
OUTPUT_FILE = r"C:\Users\tempv2\Desktop\PortfolioAgent\assets\js\marketing_skills_data.js"

def parse_excel():
    if not os.path.exists(INPUT_FILE):
        print(f"Error: File not found at {INPUT_FILE}")
        return

    try:
        xl = pd.ExcelFile(INPUT_FILE)
        all_data = {}

        for sheet_name in xl.sheet_names:
            print(f"Processing sheet: {sheet_name}")
            df = pd.read_excel(INPUT_FILE, sheet_name=sheet_name)
            
            # Normalize columns
            df.columns = [str(c).strip() for c in df.columns]
            print(f"Columns: {list(df.columns)}")

            if 'Project' not in df.columns:
                print(f"SKIPPING {sheet_name}: 'Project' column not found.")
                continue

            # Filter rows where 'Project' is not empty
            df = df.dropna(subset=['Project'])
            
            # Get all columns and normalize keys to snake_case
            columns = df.columns.tolist()
            
            sheet_projects = []
            for _, row in df.iterrows():
                project = {}
                for col in columns:
                    # Create key: lowercase, remove special chars, replace space with underscore
                    key = str(col).lower().replace('-', ' ').replace('+', '').replace('(', '').replace(')', '').strip().replace(' ', '_')
                    # Clean double underscores if any
                    while '__' in key:
                        key = key.replace('__', '_')
                    # Remove trailing underscores
                    key = key.strip('_')
                    
                    val = str(row.get(col, '')).strip()
                    if val.lower() == 'nan':
                        val = ""
                    
                    project[key] = val

                # Ensure critical fields exist even if empty (for safety)
                if 'project' not in project: project['project'] = "Unknown Project"
                if 'status' not in project: project['status'] = "-"
                        
                sheet_projects.append(project)
            
            if sheet_projects:
                all_data[sheet_name] = sheet_projects

        # Generate JavaScript file
        js_content = f"const MARKETING_SKILLS_DATA = {json.dumps(all_data, indent=4)};"
        
        with open(OUTPUT_FILE, 'w', encoding='utf-8') as f:
            f.write(js_content)
            
        print(f"Successfully generated {OUTPUT_FILE}")
        print(f"Categories found: {list(all_data.keys())}")

    except Exception as e:
        print(f"An error occurred: {e}")

if __name__ == "__main__":
    parse_excel()
