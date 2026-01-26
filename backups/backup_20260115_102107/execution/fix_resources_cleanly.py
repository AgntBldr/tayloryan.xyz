"""
Clean fix for Resources tab - restores working HTML then adds features properly
"""
import re

html_path = r'c:\Users\tempv2\Desktop\PortfolioAgent\quest_portfolio.html'

with open(html_path, 'r', encoding='utf-8') as f:
    content = f.read()

# First, remove ALL broken Resources additions by finding and removing the injected sections
# Remove resources view containers
content = re.sub(r'<!-- RESOURCES VIEW -->.*?<!-- RESOURCE DETAIL VIEW -->.*?(?=\s*<div id="analytics-view")', '', content, flags=re.DOTALL)

# Remove resources script tag
content = content.replace('<script src="assets/js/quest_resources.js"></script>', '')

# Remove resources button if exists
content = re.sub(r'<button onclick="switchView\(\'resources\'\)"[^>]*>Resources</button>\s*', '', content)

# Now clean up the switchView function - restore original structure
# Find switchView function and fix it
pattern = r'(function switchView\(view\) \{.*?)(const btnResources = document\.getElementById\([\'"]btn-resources[\'"]\);.*?)(\[btnGrid, btnAnalytics, btnOverview.*?\]\.forEach)'
replacement = r'\1\3'
content = re.sub(pattern, replacement, content, flags=re.DOTALL)

# Remove btnResources from button reset array
content = re.sub(r'\[btnGrid, btnAnalytics, btnOverview, btnResources\]', '[btnGrid, btnAnalytics, btnOverview]', content)

# Remove btnResources from views array  
content = re.sub(r'\[grid, analytics, overview, document\.getElementById\("resources-view"\), document\.getElementById\("resource-detail-view"\)\]', '[grid, analytics, overview]', content)

# Remove resources view logic from switchView
pattern = r'(\} else if \(view === [\'"]overview[\'"]\) \{.*?lucide\.createIcons\(\);.*?\})\s*\} else if \(view === [\'"]resources[\'"]\) \{.*?\} else if \(view === [\'"]resource-detail[\'"]\) \{.*?\}\s*(\})'
replacement = r'\1\n        \2'
content = re.sub(pattern, replacement, content, flags=re.DOTALL)

# Remove renderResources and openResourceDetail functions
content = re.sub(r'// --- RESOURCES LOGIC ---.*?(?=document\.addEventListener)', '', content, flags=re.DOTALL)

# Write cleaned version
with open(html_path, 'w', encoding='utf-8') as f:
    f.write(content)

print("✓ Cleaned up broken Resources code")
print("✓ File restored to working state")
print("Ready for clean Resources implementation")
