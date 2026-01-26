import csv
import json
import os
import re

INPUT_CSV = r"Ref Docs\Quests\Quests - Taylor Portfolio - Sheet1.csv"
OUTPUT_JS = r"quests_data.js"

def generate_js():
    quests = []
    if os.path.exists(INPUT_CSV):
        with open(INPUT_CSV, 'r', encoding='utf-8') as f:
            reader = csv.DictReader(f)
            for row in reader:
                if not row.get('Name of Quest'): continue
                
                # Parse Activations (remove commas)
                activation_str = row.get('Activation', '0').replace(',', '').strip()
                try:
                    activations = int(activation_str)
                except:
                    activations = 0

                # Parse Types (comma separated)
                types_raw = row.get('Type', 'Quest')
                types_list = [t.strip() for t in types_raw.split(',') if t.strip()]

                # ID generation
                name = row.get('Name of Quest', '')
                quest_id = re.sub(r'[^a-z0-9]+', '-', name.lower()).strip('-')

                # Manual Overrides (Images, Dates)
                # This could be moved to a separate JSON file later
                manual_data = {
                    "rho-trading-race": {
                        "image": "assets/rho.png",
                        "date": "July 7, 2025"
                    },
                    "explore-terminal-s-root-access-program": {
                        "image": "assets/terminal.png",
                        "date": "July 8, 2025"
                    },
                    "bless-a-global-network-powered-by-everyday-devices": { 
                        "image": "assets/bless.png",
                        "date": "July 9, 2025"
                    },
                    "ddai-depin-for-ai-assistants": {
                        "image": "assets/ddai.png",
                        "date": "July 11, 2025"
                    },
                    "discover-nodes-garden": {
                        "image": "assets/discover.png",
                        "date": "July 13, 2025"
                    },
                    "discover-olaxbt-modular-mcp-agents": {
                        "image": "assets/olaxbt.png",
                        "date": "July 14, 2025"
                    },
                    "sats-terminal-unlock-bitcoin-defi": {
                        "image": "assets/sats.png",
                        "date": "July 16, 2025"
                    },
                    "solana-lending-with-loopscale": {
                        "image": "assets/loopscale.png",
                        "date": "July 24, 2025"
                    },
                    "nodes-garden-x-dria": {
                        "image": "assets/dria.png",
                        "date": "July 31, 2025"
                    },
                    "dria-x-nodes-garden-earn-rewards-fast": {
                        "image": "assets/dria_earn.png",
                        "date": "August 27, 2025"
                    },
                    "discover-zenchain-testnet": {
                        "image": "assets/zenchain.png",
                        "date": "August 9, 2025"
                    },
                    "register-a-zenchain-domain": {
                        "image": "assets/zns.png",
                        "date": "August 10, 2025"
                    },
                    "scribbledao-for-creators": {
                        "image": "assets/scribbledao.png",
                        "date": "August 12, 2025"
                    },
                    "applefarm-season-2": {
                        "image": "assets/applefarm.png",
                        "date": "August 14, 2025"
                    },
                    "rhea-finance-august-trade-competition": {
                        "image": "assets/rhea.png",
                        "date": "August 14, 2025"
                    },
                    "river-chain-abstraction-in-action": {
                        "image": "assets/river.png",
                        "date": "August 14, 2025"
                    },
                    "intro-to-etherscan-points": {
                        "image": "assets/etherscan.png",
                        "date": "August 15, 2025"
                    },
                    "discover-zeebu-pulseboard": {
                        "image": "assets/zeebu.png",
                        "date": "August 18, 2025"
                    },
                    "autopilot-x-aerodrome": {
                        "image": "assets/autopilot.png",
                        "date": "August 21, 2025"
                    },
                    "cables-finance-rwa-meets-defi": {
                        "image": "assets/cables.png",
                        "date": "August 22, 2025"
                    },
                    "haiku-trade-outcome-as-a-service-for-defi": {
                        "image": "assets/haiku.png",
                        "date": "August 23, 2025"
                    },
                    "gmgn-copy-trade-snipe-tokens": {
                        "image": "assets/gmgn.png",
                        "date": "August 24, 2025"
                    },
                    "explore-syntetika-hub": {
                        "image": "assets/syntetika.png",
                        "date": "August 25, 2025"
                    },
                    "zoop-web3-creators-and-sofi-platform": {
                        "image": "assets/zoop.png",
                        "date": "August 27, 2025"
                    },
                    "gorillionaire-trade-on-real-sentiment": {
                        "image": "assets/gorillionaire.png",
                        "date": "August 28, 2025"
                    },
                    "arch-network-bitcoin-native-execution-for-defi-scale": {
                        "image": "assets/arch.png",
                        "date": "August 29, 2025"
                    },
                    "own-your-ai-agent-on-waye-ai": {
                        "image": "assets/waye.png",
                        "date": "August 30, 2025"
                    },
                    "membit-live-ai-context-layer": {
                        "image": "assets/membit.png",
                        "date": "August 31, 2025"
                    },
                    "metengine-dynamic-solana-pools": {
                        "image": "assets/metengine.png",
                        "date": "September 1, 2025"
                    },
                    "nexchain-ai-powered-blockchain-airdrop": {
                        "image": "assets/nexchain.png",
                        "date": "September 2, 2025"
                    },
                    "mindshare-your-influence": {
                        "image": "assets/mindshare.png",
                        "date": "September 4, 2025"
                    },
                    "haiku-2-agent-trade": {
                        "image": "assets/haiku_agent.png",
                        "date": "September 5, 2025"
                    },
                    "fluence-the-pointless-program": {
                        "image": "assets/fluence.png",
                        "date": "September 6, 2025"
                    },
                    "ducat-quanta-quickstart": {
                        "image": "assets/ducat.png",
                        "date": "September 8, 2025"
                    },
                    "ducat-part-2-mutinynet-testnet-faucet": {
                        "image": "assets/ducat_part2.png",
                        "date": "September 9, 2025"
                    },
                    "strata-structured-yield-on-usde": {
                        "image": "assets/strata.png",
                        "date": "September 11, 2025"
                    },
                    "aitv-gg-ai-hosts-real-rewards": {
                        "image": "assets/aitv.png",
                        "date": "September 13, 2025"
                    },
                    "glider-your-portfolio-on-autopilot": {
                        "image": "assets/glider.png",
                        "date": "September 14, 2025"
                    },
                    "near-mobile-wallet-launch": {
                        "image": "assets/near_mobile.png",
                        "date": "September 15, 2025"
                    },
                    "run-a-irys-node-on-nodes-garden": {
                        "image": "assets/nodes_irys_v3.png",
                        "date": "October 27, 2025"
                    }
                }
                
                override = manual_data.get(quest_id, {})

                quest = {
                    "id": quest_id,
                    "title": row.get('Name of Quest'),
                    "project": row.get('Project Name'),
                    "description": row.get('Description', ''),
                    "types": types_list, # Changed from single string 'type'
                    "expertise": row.get('Expertise', 'Beginner'),
                    "activations": activations,
                    "tags": [t.strip().title() for t in row.get('Tags', '').split(',') if t.strip()],
                    "activities": [a.strip() for a in row.get('Activities', '').split(',') if a.strip()],
                    "url": row.get('Live URL'),
                    "image": override.get('image', ''), 
                    "date": override.get('date', ''),
                    "links": {
                        "website": row.get('Website'),
                        "referral": row.get('Referral Link'),
                        "quest_doc": row.get('Quest Doc'),
                        "application": row.get('Application'),
                        "documentation": row.get('Documentation'),
                        "blog": row.get('Blog'),
                        "x": row.get('X'),
                        "discord": row.get('Discord'),
                        "telegram": row.get('Telegram'),
                        "github": row.get('Github'),
                        "linkedin": row.get('Linkedin'),
                        "token_listing": row.get('Listing')
                    },
                    "token": row.get('Token')
                }
                quests.append(quest)
    else:
        print("CSV NOT FOUND! Using mock data.")
        quests = [{"id": "1", "title": "Error Loading CSV", "type": "Error", "description": "Could not find source file."}]

    js_content = f"window.quests = {json.dumps(quests, indent=2)};"
    
    with open(OUTPUT_JS, 'w', encoding='utf-8') as f:
        f.write(js_content)
        
    print(f"Generated {OUTPUT_JS} with {len(quests)} items.")

if __name__ == "__main__":
    generate_js()
