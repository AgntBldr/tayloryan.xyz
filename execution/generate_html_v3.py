
import re

def generate_html_v3():
    input_path = r"c:\Users\tempv2\Desktop\PortfolioAgent\Ref Docs\Writing\ref_overview_v3_with_links.txt"
    output_path = r"c:\Users\tempv2\Desktop\PortfolioAgent\execution\generated_overview_v3.html"
    
    with open(input_path, 'r', encoding='utf-8') as f:
        lines = [l.strip() for l in f.readlines()]
        
    html_parts = []
    
    # 1. Preamble
    html_parts.append('<div class="max-w-3xl mx-auto text-neutral-300 font-sans leading-relaxed py-10 px-6 blog-content">')
    
    line_idx = 0
    
    # Title
    if line_idx < len(lines):
        html_parts.append(f'<h1 class="text-4xl md:text-5xl font-bold text-white mb-8 text-center leading-tight tracking-tight">{lines[line_idx]}</h1>')
        line_idx += 1
        
    # Intro
    while line_idx < len(lines) and lines[line_idx] != "Overview":
        if lines[line_idx]:
             # Link conversion
            line = re.sub(r'\[(.*?)\]\((.*?)\)', r'<a href="\2" target="_blank" class="text-purple-400 hover:text-purple-300 underline underline-offset-4 decoration-purple-500/30 transition-colors font-medium">\1</a>', lines[line_idx])
            html_parts.append(f'<p class="text-neutral-300 mb-6 text-lg leading-relaxed">{line}</p>')
        line_idx += 1
        
    # TOC Extraction
    toc_items = []
    if line_idx < len(lines) and lines[line_idx] == "Overview":
        # Skip "Overview" line
        line_idx += 1
        
        while line_idx < len(lines):
            line = lines[line_idx]
            if not line: 
                line_idx += 1
                continue
                
            # Stop at the first real H2 header
            if line.startswith("What Are Quests"):
                break
                
            if "Resources:" in line: # Stop before resources list in intro?
                 line_idx += 1
                 continue

            # Parse TOC line
            # "Project Discovery - Strong fit..."
            parts = line.split(" - ", 1)
            main = parts[0].strip()
            desc = parts[1].strip() if len(parts) > 1 else ""
            
            anchor = re.sub(r'[^a-z0-9]+', '-', main.lower()).strip('-')
            toc_items.append((main, desc, anchor))
            
            line_idx += 1
            
    # Render TOC
    html_parts.append('<h2 id="overview" class="text-2xl font-bold text-white mt-12 mb-6 pt-8 border-t border-neutral-800/50">Overview</h2>')
    html_parts.append('<div class="bg-neutral-900/50 p-6 rounded-xl border border-neutral-800 mb-8">')
    html_parts.append('<ul class="space-y-4">')
    for main, desc, anchor in toc_items:
        html_parts.append('  <li class="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-2">')
        html_parts.append(f'    <a href="#{anchor}" class="text-purple-400 hover:text-purple-300 font-medium hover:underline decoration-purple-500/30 transition-colors shrink-0">{main}</a>')
        if desc:
            html_parts.append(f'    <span class="text-neutral-500 text-sm hidden sm:inline">- {desc}</span>')
        html_parts.append('  </li>')
    html_parts.append('</ul></div>')
    
    # Establish known H2s from TOC + Others
    known_h2s = set([t[0] for t in toc_items])
    known_h2s.add("Overview")
    known_h2s.add("What Are Quests?")
    known_h2s.add("Why Quests Matter")
    known_h2s.add("How I Build Quests") # Note casing in text file
    known_h2s.add("Resources")
    known_h2s.add("Conclusion")
    known_h2s.add("Monitoring")
    known_h2s.add("My Repeatable Quest Launch System")
    
    # Helper to check if line is H2
    def is_h2(txt):
        clean = txt.replace(":", "").strip()
        # Check exact match or if it's in known
        if clean in known_h2s: return True
        # Check fuzzy match against TOC
        for h in known_h2s:
            if h.lower() == clean.lower(): return True
        return False
        
    current_list = False
    
    while line_idx < len(lines):
        line = lines[line_idx]
        if not line:
            if current_list:
                html_parts.append('</ul>')
                current_list = False
            line_idx += 1
            continue
            
        # Parse Links
        line_html = re.sub(r'\[(.*?)\]\((.*?)\)', r'<a href="\2" target="_blank" class="text-purple-400 hover:text-purple-300 underline underline-offset-4 decoration-purple-500/30 transition-colors font-medium">\1</a>', line)
        
        # Classification
        clean_text = line.replace(":", "").strip()
        
        # H2 check
        if is_h2(line):
            if current_list:
                html_parts.append('</ul>')
                current_list = False
            
            anchor = re.sub(r'[^a-z0-9]+', '-', clean_text.lower()).strip('-')
            html_parts.append(f'<h2 id="{anchor}" class="text-2xl font-bold text-white mt-12 mb-6 pt-8 border-t border-neutral-800/50">{line_html}</h2>')
            
        # H3 check
        elif line.endswith(":") or line.startswith("Example") or (len(line) < 50 and not "." in line and not " - " in line):
            # Short lines without dashes or periods are likely headers
            if current_list:
                html_parts.append('</ul>')
                current_list = False
            
            html_parts.append(f'<h3 class="text-xl font-bold text-white mt-8 mb-4">{line_html}</h3>')
            
        # List Item check
        elif " - " in line or line.startswith("- "):
            if not current_list:
                html_parts.append('<ul class="list-disc pl-5 space-y-3 mb-8 marker:text-purple-500">')
                current_list = True
            
            # Use line_html for content to preserve links
            content = line_html
            if content.startswith("- "): 
                content = content[2:]
            
            # Bold processing for "Title - Description" format
            # we use the link-converted string here.
            if " - " in content and not content.startswith("<a"): # Avoid breaking links if they start the line? 
                 # actually, if the line starts with a link, we might still want to bold it.
                 # The user's format is "Title - Description". Title might be a link.
                 parts = content.split(" - ", 1)
                 content = f'<strong class="text-white font-bold">{parts[0]}</strong> - {parts[1]}'
            
            html_parts.append(f'<li class="pl-2 text-neutral-300">{content}</li>')
            
        # Fallback: Paragraph
        else:
            if current_list:
                html_parts.append('</ul>')
                current_list = False
            html_parts.append(f'<p class="text-neutral-300 mb-6 text-lg leading-relaxed">{line_html}</p>')

        line_idx += 1
        
    if current_list:
        html_parts.append('</ul>')
    
    html_parts.append('</div>')
    
    with open(output_path, 'w', encoding='utf-8') as f:
        f.write('\n'.join(html_parts))
        
generate_html_v3()
