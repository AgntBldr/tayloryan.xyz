
import zipfile
import re
import xml.etree.ElementTree as ET

def get_docx_text(path):
    try:
        with zipfile.ZipFile(path) as docx:
            xml_content = docx.read('word/document.xml')
            tree = ET.fromstring(xml_content)
            
            # XML namespaces
            ns = {'w': 'http://schemas.openxmlformats.org/wordprocessingml/2006/main'}
            
            text = []
            for p in tree.findall('.//w:p', ns):
                p_text = []
                for t in p.findall('.//w:t', ns):
                    if t.text:
                        p_text.append(t.text)
                text.append(''.join(p_text))
            
            return '\n'.join(text)
    except Exception as e:
        return str(e)

file_path = r"c:\Users\tempv2\Desktop\PortfolioAgent\Ref Docs\Writing\V1Overview & Summary - Quest Portfolio (3).docx"
print(get_docx_text(file_path))
