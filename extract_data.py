import pandas as pd
import json
import os

files = {
    'Testimonials': r'C:\Users\tempv2\Desktop\PortfolioAgent\Ref Docs\Work\Marketing\Testimonial Creation\All Testimonial Creation Resources.xlsx',
    'ContentCreator': r'C:\Users\tempv2\Desktop\PortfolioAgent\Ref Docs\Work\Marketing\Content Creator Program\Shared Resources - Content Creator.xlsx'
}

output = {}

for name, path in files.items():
    try:
        print(f"Reading {name} from {path}")
        df = pd.read_excel(path)
        # Handle NaN values
        df = df.where(pd.notnull(df), None)
        output[name] = df.to_dict(orient='records')
        print(f"Successfully read {name}")
    except Exception as e:
        print(f"Error reading {name}: {e}")
        output[name] = []

try:
    with open('data_extract.json', 'w') as f:
        json.dump(output, f, indent=2)
    print("Successfully wrote to data_extract.json")
except Exception as e:
    print(f"Error writing output: {e}")
