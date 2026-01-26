
import re

def convert_to_html(text_path, output_path):
    with open(text_path, 'r', encoding='utf-8') as f:
        lines = f.readlines()

    html_parts = []
    
    # Header
    html_parts.append('<div class="max-w-3xl mx-auto text-neutral-300 font-sans leading-relaxed py-10 px-6 blog-content">')
    
    line_idx = 0
    
    # Title
    if line_idx < len(lines):
        title = lines[line_idx].strip()
        html_parts.append(f'<h1 class="text-4xl md:text-5xl font-bold text-white mb-8 text-center leading-tight tracking-tight">{title}</h1>')
        line_idx += 1

    # Intro paragraphs (until "Overview")
    while line_idx < len(lines):
        line = lines[line_idx].strip()
        if not line:
            line_idx += 1
            continue
        if line.startswith("Overview"):
            break
        
        # Convert links
        line = re.sub(r'\[(.*?)\]\((.*?)\)', r'<a href="\2" target="_blank" class="text-purple-400 hover:text-purple-300 underline underline-offset-4 decoration-purple-500/30 transition-colors font-medium">\1</a>', line)
        
        html_parts.append(f'<p class="text-neutral-300 mb-6 text-lg leading-relaxed">{line}</p>')
        line_idx += 1

    # Table of Contents (Overview)
    if line_idx < len(lines) and lines[line_idx].strip().startswith("Overview"):
        html_parts.append('<h2 id="overview" class="text-2xl font-bold text-white mt-12 mb-6 pt-8 border-t border-neutral-800/50">Overview</h2>')
        html_parts.append('<div class="bg-neutral-900/50 p-6 rounded-xl border border-neutral-800 mb-8">')
        html_parts.append('<ul class="space-y-4">')
        line_idx += 1
        
        while line_idx < len(lines):
            line = lines[line_idx].strip()
            if not line:
                line_idx += 1
                continue
            
            # Use headers as stop condition for TOC if they look like headers below
            # Or heuristics: if line is empty or "Resources:" starts
            if line.startswith("Resources:") or line.startswith("All Quest Resources"):
                break
            
            if line.startswith("What Are Quests?"): # Header further down
                break

            # TOC Item
            # "What Are Quests - What it is" -> Link to "what-are-quests"
            # "On and Off-chain" -> Indented?
            
            # Simple heuristic: Split by " - " first part is link text and ID source
            parts = line.split(" - ", 1)
            main_text = parts[0].strip()
            desc_text = parts[1].strip() if len(parts) > 1 else ""
            
            anchor_id = re.sub(r'[^a-z0-9]+', '-', main_text.lower()).strip('-')
            
            html_parts.append('  <li class="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-2">')
            html_parts.append(f'    <a href="#{anchor_id}" class="text-purple-400 hover:text-purple-300 font-medium hover:underline decoration-purple-500/30 transition-colors shrink-0">{main_text}</a>')
            if desc_text:
                html_parts.append(f'    <span class="text-neutral-500 text-sm hidden sm:inline">- {desc_text}</span>')
            html_parts.append('  </li>')
            
            line_idx += 1
        
        html_parts.append('</ul>')
        html_parts.append('</div>')

    # Main Content
    current_list_type = None # None, ul
    
    while line_idx < len(lines):
        line = lines[line_idx].strip()
        
        if not line:
            if current_list_type == 'ul':
                html_parts.append('</ul>')
                current_list_type = None
            line_idx += 1
            continue

        # Convert Markdown Links
        line = re.sub(r'\[(.*?)\]\((.*?)\)', r'<a href="\2" target="_blank" class="text-purple-400 hover:text-purple-300 underline underline-offset-4 decoration-purple-500/30 transition-colors font-medium">\1</a>', line)

        # Detect Lists with " - " ONLY if it's item list style or matches bullets
        # A simple "-" at start is bullet. 
        # But this file format is weird: "Project Discovery - Strong fit shortlist..."
        # And sometimes it's just headers.
        
        # Heuristics:
        # If line is short and has no " - ", it's likely a header or just a paragraph header.
        # If line has " - " and is part of a group, it's a list.
        # "Resources:" is a header.
        
        is_header = False
        # Check against known headers or pattern
        if (len(line) < 60 and not " - " in line and not line.endswith('.')) or line.endswith(":") or "?" in line:
             is_header = True
        
        if is_header:
            if current_list_type == 'ul':
                html_parts.append('</ul>')
                current_list_type = None
            
            anchor_id = re.sub(r'[^a-z0-9]+', '-', line.replace(":", "").replace("?", "").lower()).strip('-')
            html_parts.append(f'<h2 id="{anchor_id}" class="text-2xl font-bold text-white mt-12 mb-6 pt-8 border-t border-neutral-800/50">{line}</h2>')
        elif " - " in line or line.startswith("- "): # Treat as list item if it looks like one
            if current_list_type != 'ul':
                html_parts.append('<ul class="list-disc pl-5 space-y-3 mb-8 marker:text-purple-500">')
                current_list_type = 'ul'
            
            # Clean up leading "-" if present
            content_line = line.lstrip("- ").strip()
            
            # Bold the part before the dash if applicable
            if " - " in content_line and not content_line.startswith("<a"):
                parts = content_line.split(" - ", 1)
                content_line = f'<strong class="text-white font-bold">{parts[0]}</strong> - {parts[1]}'
            
            html_parts.append(f'<li class="pl-2 text-neutral-300">{content_line}</li>')
        else:
            if current_list_type == 'ul':
                html_parts.append('</ul>')
                current_list_type = None
            html_parts.append(f'<p class="text-neutral-300 mb-6 text-lg leading-relaxed">{line}</p>')

        line_idx += 1

    if current_list_type == 'ul':
        html_parts.append('</ul>')

    html_parts.append('</div>')
    
    with open(output_path, 'w', encoding='utf-8') as f:
        f.write('\n'.join(html_parts))

convert_to_html(
    r"c:\Users\tempv2\Desktop\PortfolioAgent\Ref Docs\Writing\ref_overview_v3_with_links.txt",
    r"c:\Users\tempv2\Desktop\PortfolioAgent\execution\generated_overview_v2.html"
)
