import csv
import re

def slugify(text):
    return re.sub(r'[^a-z0-9]+', '-', text.lower()).strip('-')

INPUT_CSV = r"Ref Docs\Quests\Quests - Taylor Portfolio - Sheet1.csv"
with open(INPUT_CSV, 'r', encoding='utf-8') as f:
    reader = csv.DictReader(f)
    for row in reader:
        if 'Irys' in row.get('Name of Quest', ''):
            name = row.get('Name of Quest', '').strip()
            print(f"Name: '{name}' -> ID: '{slugify(name)}'")
