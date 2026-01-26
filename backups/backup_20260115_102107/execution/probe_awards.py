import pandas as pd
import os

BASE_DIR = r"C:\Users\tempv2\Desktop\PortfolioAgent\Ref Docs"
AWARDS_FILE = os.path.join(BASE_DIR, "Awards", "Awards - Taylor Ryan.xlsx")
# Projects might be inferred from directory structure or manual content as per user request
# "Projects - /work/projects. Within projects, there are several types of projects: Vibecoding, Courses, Marketing Projects"
# "See excel document... C:\Users\tempv2\Desktop\PortfolioAgent\Ref Docs\Work\Writing" (Wait, user said projects info is manual in prompt?)
# "Projects - /work/projects ... Vibecoding ... Courses ... Marketing Projects ... Summary: ... IDE: ..."
# User provided detailed manual content for Projects in PROMPT. 
# So we only probe Awards.

FILES = [AWARDS_FILE]

for file in FILES:
    print(f"\n\n==================================================")
    print(f"PROBING: {os.path.basename(file)}")
    print(f"==================================================")
    
    try:
        xls = pd.ExcelFile(file)
        print(f"Sheet names: {xls.sheet_names}")
        
        for sheet in xls.sheet_names:
            print(f"\n--- SHEET: {sheet} ---")
            df = pd.read_excel(xls, sheet_name=sheet)
            print("Columns:", df.columns.tolist())
            print(df.head(3).to_string())
    except Exception as e:
        print(f"Error: {e}")
