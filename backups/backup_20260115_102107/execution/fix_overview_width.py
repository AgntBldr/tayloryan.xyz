import os

def fix_width():
    file_path = r'c:\Users\tempv2\Desktop\PortfolioAgent\quest_portfolio.html'
    
    with open(file_path, 'r', encoding='utf-8') as f:
        lines = f.readlines()
        
    new_lines = []
    replacement_done = False
    
    target_str = 'class="hidden w-full max-w-7xl mx-auto pb-12 transition-opacity duration-300 opacity-0 relative z-10">'
    new_str = 'class="hidden w-full max-w-4xl mx-auto pb-12 transition-opacity duration-300 opacity-0 relative z-10">'
    
    for i, line in enumerate(lines):
        # Fix the width
        if not replacement_done and target_str in line and 'id="overview-view"' in lines[i-1]:
            new_lines.append(line.replace('max-w-7xl', 'max-w-4xl'))
            replacement_done = True
        else:
            new_lines.append(line)
            
        # Fix duplicate ID if found right after
        if replacement_done and i < len(lines)-1:
             # Check next line for duplicate ID
             # Actually, simpler to just replace line by line
             pass

    # Let's do a second pass or just handle it in the loop
    # Re-process for the inner ID
    
    final_lines = []
    inner_id_fixed = False
    
    for line in new_lines:
        if not inner_id_fixed and '<div id="overview-view" class="view-section' in line:
            final_lines.append(line.replace('id="overview-view"', 'id="overview-content"'))
            inner_id_fixed = True
        else:
            final_lines.append(line)

    with open(file_path, 'w', encoding='utf-8') as f:
        f.writelines(final_lines)
        
    print("Fixed container width and duplicate ID.")

if __name__ == "__main__":
    fix_width()
