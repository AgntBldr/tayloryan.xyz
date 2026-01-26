import os
import shutil

SOURCE_DIR = r"Ref Docs/Overview and Summary"
DEST_DIR = r"assets/overview"

def sanitize_filename(name):
    name = name.lower()
    name = name.replace(" - ", "_").replace(" ", "_").replace("(", "").replace(")", "")
    return name

def process_images():
    if not os.path.exists(DEST_DIR):
        os.makedirs(DEST_DIR)

    files = [f for f in os.listdir(SOURCE_DIR) if f.lower().endswith(('.png', '.jpg', '.jpeg'))]
    
    print(f"Found {len(files)} images to process...")

    for f in files:
        src_path = os.path.join(SOURCE_DIR, f)
        
        new_name = sanitize_filename(f)
        dest_path = os.path.join(DEST_DIR, new_name)
        
        try:
            shutil.copy2(src_path, dest_path)
            print(f"Copied: {f} -> {new_name}")

        except Exception as e:
            print(f"Error copying {f}: {e}")

if __name__ == "__main__":
    process_images()
