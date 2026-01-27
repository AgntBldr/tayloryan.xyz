import os
import shutil

# Mapping: Source Relative Path -> Destination Relative Path in DEPLOY_PUBLIC
MAPPING = {
    r"portfolio\marketing\email_outreach.html": r"portfolio\marketing\email_outreach\index.html",
    r"portfolio\marketing\affiliates.html": r"portfolio\marketing\affiliates\index.html",
    r"portfolio\marketing\case_studies.html": r"portfolio\marketing\case_studies\index.html",
    r"portfolio\marketing\testimonials.html": r"portfolio\marketing\testimonials\index.html",
    r"portfolio\quests\resources.html": r"portfolio\quests\resources\index.html"
}

ROOT_DIR = r"C:\Users\tempv2\Desktop\PortfolioAgent"
DEPLOY_DIR = os.path.join(ROOT_DIR, "DEPLOY_PUBLIC")

def deploy():
    print(f"Deploying from {ROOT_DIR} to {DEPLOY_DIR}...")
    
    for src_rel, dest_rel in MAPPING.items():
        src_path = os.path.join(ROOT_DIR, src_rel)
        dest_path = os.path.join(DEPLOY_DIR, dest_rel)
        
        if not os.path.exists(src_path):
            print(f"WARNING: Source file not found: {src_path}")
            continue
            
        # Ensure dest dir exists
        os.makedirs(os.path.dirname(dest_path), exist_ok=True)
        
        # Copy
        shutil.copy2(src_path, dest_path)
        print(f"Deployed: {src_rel} -> {dest_rel}")

    print("Deployment copy complete.")

if __name__ == "__main__":
    deploy()
