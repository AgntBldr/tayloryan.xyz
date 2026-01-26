import re
import os

# Paths
target_path = r'c:\Users\tempv2\Desktop\PortfolioAgent\quest_portfolio.html'
content_path = r'c:\Users\tempv2\Desktop\PortfolioAgent\overview_blog_content.html'

if not os.path.exists(content_path):
    print("Error: Content file not found.")
    exit(1)

with open(content_path, 'r', encoding='utf-8') as f:
    new_content = f.read()

with open(target_path, 'r', encoding='utf-8') as f:
    full_html = f.read()

pattern = re.compile(r'(<div id="overview-view"[^>]*>)([\s\S]*?)(<div id="analytics-view")', re.DOTALL)

match = pattern.search(full_html)
if match:
    opening_tag = match.group(1)
    analytics_tag = match.group(3)
    
    new_block = f"{opening_tag}\n{new_content}\n    </div>\n\n    {analytics_tag}"
    
    new_full_html = full_html.replace(match.group(0), new_block)
    
    with open(target_path, 'w', encoding='utf-8') as f:
        f.write(new_full_html)
    print("Successfully patched quest_portfolio.html with blog content.")

else:
    print("Error: Could not find overview-view block followed by analytics-view.")
