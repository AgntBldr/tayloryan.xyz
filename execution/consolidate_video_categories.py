import json
import os
import re

# File paths
BASE_DIR = r"C:\Users\tempv2\Desktop\PortfolioAgent"
DATA_FILE = os.path.join(BASE_DIR, "assets", "js", "video_work_data.js")

# Mapping Logic
MAPPING = {
    "Workshop": "Workshop",
    "Full Talk / Workshop": "Workshop", 
    "Full workshop": "Workshop",
    "Full Workshop": "Workshop",
    "Learning Lessons": "Workshop", # Contextual guess based on description usually? No, title is Learning Lessons. Wait, item 1 matches "Learning Lessons" -> Workshop. But "Lecture" also has "Learning Lessons". 
    # Logic: I should map strictly by *existing category* if possible. The `video_work_data.js` has a "category" field.
    
    # Existing Category -> New Category
    "Workshop": "Workshop",
    "Full Talk": "Talk (Full)",
    "Full talk": "Talk (Full)",
    "Talk": "Talk (Full)", # Defaulting to Full based on "Failure story" context
    "Lecture": "Lecture",
    "Presentation": "Presentation (Full)",
    "Full Presentation": "Presentation (Full)",
    "Keynote": "Keynote",
    "Webinar": "Webinar",
    "Masterclass": "Masterclass",
    "Tutorial": "Tutorial (How To)",
    "Tutorial / How-to": "Tutorial (How To)",
    "TikTok Tutorials": "Tutorial (How To)", # Wait, title? No, category.
    "Interview": "Interview (Team, Q&A)",
    "Short video": "Short Clip / Highlight",
    "Short Clip / Highlight": "Short Clip / Highlight",
    # "Highlight Reel": "Short Clip / Highlight", # User requested "Short Clip / Highlight" for short stuff. But "Teaser / Trailer / Promo" for promotional.
    # Looking at "Klint Marketing" highlight reel -> "Teaser / Trailer / Promo" fits better for a "fast montage".
    "Highlight Reel": "Teaser / Trailer / Promo", 
    "Clip / Q&A": "Interview (Team, Q&A)",
    "Explainer video": "Explainer",
    "Screen recording": "Screen Recording / Call Capture",
    "Call Recording / Screen Capture": "Screen Recording / Call Capture",
    
    "Teaser / Trailer": "Teaser / Trailer / Promo",
    "Teaser / Trailer / Promo": "Teaser / Trailer / Promo",
    
    "Pitch": "Pitch",
    "Explainer": "Explainer",
    "Product Demo": "Product Demo",
    "Screen Recording / Call Capture": "Screen Recording / Call Capture",
    "Community Call": "Community Call"
}

def load_data():
    with open(DATA_FILE, 'r', encoding='utf-8') as f:
        content = f.read()
        # Strip JS variable declaration
        json_str = re.sub(r'^const VIDEO_WORK_DATA = ', '', content).strip().rstrip(';')
        return json.loads(json_str)

def save_data(data):
    json_str = json.dumps(data, indent=2)
    js_content = f"const VIDEO_WORK_DATA = {json_str};\n"
    with open(DATA_FILE, 'w', encoding='utf-8') as f:
        f.write(js_content)

def main():
    data = load_data()
    updated_count = 0
    
    categories_found = set()

    for item in data:
        old_cat = item.get("category", "")
        # Case insensitive lookup
        
        # Heuristic fixes if category is missing or varies
        mapped_cat = None
        
        # Direct Match
        if old_cat in MAPPING:
            mapped_cat = MAPPING[old_cat]
        else:
            # Case insensitive
            for k, v in MAPPING.items():
                if k.lower() == old_cat.lower():
                    mapped_cat = v
                    break
        
        if not mapped_cat:
            # Fallback heuristics
            lower_cat = old_cat.lower()
            if "workshop" in lower_cat: mapped_cat = "Workshop"
            elif "talk" in lower_cat: mapped_cat = "Talk (Full)"
            elif "tutorial" in lower_cat: mapped_cat = "Tutorial (How To)"
            elif "presentation" in lower_cat: mapped_cat = "Presentation (Full)"
            elif "interview" in lower_cat: mapped_cat = "Interview (Team, Q&A)"
            elif "highlight" in lower_cat: mapped_cat = "Short Clip / Highlight"
            elif "teaser" in lower_cat or "trailer" in lower_cat: mapped_cat = "Teaser / Trailer / Promo"
            elif "short" in lower_cat: mapped_cat = "Short Clip / Highlight"
            else:
                print(f"Warning: Could not map category '{old_cat}' for '{item['title']}'")
                mapped_cat = old_cat # Keep original if no map found
        
        if mapped_cat != old_cat:
            item["category"] = mapped_cat
            updated_count += 1
            
        categories_found.add(mapped_cat)

    save_data(data)
    print(f"Updated {updated_count} items.")
    print("Categories in use:", sorted(list(categories_found)))

if __name__ == "__main__":
    main()
