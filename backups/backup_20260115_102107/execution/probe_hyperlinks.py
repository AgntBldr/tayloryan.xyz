import openpyxl
import os

FILE = r"C:\Users\tempv2\Desktop\PortfolioAgent\Ref Docs\Resources Tab\All Quest Portfolio Resources.xlsx"

try:
    wb = openpyxl.load_workbook(FILE)
    ws = wb['All Quest Portfolio Resources']
    
    print("Inspecting hyperlinks in column B (URL)...")
    
    # Assuming header is row 1, data starts row 2. Column B is index 2.
    for row in ws.iter_rows(min_row=2, max_row=10, min_col=1, max_col=4):
        # row is a tuple of cells. 
        # Col 0 = Resource, Col 1 = URL, Col 2 = Description
        resource_cell = row[0]
        url_cell = row[1]
        
        print(f"Row {resource_cell.row}:")
        print(f"  Resource: {resource_cell.value}")
        print(f"  URL Text: {url_cell.value}")
        if url_cell.hyperlink:
            print(f"  HYPERLINK: {url_cell.hyperlink.target}")
        else:
            print(f"  HYPERLINK: None")
            
except Exception as e:
    print(f"Error: {e}")
