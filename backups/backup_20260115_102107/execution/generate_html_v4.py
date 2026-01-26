import re
import os

def generate_html_v4(markdown_path, output_path):
    with open(markdown_path, 'r', encoding='utf-8') as f:
        md_content = f.read()

    html_parts = []
    
    # --- 1. Image Mapping Strategy ---
    # The markdown uses reference style images like ![][image1] and defined like [image1]: <data:...> or just placeholders.
    # We know the files are named overview_image_1.png, etc.
    # We will look for ![...][imageN] or similar patterns and replace with <img> tags.
    
    # 2. Parse Line by Line state machine
    lines = md_content.split('\n')
    
    in_list = False
    
    # HTML Header for the view
    html_parts.append('<div id="overview-view" class="view-section active space-y-8 animate-fade-in custom-scrollbar">')
    
    # Title Section (Manually constructed from the first few lines often)
    # But let's parse the MD properly.
    
    iterator = iter(lines)
    
    for line in iterator:
        stripped = line.strip()
        
        # Skip empty lines, but close lists if needed
        if not stripped:
            if in_list:
                html_parts.append('</ul>')
                in_list = False
            continue

        # --- Headers ---
        if stripped.startswith('# '):
            # H1 - Title
            content = stripped[2:].strip()
            # Remove bolding ** if present in title
            content = content.replace('**', '')
            html_parts.append(f'<div class="text-center mb-12"><h1 class="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600 mb-6">{content}</h1><div class="h-1 w-32 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto rounded-full"></div></div>')
            continue
            
        if stripped.startswith('## '):
            if in_list:
                html_parts.append('</ul>')
                in_list = False
            content = stripped[3:].strip()
            content = content.replace('**', '')
            anchor_id = content.lower().replace(' ', '-').replace('?', '').replace('!', '')
            html_parts.append(f'<h2 id="{anchor_id}" class="text-3xl font-bold text-white mt-12 mb-6 flex items-center"><span class="w-2 h-8 bg-blue-500 rounded-sm mr-4"></span>{content}</h2>')
            continue
            
        if stripped.startswith('### '):
            if in_list:
                html_parts.append('</ul>')
                in_list = False
            content = stripped[4:].strip()
            content = content.replace('**', '')
             # Formatting links inside headers if any
            content = format_links(content)
            html_parts.append(f'<h3 class="text-xl font-bold text-blue-300 mt-8 mb-4">{content}</h3>')
            continue
            
        # --- Images ---
        # Pattern: ![][imageX] or ![alt][imageX]
        img_match = re.search(r'!\[(.*?)\]\[image(\d+)\]', stripped)
        if img_match:
            if in_list:
                html_parts.append('</ul>')
                in_list = False
            
            img_num = img_match.group(2)
            # Map standard numbers to our filenames. 
            # Note: User's previous files were overview_image_1.png etc.
            # We assume image1 maps to overview_image_1.png
            
            # Special handling for "Image 18" if referenced as image18 or similar
            # The user file list has overview_image_1.png to 18.
            
            img_src = f"assets/overview/overview_image_{img_num}.png"
            
            html_parts.append(f'<div class="my-8 rounded-xl overflow-hidden shadow-2xl border border-white/10 group"><img src="{img_src}" alt="Overview Image {img_num}" class="w-full h-auto transform group-hover:scale-105 transition-transform duration-700"></div>')
            continue

        # --- Lists (Bullets) ---
        if stripped.startswith('* ') or stripped.startswith('- '):
            if not in_list:
                html_parts.append('<ul class="space-y-3 mb-6 ml-4">')
                in_list = True
            
            content = stripped[2:].strip()
            
            # Helper to bold keys: "**Key** - Value" -> "<strong>Key</strong> - Value"
            content = format_bold_keys(content)
            content = format_links(content)
            
            html_parts.append(f'<li class="flex items-start"><span class="text-blue-400 mr-2 mt-1.5">•</span><span class="text-gray-300 pointer-events-auto">{content}</span></li>')
            continue

        # --- Paragraphs ---
        # If it's not a header, image, or list, it's a paragraph.
        # But check if it's the reference link definition at bottom e.g. [image1]: ...
        if re.match(r'\[image\d+\]:', stripped):
            continue

        if in_list:
            html_parts.append('</ul>')
            in_list = False
            
        # Apply formatting
        content = format_bold_keys(stripped) # Bolding might happen in paragraphs too
        content = format_links(content)
        
        # Check for standalone bold lines which might act as mini-headers
        if stripped.startswith('**') and stripped.endswith('**') and len(stripped) < 100:
             content = stripped.replace('**', '')
             html_parts.append(f'<h4 class="text-lg font-bold text-white mt-6 mb-3">{content}</h4>')
        else:
             html_parts.append(f'<p class="text-gray-300 leading-relaxed mb-6 text-lg">{content}</p>')

    if in_list:
        html_parts.append('</ul>')

    # Append the Overview Charts Container with UNIQUE IDs and Clean Styling
    html_parts.append("""
        <!-- Overview Charts Section -->
        <div class="mt-12 p-8 bg-neutral-900 border border-neutral-800 rounded-xl">
            <h2 class="text-3xl font-bold text-white mb-6">Performance Overview</h2>
            <!-- KPI Grid -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div class="bg-neutral-800/30 p-6 rounded-xl border border-neutral-800">
                    <div class="text-neutral-500 text-sm mb-1 uppercase tracking-wider">Total Quests</div>
                    <div class="text-3xl font-bold text-white font-mono" id="ov-kpi-quests">-</div>
                </div>
                <div class="bg-neutral-800/30 p-6 rounded-xl border border-neutral-800">
                    <div class="text-neutral-500 text-sm mb-1 uppercase tracking-wider">Total Activations</div>
                    <div class="text-3xl font-bold text-gradient bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600 font-mono" id="ov-kpi-activations">-</div>
                </div>
                <div class="bg-neutral-800/30 p-6 rounded-xl border border-neutral-800">
                    <div class="text-neutral-500 text-sm mb-1 uppercase tracking-wider">Top Project</div>
                    <div class="text-xl font-bold text-white truncate" id="ov-kpi-top">-</div>
                    <div class="text-xs text-green-400 mt-1" id="ov-kpi-top-val">-</div>
                </div>
            </div>

            <!-- Charts Grid -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                <div class="bg-neutral-800/30 p-6 rounded-xl border border-neutral-800">
                    <h3 class="text-lg font-bold text-white mb-4 flex items-center gap-2">
                        <i data-lucide="layout-grid" class="w-4 h-4 text-purple-500"></i> Quests by Environment
                    </h3>
                    <div class="h-64 relative">
                        <canvas id="chart-overview-dist"></canvas>
                    </div>
                </div>
                <!-- Timeline Mirror -->
                 <div class="bg-neutral-800/30 p-6 rounded-xl border border-neutral-800">
                    <h3 class="text-lg font-bold text-white mb-4 flex items-center gap-2">
                        <i data-lucide="activity" class="w-4 h-4 text-green-500"></i> Publishing Activity
                    </h3>
                    <div class="h-64 relative">
                        <canvas id="chart-overview-timeline"></canvas>
                    </div>
                </div>
            </div>
            
             <!-- Performance Table Mirror -->
            <div class="bg-neutral-800/30 p-6 rounded-xl border border-neutral-800 overflow-hidden">
                <h3 class="text-lg font-bold text-white mb-4 flex items-center gap-2">
                    <i data-lucide="trophy" class="w-4 h-4 text-yellow-500"></i> Performance Breakdown
                </h3>
                <div class="overflow-x-auto">
                    <table class="w-full">
                        <thead>
                            <tr class="text-left border-b border-neutral-700 text-neutral-500 text-sm uppercase tracking-wider">
                                <th class="px-6 py-3 font-medium">Quest</th>
                                <th class="px-6 py-3 font-medium">Theme</th>
                                <th class="px-6 py-3 font-medium">Environment</th>
                                <th class="px-6 py-3 text-right font-medium">Activations</th>
                            </tr>
                        </thead>
                        <tbody id="ov-analytics-table-body" class="divide-y divide-neutral-800">
                            <!-- Populated by JS -->
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    """)

    html_parts.append('</div>')
    
    return '\n'.join(html_parts)

def format_bold_keys(text):
    # Replace **Text** with <strong class="text-white">Text</strong>
    return re.sub(r'\*\*(.*?)\*\*', r'<strong class="text-white">\1</strong>', text)

def format_links(text):
    # Replace [Text](URL) with <a ...>Text</a>
    # Use generic regex
    def link_repl(match):
        text = match.group(1)
        url = match.group(2)
        # Check if internal anchor link
        if url.startswith('#'):
             return f'<a href="{url}" class="text-blue-400 hover:text-blue-300 transition-colors border-b border-blue-400/30 hover:border-blue-300">{text}</a>'
        return f'<a href="{url}" target="_blank" rel="noopener noreferrer" class="text-blue-400 hover:text-blue-300 transition-colors border-b border-blue-400/30 hover:border-blue-300">{text}</a>'
    
    return re.sub(r'\[(.*?)\]\((.*?)\)', link_repl, text)

# --- Execution ---
if __name__ == "__main__":
    base_dir = r"c:\Users\tempv2\Desktop\PortfolioAgent"
    md_file = os.path.join(base_dir, "Ref Docs", "Writing", "V1Overview & Summary - Quest Portfolio(4).md")
    out_file = os.path.join(base_dir, "execution", "generated_overview_v4.html")
    
    html_content = generate_html_v4(md_file, out_file)
    
    with open(out_file, 'w', encoding='utf-8') as f:
        f.write(html_content)
    
    print(f"Generated HTML v4 at {out_file}")
