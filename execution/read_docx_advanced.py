
import zipfile
import re
import xml.etree.ElementTree as ET

def get_docx_text_with_links(path):
    try:
        with zipfile.ZipFile(path) as docx:
            # 1. Parse Relationships to get URLs
            rels_xml = docx.read('word/_rels/document.xml.rels')
            rels_tree = ET.fromstring(rels_xml)
            rels_ns = {'r': 'http://schemas.openxmlformats.org/package/2006/relationships'}
            
            # Map r:Id to Target (URL)
            # Relationship tag usually looks like <Relationship Id="rId1" Type="..." Target="http://..." />
            hyperlinks = {}
            for rel in rels_tree.findall('{http://schemas.openxmlformats.org/package/2006/relationships}Relationship'):
                if 'pyperlink' in rel.get('Type', '') or 'hyperlink' in rel.get('Type', ''): # Check type usually
                     hyperlinks[rel.get('Id')] = rel.get('Target')
                # Actually, check all targets if they look like http
                if rel.get('Target', '').startswith('http'):
                     hyperlinks[rel.get('Id')] = rel.get('Target')

            # 2. Parse Document content
            xml_content = docx.read('word/document.xml')
            tree = ET.fromstring(xml_content)
            
            # XML namespaces - strict matching often requires exact URI
            # But ElementTree default ignoring namespace if you use wildcards or strip them.
            # Let's use simple string searching or strip namespaces for easier parsing if strictly needed, 
            # but keeping it robust with proper checking.
            
            # The structure is w:p -> w:r -> w:t (text)
            # OR w:p -> w:hyperlink (r:id) -> w:r -> w:t
            
            ns = {
                'w': 'http://schemas.openxmlformats.org/wordprocessingml/2006/main',
                'r': 'http://schemas.openxmlformats.org/officeDocument/2006/relationships'
            }
            
            full_text = []
            
            for p in tree.findall('.//w:p', ns):
                paragraph_content = []
                
                # Iterate through all children of p to maintain order (runs and hyperlinks mixed)
                for child in p:
                    tag = child.tag
                    # If it's a Run <w:r>
                    if tag.endswith('}r'):
                        t = child.find('.//w:t', ns)
                        if t is not None and t.text:
                            paragraph_content.append(t.text)
                    
                    # If it's a Hyperlink <w:hyperlink>
                    elif tag.endswith('}hyperlink'):
                        rid = child.get('{http://schemas.openxmlformats.org/officeDocument/2006/relationships}id')
                        url = hyperlinks.get(rid, '')
                        
                        # Get text inside hyperlink
                        link_text_list = []
                        for sub_r in child.findall('.//w:r', ns):
                            t = sub_r.find('.//w:t', ns)
                            if t is not None and t.text:
                                link_text_list.append(t.text)
                        
                        link_text = "".join(link_text_list)
                        if url:
                            paragraph_content.append(f'[{link_text}]({url})') # Markdown style for now
                        else:
                            paragraph_content.append(link_text)
                            
                full_text.append("".join(paragraph_content))
            
            return '\n'.join(full_text)

    except Exception as e:
        return f"Error: {str(e)}"

file_path = r"c:\Users\tempv2\Desktop\PortfolioAgent\Ref Docs\Writing\V1Overview & Summary - Quest Portfolio (3).docx"
content = get_docx_text_with_links(file_path)

with open(r"c:\Users\tempv2\Desktop\PortfolioAgent\Ref Docs\Writing\ref_overview_v3_with_links.txt", "w", encoding="utf-8") as f:
    f.write(content)
