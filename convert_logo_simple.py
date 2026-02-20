#!/usr/bin/env python3
"""
Simple logo converter for Guardian VS extension.
Uses only Python standard library and basic image processing.
"""

import os
import sys
import base64
from pathlib import Path

def create_simple_svg(png_path, svg_path):
    """Create a simple SVG with embedded PNG."""
    try:
        # Read PNG file and encode as base64
        with open(png_path, 'rb') as f:
            png_data = base64.b64encode(f.read()).decode('utf-8')
        
        # Create SVG with embedded PNG
        svg_content = f'''<?xml version="1.0" encoding="UTF-8"?>
<svg width="256" height="256" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
  <image href="data:image/png;base64,{png_data}" width="256" height="256"/>
</svg>'''
        
        with open(svg_path, 'w') as f:
            f.write(svg_content)
        
        print(f"✓ Created SVG with embedded PNG: {svg_path}")
        return True
    except Exception as e:
        print(f"✗ Failed to create SVG: {e}")
        return False

def create_fallback_svg(svg_path):
    """Create a very simple fallback SVG."""
    svg_content = '''<?xml version="1.0" encoding="UTF-8"?>
<svg width="256" height="256" xmlns="http://www.w3.org/2000/svg">
  <rect width="256" height="256" rx="20" fill="#4F46E5"/>
  <text x="128" y="128" font-family="Arial, sans-serif" font-size="48" 
        font-weight="bold" fill="white" text-anchor="middle" dy=".3em">GV</text>
</svg>'''
    
    with open(svg_path, 'w') as f:
        f.write(svg_content)
    
    print(f"✓ Created fallback SVG: {svg_path}")
    return True

def check_and_copy_png(input_path, output_path):
    """Check if we can use the input PNG directly or need to copy it."""
    try:
        # For now, just copy the file
        import shutil
        shutil.copy2(input_path, output_path)
        print(f"✓ Copied PNG to: {output_path}")
        print("⚠ Note: PNG was not resized to 256x256 (requires ImageMagick or Pillow)")
        return True
    except Exception as e:
        print(f"✗ Failed to copy PNG: {e}")
        return False

def main():
    # Paths
    script_dir = Path(__file__).parent
    assets_dir = script_dir / 'guardian-vs' / 'assets'
    logo_dir = assets_dir / 'logo'
    icons_dir = assets_dir / 'icons'
    
    # Input file (with spaces in name)
    input_file = logo_dir / 'ChatGPT Image Feb 18, 2026, 11_49_01 PM.png'
    
    # Output files
    png_output = icons_dir / 'icon.png'
    svg_output = icons_dir / 'icon.svg'
    
    # Check if input exists
    if not input_file.exists():
        print(f"✗ Input file not found: {input_file}")
        sys.exit(1)
    
    print(f"Input file: {input_file}")
    print(f"PNG output: {png_output}")
    print(f"SVG output: {svg_output}")
    
    # Create output directory if needed
    icons_dir.mkdir(parents=True, exist_ok=True)
    
    # Copy/process PNG
    print("\n1. Processing PNG...")
    if not check_and_copy_png(str(input_file), str(png_output)):
        print("✗ Failed to process PNG")
        sys.exit(1)
    
    # Create SVG
    print("\n2. Creating SVG...")
    if not create_simple_svg(str(png_output), str(svg_output)):
        print("⚠ Failed to create SVG with embedded PNG, trying fallback...")
        if not create_fallback_svg(str(svg_output)):
            print("✗ All SVG creation methods failed")
            sys.exit(1)
    
    print("\n✅ Conversion complete!")
    print(f"   PNG: {png_output}")
    print(f"   SVG: {svg_output}")
    
    # Show file sizes
    if png_output.exists():
        size = png_output.stat().st_size
        print(f"   PNG size: {size:,} bytes")
    
    if svg_output.exists():
        size = svg_output.stat().st_size
        print(f"   SVG size: {size:,} bytes")
    
    print("\n⚠ Note: For production use, consider:")
    print("   - Install ImageMagick: brew install imagemagick")
    print("   - Or install Pillow: pip3 install Pillow --user")
    print("   - Then run the original convert_logo.py script")

if __name__ == '__main__':
    main()