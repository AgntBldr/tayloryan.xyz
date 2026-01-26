
import re

def analyze_structure():
    path = r"c:\Users\tempv2\Desktop\PortfolioAgent\Ref Docs\Writing\ref_overview_v3_with_links.txt"
    with open(path, 'r', encoding='utf-8') as f:
        lines = [l.strip() for l in f.readlines()]

    # 1. build known H2s from TOC (approx lines 5 to 30)
    known_h2s = set(["Overview", "Monitoring", "Conclusion", "Resources", "Resources:", "My Repeatable Quest Launch System"])
    
    # Heuristic: Scan the TOC section to add more H2s
    # The TOC is roughly between "Overview" and the first "What Are Quests?" header
    in_toc = False
    for line in lines:
        if line == "Overview":
            in_toc = True
            continue
        if line.startswith("What Are Quests?"):
            in_toc = False
            break
        
        if in_toc and line:
            # "Project Discovery - Strong fit..." -> "Project Discovery" is H2
            if " - " in line:
                parts = line.split(" - ")
                known_h2s.add(parts[0].strip())
            else:
                known_h2s.add(line.strip())

    print("KNOWN H2s:", known_h2s)

    # 2. Classify
    for i, line in enumerate(lines):
        if not line: continue
        
        classification = "UNKNOWN"
        
        # Logic
        # Strip markdown links for length checks
        clean_line = re.sub(r'\[.*?\]\(.*?\)', '', line)
        
        if line in known_h2s or line.replace(":", "") in known_h2s:
            classification = "H2"
        elif line.startswith("What Are Quests"): # Special case variation
            classification = "H2"
        elif line.endswith(":"):
            classification = "H3"
        elif line.startswith("Example"):
            classification = "H3"
        elif " - " in line:
            classification = "LI (Bold split)"
        elif line.startswith("- "):
            classification = "LI"
        elif len(clean_line) > 80:
            classification = "P"
        elif line.endswith("."):
            classification = "P"
        else:
            # Short, no period, no dash, not H2/H3/Example.
            # Could be H3 (Subsection) or LI.
            # formatting check: is it Title Case?
            words = clean_line.split()
            capitalized = sum(1 for w in words if w[0].isupper())
            if len(words) > 0 and capitalized / len(words) > 0.7:
                 classification = "H3 (Title Case)"
            else:
                 classification = "LI (Short text)"

        print(f"{i+1:03d} [{classification}]: {line[:60]}...")

analyze_structure()
