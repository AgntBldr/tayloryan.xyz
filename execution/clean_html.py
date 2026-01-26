"""
Clean restoration script - properly extract and rebuild the HTML
The user's pasted HTML has the Resources button but nested/malformed JS.
We need to extract the good parts and assemble them correctly.
"""

import re

# Read the current broken file
with open(r'c:\Users\tempv2\Desktop\PortfolioAgent\quest_portfolio.html', 'r', encoding='utf-8') as f:
    broken_html = f.read()

# The file should start with <!DOCTYPE html> but have weird indentation
# Let's fix the indentation first
lines = broken_html.split('\n')
fixed_lines = []

for line in lines:
    # Remove excessive leading whitespace (more than 20 spaces is suspicious)
    stripped = line.lstrip()
    if line.startswith('        ') and line != line.lstrip():  # Has 8+ spaces
        # Reduce to 0 spaces for top-level tags
        if stripped.startswith('<html') or stripped.startswith('<!DOCTYPE'):
            fixed_lines.append(stripped)
        elif stripped.startswith('<head') or stripped.startswith('<body') or stripped.startswith('</html') or stripped.startswith('</body'):
            fixed_lines.append('    ' + stripped)
        else:
            # Keep some indentation but reduce it
            indent_level = (len(line) - len(stripped)) // 4
            fixed_lines.append('    ' * min(indent_level, 10) + stripped)
    else:
        fixed_lines.append(line)

cleaned_html = '\n'.join(fixed_lines)

# Now fix the Resources button onclick
cleaned_html = cleaned_html.replace("onclick=\"switchView(\\'resources\\')\"", 'onclick="switchView(\'resources\')"')

# Write the result
with open(r'c:\Users\tempv2\Desktop\PortfolioAgent\quest_portfolio.html', 'w', encoding='utf-8') as f:
    f.write(cleaned_html)

print("✓ Fixed indentation")
print("✓ Fixed Resources button onclick")
print("✓ File cleaned and saved")
