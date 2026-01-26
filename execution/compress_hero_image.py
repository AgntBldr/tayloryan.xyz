from PIL import Image
import os

source_path = r"c:/Users/tempv2/Desktop/PortfolioAgent/Ref Docs/Home/Taylor ryan - on stage.png"
dest_dir = r"c:/Users/tempv2/Desktop/PortfolioAgent/assets/images"
dest_filename = "taylor_ryan_on_stage_compressed.jpg"
dest_path = os.path.join(dest_dir, dest_filename)

if not os.path.exists(dest_dir):
    os.makedirs(dest_dir)

# Open content
try:
    with Image.open(source_path) as img:
        # Convert to RGB (to handle PNG transparency if needed, though saving as JPG)
        if img.mode in ('RGBA', 'P'):
            img = img.convert('RGB')
        
        # Resize if too large (e.g. max width 1200px)
        max_width = 1200
        if img.width > max_width:
            ratio = max_width / img.width
            new_height = int(img.height * ratio)
            img = img.resize((max_width, new_height), Image.Resampling.LANCZOS)
        
        # Save compressed
        img.save(dest_path, "JPEG", quality=75, optimize=True)
        print(f"Image saved to {dest_path}")
        
except Exception as e:
    print(f"Error processing image: {e}")
