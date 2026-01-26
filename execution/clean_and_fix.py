
import os

file_path = r"c:\Users\tempv2\Desktop\PortfolioAgent\quest_portfolio.html"
new_content_path = r"c:\Users\tempv2\Desktop\PortfolioAgent\execution\new_overview_content.html"

def analyze_and_fix():
    if not os.path.exists(file_path):
        print(f"Error: {file_path} not found.")
        return

    with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
        lines = f.readlines()

    print(f"Total lines: {len(lines)}")

    script_end_line = -1
    body_end_line = -1
    html_end_line = -1
    overview_view_line = -1
    analytics_view_line = -1
    garbage_start_line = -1
    quest_grid_line = -1

    # Read new content
    with open(new_content_path, 'r', encoding='utf-8') as f:
        new_overview_content = f.read()

    # Analyze file structure
    for i, line in enumerate(lines):
        if '</script>' in line:
            script_end_line = i
        if '</body>' in line:
            body_end_line = i
        if '</html>' in line:
            html_end_line = i
        if 'id="overview-view"' in line:
            # We want the OUTER one. The one with class="hidden...".
            if 'hidden' in line:
                overview_view_line = i
        if 'id="analytics-view"' in line:
            analytics_view_line = i
        if 'id="quest-grid"' in line:
            quest_grid_line = i

        
        # Detect garbage start (WordToHTML footer or specific garbage content)
        if 'WordToHTML.net' in line or '<h3><strong><span>My Results</span></strong></h3>' in line:
            if garbage_start_line == -1:
                garbage_start_line = i

    print(f"Script end: {script_end_line}")
    print(f"Body end: {body_end_line}")
    print(f"HTML end: {html_end_line}")
    print(f"Overview view: {overview_view_line}")
    print(f"Analytics view: {analytics_view_line}")
    print(f"Garbage start: {garbage_start_line}")

    # Fix Phase
    new_lines = []
    
    # We want to reconstruct the file.
    # If HTML end is found, we truncate everything after it.
    cutoff_line = html_end_line if html_end_line != -1 else len(lines)
    
    # If garbage starts before HTML end (unlikely for valid HTML but possible if pasted inside), handle it.
    if garbage_start_line != -1 and garbage_start_line < cutoff_line:
        # If garbage is inside, we might need to cut it out.
        # But for now, let's assume garbage is appended AT THE END.
        pass

    # Basic Truncation Strategy:
    # Keep lines up to the last closing tag.
    # If script end is found but body/html missing, append them.
    
    final_lines = lines[:cutoff_line+1] # Include the </html> line
    
    # FIX MISSING ANALYTICS VIEW
    if analytics_view_line == -1:
        print("Fixing missing analytics-view...")
        # Create a basic analytics view placeholder
        analytics_block = """
    <!-- ANALYTICS VIEW -->
    <div id="analytics-view" class="hidden w-full max-w-7xl mx-auto pb-12 transition-opacity duration-300 opacity-0 relative z-10">
        <div class="p-8 bg-neutral-900 border border-neutral-800 rounded-xl">
            <h2 class="text-3xl font-bold text-white mb-6">Analytics Dashboard</h2>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <!-- KPI Cards -->
                <div class="bg-neutral-800/50 p-6 rounded-lg border border-neutral-700">
                    <h3 class="text-neutral-400 text-sm uppercase tracking-wider mb-2">Total Quests</h3>
                    <p class="text-4xl font-bold text-white" id="kpi-quests">-</p>
                </div>
                <div class="bg-neutral-800/50 p-6 rounded-lg border border-neutral-700">
                    <h3 class="text-neutral-400 text-sm uppercase tracking-wider mb-2">Total Activations</h3>
                    <p class="text-4xl font-bold text-white" id="kpi-activations">-</p>
                </div>
                <div class="bg-neutral-800/50 p-6 rounded-lg border border-neutral-700">
                    <h3 class="text-neutral-400 text-sm uppercase tracking-wider mb-2">Top Performer</h3>
                    <p class="text-xl font-bold text-white truncate" id="kpi-top">-</p>
                    <p class="text-xs text-green-400 mt-1" id="kpi-top-val">-</p>
                </div>
            </div>
            <div class="text-center text-gray-500 py-12">
                Charts are initializing...
            </div>
        </div>
    </div>
"""
        # Insert it before the overview view if possible, or after quest-grid
        # Since we are iterating final_lines later, let's just insert it right before the overview-view line if we found it.
        # But indices will shift.
        # Strategy: We will do insertion in the `final_lines` list.
        
        # We need to find overview-view index in final_lines first.
        ov_idx_for_insert = -1
        for i, line in enumerate(final_lines):
             if 'id="overview-view"' in line:
                 ov_idx_for_insert = i
                 break
        
        if ov_idx_for_insert != -1:
            print(f"Inserting analytics-view before line {ov_idx_for_insert}")
            final_lines.insert(ov_idx_for_insert, analytics_block)
        else:
            # Append near script start if overview not found? Unlikely.
            print("Could not find insertion point for analytics-view. Appending before script.")
            # find script start
            for i, line in enumerate(final_lines):
                if '<script' in line:
                    final_lines.insert(i, analytics_block)
                    break

    # PATCH OVERVIEW CONTENT (Robust Replacement)
    # Finding the 'overview-view' line again in final_lines (indices might have shifted!)
    ov_idx = -1
    for i, line in enumerate(final_lines):
        if 'id="overview-view"' in line and 'class="hidden' in line: # Targeting the outer container
             ov_idx = i
             break
    
    if ov_idx != -1:
        print(f"Found outer overview-view at line {ov_idx}")
        # We replace the INNER content. The structure is:
        # <div id="overview-view" ...>
        #    <divid="overview-content" ...> ... </div>
        # </div>
        # We need to find the matching closing div for the OUTER container to preserve it,
        # OR just replace the inner part.
        # Given the mess, let's assume the outer div defines the tab.
        # We will replace everything INSIDE the outer div.
        
        # Simplified approach: Rewrite the whole overview section.
        # We construct the new overview block:
        new_overview_block = f"""    <div id="overview-view" class="hidden w-full max-w-4xl mx-auto pb-12 transition-opacity duration-300 opacity-0 relative z-10">
        <div id="overview-content" class="view-section active space-y-8 animate-fade-in custom-scrollbar">
{new_overview_content}
        </div>
    </div>
"""
        # Finds start and end of the OLD overview block.
        # We look for the start ov_idx.
        # We need to find the END. Indentation based.
        start_indent = len(final_lines[ov_idx]) - len(final_lines[ov_idx].lstrip())
        end_idx = -1
        for j in range(ov_idx + 1, len(final_lines)):
            curr_indent = len(final_lines[j]) - len(final_lines[j].lstrip())
            if curr_indent == start_indent and final_lines[j].strip() == '</div>':
                end_idx = j
                break
        
        if end_idx != -1:
            print(f"Replacing lines {ov_idx} to {end_idx}")
            final_lines[ov_idx:end_idx+1] = [new_overview_block]
        else:
            print("Could not find closing div for overview-view. Aborting patch.")
    
    # Write back to file
    with open(file_path, 'w', encoding='utf-8') as f:
        f.writelines(final_lines)
    print("File updated.")

if __name__ == "__main__":
    analyze_and_fix()
