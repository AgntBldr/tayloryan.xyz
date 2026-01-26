
import docx
import os

doc_path = r"Ref Docs\Work\Public Speaking\Speaker Engagement Columns Defined .docx"

def read_docx(path):
    if not os.path.exists(path):
        print(f"File not found: {path}")
        return

    try:
        doc = docx.Document(path)
        print(f"--- Content of {path} ---")
        for para in doc.paragraphs:
            if para.text.strip():
                print(para.text)
        print("--- End of Content ---")
    except Exception as e:
        print(f"Error reading docx: {e}")

if __name__ == "__main__":
    read_docx(doc_path)
