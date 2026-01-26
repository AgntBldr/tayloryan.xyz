import os
import shutil
from datetime import datetime

BASE_DIR = r"C:\Users\tempv2\Desktop\PortfolioAgent"
BACKUP_ROOT = os.path.join(BASE_DIR, "backups")
TIMESTAMP = datetime.now().strftime("%Y%m%d_%H%M%S")
BACKUP_DIR = os.path.join(BACKUP_ROOT, f"backup_{TIMESTAMP}")

# Files with these extensions will be backed up
TARGET_EXTENSIONS = {'.html', '.js', '.css', '.py', '.md', '.json'}

# Use full paths for exclusions or relative paths relative to BASE_DIR?
# Best to ignore by directory names first.
IGNORE_DIRS = {'backups', '.git', '.gemini', '.idea', '__pycache__', 'node_modules', 'Ref Docs', 'temp'}

def main():
    if not os.path.exists(BACKUP_DIR):
        os.makedirs(BACKUP_DIR)
        print(f"Created backup directory: {BACKUP_DIR}")

    count = 0
    for root, dirs, files in os.walk(BASE_DIR):
        # Modify dirs in-place to skip ignored directories
        dirs[:] = [d for d in dirs if d not in IGNORE_DIRS]
        
        for file in files:
            ext = os.path.splitext(file)[1].lower()
            if ext in TARGET_EXTENSIONS:
                src_path = os.path.join(root, file)
                rel_path = os.path.relpath(src_path, BASE_DIR)
                dst_path = os.path.join(BACKUP_DIR, rel_path)
                
                os.makedirs(os.path.dirname(dst_path), exist_ok=True)
                shutil.copy2(src_path, dst_path)
                count += 1
                # print(f"Backed up: {rel_path}")

    print(f"\n✅ Backup complete! Saved {count} files to:\n{BACKUP_DIR}")

if __name__ == "__main__":
    main()
