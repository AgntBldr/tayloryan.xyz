"""
Final restoration script: Extract working HTML from browser tab BC83 and save it
The browser extracted the content but it's missing DOCTYPE since that's outside <html>
We need to reconstruct from the browser tab itself
"""

# Since I can't directly get the cleaned HTML from the browser in one go,
# I'll read the current malformed file and extract the good parts properly

with open(r'c:\Users\tempv2\Desktop\PortfolioAgent\quest_portfolio.html', 'r', encoding='utf-8') as f:
    content = f.read()

# The file should have ```html followed by the real HTML
# Find and extract it
import re

# Look for the pattern: ```html followed by content
match = re.search(r'```html\s+(<!DOCTYPE html>[\s\S]*)', content, re.DOTALL)

if match:
    # Extract everything after ```html
    extracted = match.group(1)
    
    # Remove any trailing ```
    extracted = re.sub(r'\s*```\s*$', '', extracted)
    
    # Remove excessive indentation  
    lines = extracted.split('\n')
    cleaned_lines = []
    for line in lines:
        # Remove up to 8 leading spaces
        if line.startswith('        '):
            cleaned_lines.append(line[8:])
        else:
            cleaned_lines.append(line)
    
    final_html = '\n'.join(cleaned_lines)
    
    # Write it
    with open(r'c:\Users\tempv2\Desktop\PortfolioAgent\quest_portfolio.html', 'w', encoding='utf-8') as f:
        f.write(final_html)
    
    print("✓ Extracted HTML from markdown fences")
    print(f"✓ File size: {len(final_html):,} characters")
    print("✓ Cleaned indentation")
    print("✓ Portfolio restored successfully!")
else:
    print("✗ Could not find ```html pattern")
    print("✗ File may already be clean or have different structure")
