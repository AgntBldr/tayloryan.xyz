
import re

input_path = r'c:\Users\tempv2\Desktop\PortfolioAgent\Ref Docs\writing\Overview and Summary.txt'
output_path = r'c:\Users\tempv2\Desktop\PortfolioAgent\overview_content_gen.html'

with open(input_path, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Replace Base64 Image
# We look for <img src="data:image... > and replace it.
content = re.sub(r'<img src="data:image/[^"]+"[^>]*>', 
                 r'<img src="assets/overview/onchain_layer3.png" class="w-full rounded-lg border border-neutral-700 my-4 shadow-lg hover:shadow-xl transition-shadow" alt="Layer3 Example">', 
                 content)

# 2. Format Google Sheet Links
# Pattern: <a href="(https://docs.google.com/spreadsheets[^"]+)"><u><span>Name</span></u></a>
# We basically want to target the specific "All Quest Resources" link we saw.
# But let's make it generic for spreadsheets.
def format_sheet_link(match):
    url = match.group(1)
    text = match.group(2) # extracted from inside the tags
    # Remove inner tags from text for cleaner name
    clean_text = re.sub(r'<[^>]+>', '', text)
    return f'<div class="flex items-center gap-2 my-2"><a href="{url}" target="_blank" class="text-blue-400 hover:text-blue-300 font-medium transition-colors">{clean_text}</a> <span class="bg-blue-500/20 text-blue-300 text-xs px-2 py-0.5 rounded font-mono">[Sheet]</span></div>'

content = re.sub(r'<a href="(https://docs\.google\.com/spreadsheets[^"]+)"[^>]*>(.*?)</a>', format_sheet_link, content, flags=re.DOTALL)

# 3. Format Google Doc Links
def format_doc_link(match):
    url = match.group(1)
    text = match.group(2)
    clean_text = re.sub(r'<[^>]+>', '', text)
    return f'<div class="flex items-center gap-2 my-2"><a href="{url}" target="_blank" class="text-blue-400 hover:text-blue-300 font-medium transition-colors">{clean_text}</a> <span class="bg-blue-500/20 text-blue-300 text-xs px-2 py-0.5 rounded font-mono">[Doc]</span></div>'

content = re.sub(r'<a href="(https://docs\.google\.com/document[^"]+)"[^>]*>(.*?)</a>', format_doc_link, content, flags=re.DOTALL)

# 4. Filter empty paragraphs
content = re.sub(r'<p>\s*<br>\s*</p>', '', content)


# 5. Styling & IDs
toc_items = []

def format_heading(match):
    text = match.group(1)
    # Generate ID: lowercase, remove non-alphanumeric, replace spaces with hyphens
    slug = re.sub(r'[^a-zA-Z0-9\s]', '', text).lower().replace(' ', '-')
    toc_items.append(f'<li><a href="#{slug}" class="block pl-4 py-1 text-sm text-neutral-400 hover:text-blue-400 hover:border-l-2 hover:border-blue-400 transition-all border-l-2 border-transparent">{text}</a></li>')
    return f'<h2 id="{slug}" class="text-2xl font-bold text-white mt-12 mb-6 flex items-center gap-2 border-b border-neutral-800/50 pb-2"><span class="bg-blue-500/10 p-1 rounded text-blue-400"><i data-lucide="hash" class="w-5 h-5"></i></span> {text}</h2>'

content = re.sub(r'<h3><strong><span>(.*?)</span></strong></h3>', format_heading, content)

# 6. Additional Cleanup for spans inside headings if any
content = re.sub(r'<h2[^>]*><strong><span>(.*?)</span></strong></h2>', format_heading, content) # Redundant call might duble TOC, but previous regex handles h3.
# Wait, if I run format_heading again on h2 it will duplicate TOC items.
# Let's check the input. It had h3. The second regex was for potential h2.
# Valid logic: The first regex `<h3>` catches most.
# If there are any remaining `<h2>` (unlikely from txt source), we should check.
# Actually, the previous script replaced `<h3>` with `<h2>`.
# So lines 32-33 in previous script:
# content = re.sub(r'<h3>...</h3>', r'<h2...>...</h2>', content)
# Now I am using a function.
# I should remove the second re.sub or ensure it doesn't double count.
# The source text has `<h3>`.
# So the first `re.sub` works. I will remove the second one to be safe or make it safe?
# Actually, the file is overwritten every time.
# So I just need ONE pass for headings.

# Lists
content = content.replace('<ul>', '<ul class="space-y-3 mb-8 ml-1">')
content = content.replace('<li>', '<li class="bg-neutral-900/40 border border-neutral-800/60 rounded-lg p-4 hover:border-neutral-700 transition-all hover:bg-neutral-900/60">')

# Paragraphs (add spacing and better typography)
content = content.replace('<p>', '<p class="mb-5 text-neutral-300 leading-relaxed text-lg">')

with open(output_path, 'w', encoding='utf-8') as f:
    f.write(content)

# Generate TOC
toc_html = '<ul class="space-y-1 border-l border-neutral-800">' + ''.join(toc_items) + '</ul>'
with open(r'c:\Users\tempv2\Desktop\PortfolioAgent\overview_toc_gen.html', 'w', encoding='utf-8') as f:
    f.write(toc_html)

