
import os

def patch_portfolio():
    html_path = r"c:\Users\tempv2\Desktop\PortfolioAgent\quest_portfolio.html"
    new_content_path = r"c:\Users\tempv2\Desktop\PortfolioAgent\execution\generated_overview_v4.html"
    
    if not os.path.exists(html_path):
        print(f"Error: {html_path} not found")
        return
        
    if not os.path.exists(new_content_path):
        print(f"Error: {new_content_path} not found")
        return

    with open(html_path, 'r', encoding='utf-8') as f:
        original_lines = f.readlines()
        
    with open(new_content_path, 'r', encoding='utf-8') as f:
        new_lines = f.readlines()
        
    # Indent new lines
    indented_new_lines = ["        " + line for line in new_lines]
    
    # 1. Find the OPENING tag of #overview-view
    start_tag_idx = -1
    for i, line in enumerate(original_lines):
        if 'id="overview-view"' in line:
            start_tag_idx = i
            break
            
    if start_tag_idx == -1:
        print("Error: Could not find id='overview-view' in HTML")
        return

    # 2. Find the CLOSING tag responsible for that div
    # We count <div> and </div>
    # The start_tag_idx line contains the first <div (id="overview-view"...)
    
    current_idx = start_tag_idx
    div_balance = 0
    found_end = False
    end_tag_idx = -1
    
    for i in range(start_tag_idx, len(original_lines)):
        line = original_lines[i]
        
        # Simple counting logic
        # Count occurrences. Note: This assumes well-formed HTML where div tags don't span lines awkwardly, 
        # or at least standard formatting.
        open_count = line.count('<div')
        close_count = line.count('</div>')
        
        div_balance += (open_count - close_count)
        
        if div_balance == 0:
            end_tag_idx = i
            found_end = True
            break
            
    if not found_end:
        print("Error: Could not find matching closing div for overview-view")
        # Fallback: maybe just replace everything after start until end of file? No that's dangerous.
        return

    print(f"Found #overview-view block from line {start_tag_idx+1} to {end_tag_idx+1}")
    
    # We want to keep the OPENING line and the CLOSING line, but replace what's INSIDE.
    # Actually, generated_overview_v4.html contains content *inside* the wrapper (it doesn't have the wrapper itself? Wait.)
    # generate_html_v4.py:
    #   html_parts.append('<div id="overview-view" class="view-section active ...">')
    # It generates the *inner* div?
    # Let's check generate_html_v4.py output structure.
    # Step 501: html_parts.append('<div id="overview-view" class="view-section active space-y-8 animate-fade-in custom-scrollbar">')
    # So it DOES generate a div with id="overview-view".
    
    # In quest_portfolio.html, we have:
    # <div id="overview-view" class="hidden ... relative z-10"> (Outer wrapper handling visibility)
    #    <div id="overview-view" class="view-section ..."> (Inner content from generator)
    
    # So we want to replace the INNER content of the OUTER div.
    # The OUTER div lines are start_tag_idx and end_tag_idx.
    
    # We will slice:
    # [0 ... start_tag_idx] (Include the outer opening tag)
    # + indented_new_lines (The generated content, which includes its own inner div wrapper)
    # + [end_tag_idx ... end] (Include the outer closing tag)
    
    # Wait, if `generated_overview_v4` STARTS with `<div id="overview-view"...`, do we want nested IDs?
    # Ideally no, but the CSS/JS might rely on the outer one for toggling and inner for styling.
    # Let's keep it nested but maybe rename the inner ID if possible, or just accept duplicate IDs for now (browsers handle it, JS usually picks first).
    # Actually, `switchView` toggles the element with ID. If we have two, `getElementById` picks the *first*.
    # The OUTER one is first. So `switchView` toggles the outer one.
    # The INNER one having the same ID is confusing but harmless for visibility toggling if the outer one is targeted.
    # However, to be clean, we should probably strip the ID from the generated content or change it.
    # But for now, let's just insert it.
    
    # Resulting structure:
    # <div id="overview-view" class="hidden..."> (Outer)
    #      <div id="overview-view" class="view-section..."> (Generated)
    #           ... content ...
    #      </div>
    # </div>
    
    final_lines = original_lines[:start_tag_idx+1] + indented_new_lines + original_lines[end_tag_idx:]
    
    with open(html_path, 'w', encoding='utf-8') as f:
        f.writelines(final_lines)
        
    print("Successfully patched quest_portfolio.html with robust logic.")

if __name__ == "__main__":
    patch_portfolio()
