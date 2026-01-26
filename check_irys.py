import csv
INPUT_CSV = r"Ref Docs\Quests\Quests - Taylor Portfolio - Sheet1.csv"
with open(INPUT_CSV, 'r', encoding='utf-8') as f:
    reader = csv.DictReader(f)
    for row in reader:
        if 'Irys' in row.get('Name of Quest', ''):
            print(f"Found in CSV: {row.get('Name of Quest', '')}")
