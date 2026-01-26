
import os

def inject_images():
    html_path = r"c:\Users\tempv2\Desktop\PortfolioAgent\quest_portfolio.html"
    
    with open(html_path, 'r', encoding='utf-8') as f:
        lines = f.readlines()
    
    # Define injections: (Marker Substring, Image Filename, Insert After?)
    # We will process them carefully.
    
    injections = [
        ("All Quest Portfolio Resources</a></h2>", "overview_image_1.png"),
        ("Example - <a href=\"https://layer3.xyz/?ref=klintmar.eth\"", "overview_image_2.png"),
        # Image 3 was after Off-chain list. 
        ("Off-chain</strong> -", "overview_image_3.png"),
        # Image 4 was after Rewards unlock
        ("Rewards unlock upon completion</h2>", "overview_image_4.png"),
        # Image 5 after Quest Platforms discovery
        ("Quest Platforms</strong> - Project Discovery</a></li>", "overview_image_5.png"), 
        # Image 6 after "Clean execution... to 90% automated.</li>"
        ("Clean execution under constraints</strong> - Go from manual, To somewhat automation, to 90% automated.</li>", "overview_image_6.png"),
        # Image 8 after Perplexity
        ("Exampe: Using Perplexity to enrich projects</h2>", "overview_image_8.png"),
        # Image 9 after Velvet Trade
        ("Example - Velvet Trade", "overview_image_9.png"),
        # Image 18 before Conclusion
        ("id=\"conclusion\"", "overview_image_18.png") # Special case: insert BEFORE
    ]
    
    # We'll iterate lines and rebuild.
    # Note: modifying a list while iterating is hard, so we build a new list.
    # But some markers might span lines or be part of lines.
    
    new_lines = []
    
    # We need to handle the case where multiple injections might match (unlikely with specific text)
    # and ensuring we don't duplicate.
    
    for line in lines:
        # Check for Image 18 (Insertion BEFORE)
        if 'id="conclusion"' in line.lower():
             new_lines.append('        <div class="my-8"><img src="assets/overview/overview_image_18.png" class="w-full rounded-xl border border-neutral-800 shadow-2xl"></div>\n')
        
        new_lines.append(line)
        
        # Check for Insertions AFTER
        for marker, img_name in injections:
            if marker == 'id="conclusion"': continue
            
            if marker in line:
                # Add image line
                img_html = f'        <div class="my-8"><img src="assets/overview/overview_image_1.png" class="w-full rounded-xl border border-neutral-800 shadow-2xl"></div>\n'.replace('overview_image_1.png', img_name)
                new_lines.append(img_html)
                
    with open(html_path, 'w', encoding='utf-8') as f:
        f.writelines(new_lines)
    
    print("Injected images.")

if __name__ == "__main__":
    inject_images()
