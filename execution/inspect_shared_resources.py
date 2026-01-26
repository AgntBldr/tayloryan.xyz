import openpyxl
import os

file_path = r"C:\Users\tempv2\Desktop\PortfolioAgent\Ref Docs\Work\Marketing\Content Creator Program\Shared Resources - Content Creator.xlsx"

print(f"Inspecting: {file_path}")

try:
    wb = openpyxl.load_workbook(file_path, data_only=False)
    sheet = wb.active
    
    print(f"Sheet Name: {sheet.title}")
    
    # Print Headers (Row 1)
    headers = []
    for cell in sheet[1]:
        headers.append(cell.value)
    print(f"Headers: {headers}")
    
    # Inspect first 5 rows
    print("\n--- First 5 Rows ---")
    for i, row in enumerate(sheet.iter_rows(min_row=2, max_row=6)):
        row_data = []
        links = []
        for cell in row:
            val = str(cell.value).strip() if cell.value else "None"
            row_data.append(val)
            if cell.hyperlink:
                links.append(f"Link in col {cell.column}: {cell.hyperlink.target}")
        
        print(f"Row {i+2}: {row_data}")
        if links:
            print(f"  Links found: {links}")
            
except Exception as e:
    print(f"Error: {e}")
