
import os
import re

file_path = r"C:\Users\tempv2\.gemini\antigravity\brain\1271a278-dbec-48d2-943a-fd92f5a8271b\walkthrough.md"
base_path = "/C:/Users/tempv2/.gemini/antigravity/brain/1271a278-dbec-48d2-943a-fd92f5a8271b/"
# Also handle the one I missed/messed up: /C/Users... (line 154 in diff)
base_path_2 = "/C/Users/tempv2/.gemini/antigravity/brain/1271a278-dbec-48d2-943a-fd92f5a8271b/"

with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Replace the specific long path key with nothing (making it relative)
new_content = content.replace(base_path, "")
new_content = new_content.replace(base_path_2, "")

# Just in case, also handle "file:///" prefix if I revert or something.
new_content = new_content.replace("file:///C:/Users/tempv2/.gemini/antigravity/brain/1271a278-dbec-48d2-943a-fd92f5a8271b/", "")

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(new_content)

print("Successfully updated image paths to relative filenames in walkthrough.md")
