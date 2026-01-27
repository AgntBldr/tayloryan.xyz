import os

DEPLOY_DIR = r"C:\Users\tempv2\Desktop\PortfolioAgent\DEPLOY_PUBLIC"
VERSION = "20260127-3"

def bust_cache():
    count = 0
    for root, dirs, files in os.walk(DEPLOY_DIR):
        for file in files:
            if file.endswith(".html"):
                path = os.path.join(root, file)
                with open(path, "r", encoding="utf-8") as f:
                    content = f.read()
                
                new_content = content
                
                # Replace layout.js
                if 'src="/assets/js/layout.js"' in new_content:
                    new_content = new_content.replace('src="/assets/js/layout.js"', f'src="/assets/js/layout.js?v={VERSION}"')
                
                # Replace projects_data.js
                if 'src="/assets/js/projects_data.js"' in new_content:
                    new_content = new_content.replace('src="/assets/js/projects_data.js"', f'src="/assets/js/projects_data.js?v={VERSION}"')

                if new_content != content:
                    with open(path, "w", encoding="utf-8") as f:
                        f.write(new_content)
                    print(f"Updated {path}")
                    count += 1
    
    print(f"Total files updated: {count}")

if __name__ == "__main__":
    bust_cache()
