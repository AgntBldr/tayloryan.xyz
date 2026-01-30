import pandas as pd
import json
import os
import sys

def parse_some_work(file_path):
    print(f"Parsing SoMe Work from: {file_path}", file=sys.stderr)
    try:
        df = pd.read_excel(file_path, header=0)
        data = []
        
        for index, row in df.iterrows():
            # Gather all links
            links = []
            
            # Map of column to Label
            link_cols = {
                'URL to Landscape Media': 'Landscape',
                'URL to Square Media': 'Square',
                'URL to Vertical Media': 'Vertical',
                'Article / Resource Link': 'Article'
            }
            
            primary_url = ""
            
            for col, label in link_cols.items():
                val = row.get(col)
                if pd.notna(val) and str(val).strip().startswith('http'):
                     url = str(val).strip()
                     links.append({"label": label, "url": url})
                     if not primary_url: primary_url = url
            
            # If no links found at all, skip? Or keep as text-only post? 
            # User said "Any and all links". If none, maybe it's not a post to show.
            if not links:
                continue

            # Text Content
            # User wants "Post Text" (This is likely the caption/body)
            post_text = str(row.get('Post Text', '')).strip()
            if post_text == "nan": post_text = ""
            
            # Fallback description/summary
            summary = str(row.get('Summary', '')).strip()
            if summary == "nan": summary = ""
            
            # Title
            title = str(row.get('Title', '')).strip()
            if not title or title == "nan": 
                title = str(row.get('Post', 'Untitled Post')).strip() # Fallback to 'Post' column

            entry = {
                "title": title,
                "url": primary_url, # For card click
                "links": links,     # For modal
                "post_text": post_text,
                "summary": summary,
                "date": str(row.get('Date', '')).strip(),
                "category": str(row.get('Category', 'General')).strip(),
                "theme": str(row.get('Theme', '')).strip(),
                "industry": str(row.get('Industry', '')).strip(),
                "platform": str(row.get('Platform', 'Social Media')).strip(),
                "tags": str(row.get('Tags', '')).split(',') if pd.notna(row.get('Tags')) else [],
                "type": "Social Media"
            }
            
            # Cleanup 'nan'
            for k, v in entry.items():
                if v == "nan": entry[k] = ""
            
            data.append(entry)
            
        return data

    except Exception as e:
        print(f"Error parsing SoMe: {e}", file=sys.stderr)
        return []

def parse_video_work(file_path):
    print(f"Parsing Video Work from: {file_path}", file=sys.stderr)
    try:
        df = pd.read_excel(file_path, header=0)
        data = []
        
        for index, row in df.iterrows():
            title = str(row.get('Title', '')).strip()
            if not title or title == "nan": continue # skip empty titles
            
            url = str(row.get('URL', '')).strip()
            if not url or url == "nan" or not url.startswith('http'):
                 # Try 'Media' column if it's a link
                 media = str(row.get('Media', '')).strip()
                 if media.startswith('http'):
                     url = media
                 else:
                     continue
            
            # Extract Video ID
            video_id = ""
            if "v=" in url:
                video_id = url.split("v=")[1].split("&")[0]
            elif "youtu.be/" in url:
                video_id = url.split("youtu.be/")[1].split("?")[0]
            
            # Description
            desc = str(row.get('Description', '')).strip()
            if desc == "nan": desc = ""
            
            # Category (User said "Event Presentation" is a type)
            # Likely 'Format' or 'Theme' column.
            # Let's grab 'Format' as Priority 1, 'Theme' as Priority 2
            category = str(row.get('Format', '')).strip()
            if not category or category == "nan":
                category = str(row.get('Theme', 'Video')).strip()
            
            entry = {
                "title": title,
                "description": desc,
                "url": url,
                "videoId": video_id,
                "category": category,
                "industry": str(row.get('Industry', '')).strip(),
                "tags": str(row.get('Tags', '')).split(',') if pd.notna(row.get('Tags')) else [],
                "type": "Video"
            }
            
            # Cleanup 'nan'
            for k, v in entry.items():
                if v == "nan": entry[k] = ""

            data.append(entry)
                
        return data
        
    except Exception as e:
        print(f"Error parsing Video: {e}", file=sys.stderr)
        return []

if __name__ == "__main__":
    base_path = r"C:\Users\tempv2\Desktop\PortfolioAgent\Ref Docs\Work"
    some_path = os.path.join(base_path, "SoMe", "ALL Klint SoME Posts.xlsx")
    video_path = os.path.join(base_path, "Video", "Video Work.xlsx")
    
    some_data = parse_some_work(some_path)
    video_data = parse_video_work(video_path)
    
    some_js_content = f"const SOME_WORK_DATA = {json.dumps(some_data, indent=2)};"
    video_js_content = f"const VIDEO_WORK_DATA = {json.dumps(video_data, indent=2)};"
    
    some_js_path = r"C:\Users\tempv2\Desktop\PortfolioAgent\assets\js\some_work_data.js"
    video_js_path = r"C:\Users\tempv2\Desktop\PortfolioAgent\assets\js\video_work_data.js"
    
    with open(some_js_path, "w", encoding="utf-8") as f:
        f.write(some_js_content)
    print(f"Written to {some_js_path}")
        
    with open(video_js_path, "w", encoding="utf-8") as f:
        f.write(video_js_content)
    print(f"Written to {video_js_path}")
