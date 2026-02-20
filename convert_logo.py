#!/usr/bin/env python3
"""
Convert logo image to required formats for Guardian VS extension.
Creates:
1. 256x256 PNG icon (icon.png)
2. SVG version (icon.svg) - simplified version using basic shapes
"""

import os
import sys
import subprocess
import tempfile
from pathlib import Path

def check_dependencies():
    """Check if required tools are available."""
    required_tools = ['convert', 'rsvg-convert']
    missing = []
    
    for tool in required_tools:
        try:
            subprocess.run([tool, '--version'], capture_output=True, check=True)
        except (subprocess.CalledProcessError, FileNotFoundError):
            missing.append(tool)
    
    return missing

def create_256_png(input_path, output_path):
    """Create 256x256 PNG using ImageMagick."""
    try:
        # Use ImageMagick to resize and create PNG
        cmd = [
            'convert', input_path,
            '-resize', '256x256',
            '-background', 'transparent',
            '-gravity', 'center',
            '-extent', '256x256',
            output_path
        ]
        subprocess.run(cmd, check=True)
        print(f"✓ Created 256x256 PNG: {output_path}")
        return True
    except subprocess.CalledProcessError as e:
        print(f"✗ Failed to create PNG: {e}")
        return False

def create_svg_from_png(png_path, svg_path):
    """Create a simple SVG from PNG using potrace or basic conversion."""
    try:
        # First, check if we can use potrace to trace the image
        # Create a temporary PBM file
        with tempfile.NamedTemporaryFile(suffix='.pbm', delete=False) as tmp:
            tmp_pbm = tmp.name
        
        try:
            # Convert PNG to PBM (black and white)
            cmd1 = ['convert', png_path, '-threshold', '50%', tmp_pbm]
            subprocess.run(cmd1, check=True)
            
            # Use potrace to convert PBM to SVG
            cmd2 = ['potrace', tmp_pbm, '-s', '-o', svg_path]
            subprocess.run(cmd2, check=True)
            
            print(f"✓ Created SVG via potrace: {svg_path}")
            return True
        finally:
            # Clean up temporary file
            if os.path.exists(tmp_pbm):
                os.unlink(tmp_pbm)
                
    except (subprocess.CalledProcessError, FileNotFoundError):
        # Fallback: create a simple SVG with the PNG embedded
        print("⚠ potrace not available, creating simple SVG with embedded PNG")
        try:
            # Get image dimensions
            cmd = ['identify', '-format', '%w %h', png_path]
            result = subprocess.run(cmd, capture_output=True, text=True, check=True)
            width, height = map(int, result.stdout.strip().split())
            
            # Create a simple SVG with embedded PNG
            import base64
            with open(png_path, 'rb') as f:
                png_data = base64.b64encode(f.read()).decode('utf-8')
            
            svg_content = f'''<?xml version="1.0" encoding="UTF-8"?>
<svg width="{width}" height="{height}" xmlns="http://www.w3.org/2000/svg">
  <image href="data:image/png;base64,{png_data}" width="{width}" height="{height}"/>
</svg>'''
            
            with open(svg_path, 'w') as f:
                f.write(svg_content)
            
            print(f"✓ Created simple SVG with embedded PNG: {svg_path}")
            return True
        except Exception as e:
            print(f"✗ Failed to create SVG: {e}")
            return False

def create_simple_svg_fallback(output_path):
    """Create a very simple SVG as last resort."""
    svg_content = '''<?xml version="1.0" encoding="UTF-8"?>
<svg width="256" height="256" xmlns="http://www.w3.org/2000/svg">
  <rect width="256" height="256" rx="20" fill="#4F46E5"/>
  <text x="128" y="128" font-family="Arial, sans-serif" font-size="48" 
        font-weight="bold" fill="white" text-anchor="middle" dy=".3em">GV</text>
</svg>'''
    
    with open(output_path, 'w') as f:
        f.write(svg_content)
    
    print(f"✓ Created fallback SVG: {output_path}")
    return True

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
    
    # Check dependencies
    missing_tools = check_dependencies()
    if missing_tools:
        print(f"⚠ Missing tools: {', '.join(missing_tools)}")
        print("Will attempt fallback methods...")
    
    # Create output directory if needed
    icons_dir.mkdir(parents=True, exist_ok=True)
    
    # Create 256x256 PNG
    print("\n1. Creating 256x256 PNG...")
    if not create_256_png(str(input_file), str(png_output)):
        print("✗ Failed to create PNG")
        sys.exit(1)
    
    # Create SVG
    print("\n2. Creating SVG...")
    if not create_svg_from_png(str(png_output), str(svg_output)):
        print("⚠ Failed to create SVG with primary method, trying fallback...")
        if not create_simple_svg_fallback(str(svg_output)):
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

if __name__ == '__main__':
    main()