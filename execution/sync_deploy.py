import os
import shutil

SOURCE_DIR = r"C:\Users\tempv2\Desktop\PortfolioAgent\DEPLOY_CLOUDFLARE\tayloryan.xyz\DEPLOY_PUBLIC"
TARGET_DIR = r"C:\Users\tempv2\Desktop\PortfolioAgent\DEPLOY_PUBLIC"

def sync_folders():
    if not os.path.exists(SOURCE_DIR):
        print(f"Source directory not found: {SOURCE_DIR}")
        return

    if not os.path.exists(TARGET_DIR):
        print(f"Target directory not found: {TARGET_DIR}")
        return

    print(f"Syncing from {SOURCE_DIR} to {TARGET_DIR}...")

    # Walk through source including subdirectories
    for root, dirs, files in os.walk(SOURCE_DIR):
        # Create corresponding subdirectories in target
        rel_path = os.path.relpath(root, SOURCE_DIR)
        target_root = os.path.join(TARGET_DIR, rel_path)
        
        if not os.path.exists(target_root):
            os.makedirs(target_root)
            print(f"Created directory: {target_root}")

        for file in files:
            source_file = os.path.join(root, file)
            target_file = os.path.join(target_root, file)
            
            # Copy if target doesn't exist or source is newer/different
            if not os.path.exists(target_file):
                shutil.copy2(source_file, target_file)
                print(f"Copied new file: {file}")
            else:
                # Compare modified times or sizes to decide (or just force overwrite for now to be safe)
                # Forcing overwrite to ensure content matches
                shutil.copy2(source_file, target_file)
                print(f"Updated file: {file}")

    print("Sync complete.")

if __name__ == "__main__":
    sync_folders()
