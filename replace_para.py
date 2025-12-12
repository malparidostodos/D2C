import json
import re

# Read the file
file_path = r'src\locales\es\translation.json'
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Find all instances of "para" and "Para"
para_matches = re.findall(r'\bpara\b', content)
Para_matches = re.findall(r'\bPara\b', content)

print(f"Found {len(para_matches)} instances of 'para'")
print(f"Found {len(Para_matches)} instances of 'Para'")

if len(para_matches) == 0 and len(Para_matches) == 0:
    print("No instances of 'para' or 'Para' found. File might already be updated.")
else:
    # Replace para -> pa' and Para -> Pa'
    # Using word boundaries to avoid replacing "para" in the middle of words
    content = re.sub(r'\bpara\b', "pa'", content)
    content = re.sub(r'\bPara\b', "Pa'", content)
    
    # Write back
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)
    
    print("Replacement complete!")
