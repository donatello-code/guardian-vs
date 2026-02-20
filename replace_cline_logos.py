#!/usr/bin/env python3
"""
Replace Cline logo images with Guardian VS logo images in the project.
Uses the simple conversion approach to create Guardian VS logo versions.
"""

import os
import sys
import base64
import shutil
from pathlib import Path

def create_guardian_vs_logos():
    """Create Guardian VS logo images to replace Cline logos."""
    script_dir = Path(__file__).parent
    assets_dir = script_dir / 'guardian-vs' / 'assets'
    logo_dir = assets_dir / 'logo'
    icons_dir = assets_dir / 'icons'
    docs_assets_dir = script_dir / 'guardian-vs' / 'docs' / 'assets'
    
    # Input file (new Guardian VS logo)
    input_file = logo_dir / 'ChatGPT Image Feb 18, 2026, 11_49_01 PM.png'
    
    # Check if input exists
    if not input_file.exists():
        print(f"✗ Input file not found: {input_file}")
        return False
    
    print(f"Input file: {input_file}")
    
    # Create docs assets directory if needed
    docs_assets_dir.mkdir(parents=True, exist_ok=True)
    
    # We'll create two versions to replace the Cline logos:
    # 1. For light theme (replaces Cline_Logo-complete_black.png)
    # 2. For dark theme (replaces Cline_Logo-complete_white.png)
    
    # For now, we'll use the same image for both light and dark themes
    # since we don't have separate light/dark versions of the Guardian VS logo
    
    # Copy the PNG as Guardian_VS_Logo-complete_black.png (for light theme)
    light_output = docs_assets_dir / 'Guardian_VS_Logo-complete_black.png'
    dark_output = docs_assets_dir / 'Guardian_VS_Logo-complete_white.png'
    
    try:
        # Copy the input PNG to both light and dark versions
        shutil.copy2(input_file, light_output)
        shutil.copy2(input_file, dark_output)
        
        print(f"✓ Created light theme logo: {light_output}")
        print(f"✓ Created dark theme logo: {dark_output}")
        
        # Also create SVG versions if needed
        # Create simple SVG with embedded PNG for light theme
        with open(input_file, 'rb') as f:
            png_data = base64.b64encode(f.read()).decode('utf-8')
        
        # Create SVG for light theme
        svg_light_content = f'''<?xml version="1.0" encoding="UTF-8"?>
<svg width="256" height="256" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
  <image href="data:image/png;base64,{png_data}" width="256" height="256"/>
</svg>'''
        
        svg_light_output = docs_assets_dir / 'Guardian_VS_Logo-complete_black.svg'
        with open(svg_light_output, 'w') as f:
            f.write(svg_light_content)
        
        print(f"✓ Created SVG light theme logo: {svg_light_output}")
        
        # Create SVG for dark theme (same image for now)
        svg_dark_output = docs_assets_dir / 'Guardian_VS_Logo-complete_white.svg'
        with open(svg_dark_output, 'w') as f:
            f.write(svg_light_content)
        
        print(f"✓ Created SVG dark theme logo: {svg_dark_output}")
        
        return True
        
    except Exception as e:
        print(f"✗ Failed to create Guardian VS logos: {e}")
        return False

def update_docs_json():
    """Update docs.json to reference Guardian VS logos instead of Cline logos."""
    docs_json_path = Path(__file__).parent / 'guardian-vs' / 'docs' / 'docs.json'
    
    if not docs_json_path.exists():
        print(f"✗ docs.json not found: {docs_json_path}")
        return False
    
    try:
        with open(docs_json_path, 'r') as f:
            content = f.read()
        
        # Replace Cline logo references with Guardian VS logo references
        # Note: We're keeping the same filenames but the actual files have been replaced
        # So we don't need to update the JSON if we keep the same filenames
        
        # Actually, we changed the filenames from Cline_Logo to Guardian_VS_Logo
        # So we need to update the references
        updated_content = content.replace(
            'Cline_Logo-complete_black.png',
            'Guardian_VS_Logo-complete_black.png'
        ).replace(
            'Cline_Logo-complete_white.png',
            'Guardian_VS_Logo-complete_white.png'
        )
        
        # Also update the name from "Cline" to "Guardian VS"
        updated_content = updated_content.replace(
            '"name": "Cline"',
            '"name": "Guardian VS"'
        ).replace(
            '"description": "AI-powered coding agent for complex work"',
            '"description": "Guardian VS - AI-powered coding assistant"'
        )
        
        with open(docs_json_path, 'w') as f:
            f.write(updated_content)
        
        print(f"✓ Updated {docs_json_path}")
        return True
        
    except Exception as e:
        print(f"✗ Failed to update docs.json: {e}")
        return False

def backup_cline_logos():
    """Backup the original Cline logos before replacing them."""
    docs_assets_dir = Path(__file__).parent / 'guardian-vs' / 'docs' / 'assets'
    backup_dir = docs_assets_dir / 'backup'
    
    cline_files = [
        'Cline_Logo-complete_black.png',
        'Cline_Logo-complete_white.png'
    ]
    
    backup_dir.mkdir(exist_ok=True)
    
    for filename in cline_files:
        src = docs_assets_dir / filename
        if src.exists():
            dst = backup_dir / filename
            shutil.copy2(src, dst)
            print(f"✓ Backed up {filename} to {dst}")

def main():
    print("=== Replacing Cline logos with Guardian VS logos ===\n")
    
    # Backup original Cline logos
    print("1. Backing up original Cline logos...")
    backup_cline_logos()
    
    # Create Guardian VS logo images
    print("\n2. Creating Guardian VS logo images...")
    if not create_guardian_vs_logos():
        print("✗ Failed to create Guardian VS logos")
        sys.exit(1)
    
    # Update docs.json
    print("\n3. Updating docs.json...")
    if not update_docs_json():
        print("✗ Failed to update docs.json")
        sys.exit(1)
    
    print("\n✅ Successfully replaced Cline logos with Guardian VS logos!")
    print("\nSummary of changes:")
    print("  - Backed up original Cline logos to docs/assets/backup/")
    print("  - Created Guardian_VS_Logo-complete_black.png (light theme)")
    print("  - Created Guardian_VS_Logo-complete_white.png (dark theme)")
    print("  - Created SVG versions of both logos")
    print("  - Updated docs.json to reference new logos and name")
    
    print("\n⚠ Note: The new logo images are large (1.3MB each).")
    print("   For production use, consider optimizing them for web.")
    print("   You can use tools like ImageMagick or online optimizers.")

if __name__ == '__main__':
    main()