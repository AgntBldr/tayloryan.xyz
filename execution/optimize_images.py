import os
from PIL import Image

DEPLOY_IMAGES_DIR = os.path.join("DEPLOY_CLOUDFLARE", "DEPLOY_PUBLIC", "assets", "images")
MAX_WIDTH = 1600
SIZE_THRESHOLD_KB = 200

def optimize_images():
    if not os.path.exists(DEPLOY_IMAGES_DIR):
        print(f"Directory not found: {DEPLOY_IMAGES_DIR}")
        return

    print(f"Scanning {DEPLOY_IMAGES_DIR}...")
    
    total_saved = 0
    count = 0

    for root, _, files in os.walk(DEPLOY_IMAGES_DIR):
        for file in files:
            if file.lower().endswith(('.png', '.jpg', '.jpeg', '.webp')):
                full_path = os.path.join(root, file)
                original_size = os.path.getsize(full_path)
                
                # Only process if > Threshold
                if original_size < SIZE_THRESHOLD_KB * 1024:
                    continue
                
                try:
                    with Image.open(full_path) as img:
                        # Resize if too huge
                        width, height = img.size
                        new_width = width
                        new_height = height
                        
                        if width > MAX_WIDTH:
                            ratio = MAX_WIDTH / width
                            new_width = MAX_WIDTH
                            new_height = int(height * ratio)
                            img = img.resize((new_width, new_height), Image.Resampling.LANCZOS)
                            print(f"Resizing {file}: {width}x{height} -> {new_width}x{new_height}")
                        
                        # Save with optimization
                        # Preserve format
                        fmt = img.format
                        
                        # For PNG, we can use optimize=True. 
                        # For JPG, quality=80 is usually good.
                        
                        if fmt == 'JPEG':
                            img.save(full_path, 'JPEG', quality=85, optimize=True)
                        elif fmt == 'PNG':
                            # PNG optimization
                            # PngImagePlugin has optimize flag
                            img.save(full_path, 'PNG', optimize=True)
                        elif fmt == 'WEBP':
                            img.save(full_path, 'WEBP', quality=85)
                            
                        new_size = os.path.getsize(full_path)
                        saved = original_size - new_size
                        if saved > 0:
                            total_saved += saved
                            count += 1
                            print(f"Optimized {file}: {original_size/1024:.1f}KB -> {new_size/1024:.1f}KB (Saved {saved/1024:.1f}KB)")
                        else:
                            # If size increased (can happen with some PNGs if already optimized), revert?
                            # Not easy to revert unless we kept backup. But rare with optimize=True if we don't convert.
                            pass

                except Exception as e:
                    print(f"Error processing {file}: {e}")

    print(f"Optimization Complete. Optimized {count} images. Total Saved: {total_saved/1024/1024:.2f} MB")

if __name__ == "__main__":
    optimize_images()
