import pandas as pd
import json
import os
import shutil
import re

# path updated to CSV
csv_path = r"C:\Users\tempv2\Desktop\PortfolioAgent\Ref Docs\Work\Projects\Vibecoding\Vibecode Project Portfolio - Vibecode Project Portfolio (1).csv"
courses_csv_path = r"C:\Users\tempv2\Desktop\PortfolioAgent\Ref Docs\Work\Projects\Courses\Courses - Coureses.csv"

images_src_dir = r"C:\Users\tempv2\Desktop\PortfolioAgent\Ref Docs\Work\Projects\Vibecoding"
images_dest_dir = r"C:\Users\tempv2\Desktop\PortfolioAgent\assets\images\projects"
output_js_path = r"C:\Users\tempv2\Desktop\PortfolioAgent\assets\js\projects_data.js"

if not os.path.exists(images_dest_dir):
    os.makedirs(images_dest_dir)

def slugify(text):
    if not isinstance(text, str):
        return "unknown"
    text = text.lower()
    return re.sub(r'[\s\W-]+', '-', text).strip('-')

try:
    # --- PROCESS VIBECODING PROJECTS ---
    df = pd.read_csv(csv_path)
    df = df.where(pd.notnull(df), "") # Replace NaNs with empty string
    
    projects = []
    current_category = "Vibecode"
    
    for index, row in df.iterrows():
        name = row.get("Name", "").strip()
        
        # Detect Category Headers
        if name in ["Images", "Video", "Games"] and row.get("Description", "") == "":
            current_category = name.rstrip("s") # Image, Video, Game
            continue
            
        # Skip empty rows or separators
        if not name or row.get("Description", "") == "":
            continue
            
        slug = slugify(name)
        
        # Use 'File name' column for image
        image_name = row.get("File name", "").strip()
        image_path = ""
        
        if image_name:
            src = os.path.join(images_src_dir, image_name)
            if os.path.exists(src):
                dest = os.path.join(images_dest_dir, image_name)
                shutil.copy2(src, dest)
                image_path = f"assets/images/projects/{image_name}"
                print(f"Copied {image_name}")
            else:
                print(f"Warning: Image not found: {src}")
        
        project = {
            "id": slug,
            "project": name,
            "image": image_path,
            "type": current_category,
            "url": row.get("URL", ""),
            "github": row.get("Github", ""),
            "environment": row.get("IDE Tool", "Unknown"),
            "description": row.get("Description", ""),
            "vibecode_prompt": row.get("Vibecode Prompt", ""),
            "integrations": row.get("Integrations", ""),
            "inputs": row.get("Inputs", ""),
            "output": row.get("Output", ""),
            "use_cases": row.get("Usecases (2–3 examples)", ""),
            "target_users": row.get("Target Users", ""),
            "differentiators": row.get("Key Differentiators", ""),
            "tech_stack": row.get("Tech Stack", ""),
            "what_it_proves": row.get("What It Proves", "")
        }
        projects.append(project)

    # --- PROCESS COURSES ---
    courses = []
    if os.path.exists(courses_csv_path):
        df_courses = pd.read_csv(courses_csv_path)
        df_courses = df_courses.where(pd.notnull(df_courses), "")
        
        # Image mapping (manual based on known assets)
        course_images = {
            "growth secrets": "assets/images/growth_secrets_thumb.jpg",
            "get hired abroad": "assets/images/get_hired_thumb.jpg",
            "marketing for entrepreneurs": "assets/images/entrepreneur_course.png"
        }

        for index, row in df_courses.iterrows():
            name = row.get("Course", "").strip()
            if not name: continue
            
            slug = slugify(name)
            
            # Smart image matching
            image_path = ""
            name_lower = name.lower()
            for key, val in course_images.items():
                if key in name_lower:
                    image_path = val
                    break
            
            # Robust Stats Parsing
            resources_raw = str(row.get("Number of Resources", ""))
            
            slides = "N/A"
            if "slides" in resources_raw.lower():
                # Extract number before 'slides'
                match = re.search(r'(\d+)\+?\s*slides', resources_raw.lower())
                if match:
                    slides = match.group(1) + "+"
            
            resources_count = "N/A"
            
            # Fallback resource count logic
            if resources_raw and "slides" not in resources_raw.lower() and "comments" not in resources_raw.lower() and "modules" not in resources_raw.lower():
                 resources_count = resources_raw
            elif "modules" in resources_raw.lower():
                 # "20+ modules" -> "20+"
                 match = re.search(r'(\d+)\+?', resources_raw)
                 if match:
                     resources_count = match.group(0)

            # Handle duplicate URL columns - pandas likely named the second one URL.1
            # First URL is typically the Website
            website_url = row.get("URL", "")
            if pd.isna(website_url) or website_url == "N/A":
                website_url = ""
                
            udemy_url = row.get("Udemy Link", "")
            if pd.isna(udemy_url): 
                 udemy_url = ""

            # Custom Title & Video Overrides
            meta_overrides = {
                "growth secrets": {
                    "title": "Growth Secrets - Ultimate Growthhacking Masterclass",
                    "video": "https://youtu.be/h0B-74NKBjA"
                },
                "get hired abroad": {
                    "title": "Get Hired Abroad - The Ultimate AI Job Hunt System",
                    "video": "https://youtu.be/3xhaX7IUhxo"
                },
                "marketing for entrepreneurs": {
                    "title": "Marketing for Entrepreneurs: Learn Digital Marketing",
                    "video": "https://www.youtube.com/watch?v=P0hU5AAfxYY",
                    "chapters": "Growth mindset; Growth-hacking; Branding fundamentals; Early-stage SEO setup; KPI tracking; Team + execution; Email list building; Funnels; CRO; Content creation + virality (Udemy)"
                }
            }
            
            final_title = name
            preview_video = row.get("Preview Video", "")
            final_chapters = row.get("Chapters", "")
            
            for key, val in meta_overrides.items():
                if key in name_lower:
                    final_title = val.get("title", final_title)
                    preview_video = val.get("video", preview_video)
                    if "chapters" in val:
                        final_chapters = val["chapters"]
                    break

            course = {
                "id": slug,
                "title": final_title,
                "description": row.get("Description", ""),
                "long_description": row.get("Long Description", ""),
                "url": udemy_url or website_url, # Key generic URL for card
                "website": website_url,
                "udemy_link": udemy_url,
                "image": image_path,
                "modules": row.get("Modules", ""),
                "hours": row.get("Hours", ""),
                "resources": resources_count if resources_count != "N/A" else (resources_raw if resources_raw else ""),
                "slides": slides,
                "audience": row.get("Audience", ""),
                "chapters": final_chapters,
                "theme": row.get("Theme", ""),
                "level": row.get("Level", ""),
                "graduates": row.get("Graduates", ""),
                "preview_video": preview_video
            }
            # Custom logic for stats if strictly following design:
            # The design has: Hours, Lessons (Modules), Content/Slides/Prompts
            # I will pass raw values and handle display in HTML/JS or clean here.
            
            courses.append(course)
    else:
        print(f"Warning: Courses CSV not found at {courses_csv_path}")

    # --- WRITE JS ---
    js_content = f"const PROJECTS_DATA = {json.dumps(projects, indent=2)};\n\n"
    js_content += f"const COURSES_DATA = {json.dumps(courses, indent=2)};"
    
    with open(output_js_path, "w", encoding="utf-8") as f:
        f.write(js_content)
        
    print(f"Created {output_js_path} with {len(projects)} projects and {len(courses)} courses.")
    
except Exception as e:
    print(f"Error: {e}")
