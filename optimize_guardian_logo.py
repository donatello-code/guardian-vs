#!/usr/bin/env python3
"""
Optimize and rename the ChatGPT-generated Guardian VS logo.
Creates an officially named, optimized version of the logo.
"""

import os
import sys
import shutil
import subprocess
from pathlib import Path
from typing import Optional, Tuple

def check_pillow() -> bool:
    """Check if Pillow (PIL) is available."""
    try:
        from PIL import Image
        return True
    except ImportError:
        return False

def check_imagemagick() -> bool:
    """Check if ImageMagick is available."""
    try:
        subprocess.run(['convert', '--version'], capture_output=True, check=True)
        return True
    except (subprocess.CalledProcessError, FileNotFoundError):
        return False

def optimize_with_pillow(input_path: str, output_path: str, target_size: Tuple[int, int] = (512, 512)) -> bool:
    """Optimize PNG using Pillow library."""
    try:
        from PIL import Image
        
        print(f"  Using Pillow to optimize image...")
        
        # Open the image
        with Image.open(input_path) as img:
            # Convert to RGB if necessary (strip alpha channel for better compression)
            if img.mode in ('RGBA', 'LA'):
                # Create a white background
                background = Image.new('RGB', img.size, (255, 255, 255))
                # Paste the image on the background
                if img.mode == 'RGBA':
                    background.paste(img, mask=img.split()[-1])
                else:
                    background.paste(img, mask=img)
                img = background
            elif img.mode != 'RGB':
                img = img.convert('RGB')
            
            # Resize if needed
            if img.size != target_size:
                print(f"  Resizing from {img.size} to {target_size}")
                img = img.resize(target_size, Image.Resampling.LANCZOS)
            
            # Save with optimization
            img.save(output_path, 'PNG', optimize=True, quality=85)
            
            # Get file size
            original_size = os.path.getsize(input_path)
            new_size = os.path.getsize(output_path)
            reduction = ((original_size - new_size) / original_size) * 100
            
            print(f"  Optimized: {original_size:,} bytes → {new_size:,} bytes ({reduction:.1f}% reduction)")
            return True
            
    except Exception as e:
        print(f"  ✗ Pillow optimization failed: {e}")
        return False

def optimize_with_imagemagick(input_path: str, output_path: str, target_size: Tuple[int, int] = (512, 512)) -> bool:
    """Optimize PNG using ImageMagick."""
    try:
        print(f"  Using ImageMagick to optimize image...")
        
        # Get original dimensions
        cmd = ['identify', '-format', '%w %h', input_path]
        result = subprocess.run(cmd, capture_output=True, text=True, check=True)
        orig_width, orig_height = map(int, result.stdout.strip().split())
        
        # Build convert command
        cmd = [
            'convert', input_path,
            '-resize', f'{target_size[0]}x{target_size[1]}',
            '-strip',  # Remove metadata
            '-quality', '85',
            output_path
        ]
        
        subprocess.run(cmd, check=True)
        
        # Get file size
        original_size = os.path.getsize(input_path)
        new_size = os.path.getsize(output_path)
        reduction = ((original_size - new_size) / original_size) * 100
        
        print(f"  Optimized: {original_size:,} bytes → {new_size:,} bytes ({reduction:.1f}% reduction)")
        return True
        
    except Exception as e:
        print(f"  ✗ ImageMagick optimization failed: {e}")
        return False

def simple_copy(input_path: str, output_path: str) -> bool:
    """Simple file copy as fallback."""
    try:
        shutil.copy2(input_path, output_path)
        original_size = os.path.getsize(input_path)
        print(f"  Copied (no optimization): {original_size:,} bytes")
        return True
    except Exception as e:
        print(f"  ✗ Copy failed: {e}")
        return False

def create_official_logo(input_path: str, output_dir: str, official_name: str = "guardian-vs-logo") -> Optional[str]:
    """
    Create an officially named, optimized version of the logo.
    
    Args:
        input_path: Path to the input PNG file
        output_dir: Directory to save the optimized logo
        official_name: Base name for the official logo (without extension)
    
    Returns:
        Path to the created logo file, or None if failed
    """
    # Create output directory if needed
    os.makedirs(output_dir, exist_ok=True)
    
    # Define output path
    output_path = os.path.join(output_dir, f"{official_name}.png")
    
    print(f"Input:  {input_path}")
    print(f"Output: {output_path}")
    print(f"Official name: {official_name}.png")
    
    # Check which optimization method to use
    if check_pillow():
        print("\n1. Attempting optimization with Pillow...")
        if optimize_with_pillow(input_path, output_path):
            return output_path
    
    if check_imagemagick():
        print("\n1. Attempting optimization with ImageMagick...")
        if optimize_with_imagemagick(input_path, output_path):
            return output_path
    
    # Fallback to simple copy
    print("\n1. No optimization libraries found, using simple copy...")
    if simple_copy(input_path, output_path):
        return output_path
    
    return None

def create_readme(output_dir: str, logo_path: str, official_name: str) -> bool:
    """Create a README file explaining the logo."""
    readme_path = os.path.join(output_dir, "LOGO_README.md")
    
    import time
    created_time = os.path.getctime(logo_path)
    created_date = time.strftime('%Y-%m-%d', time.localtime(created_time))
    
    content = f"""# Guardian VS Logo

## Official Logo File
- **File**: `{official_name}.png`
- **Source**: Generated from ChatGPT-created design
- **Purpose**: Official branding logo for Guardian VS extension

## Usage Guidelines
1. Use this logo for all official Guardian VS branding
2. Maintain aspect ratio when resizing
3. Use PNG format for digital applications
4. For print, consider vector formats if available

## File Details
- **Format**: PNG
- **Location**: `{logo_path}`
- **Created**: {created_date}
- **Size**: {os.path.getsize(logo_path):,} bytes

## Optimization Notes
This logo has been optimized for:
- Web and digital use
- Fast loading in VS Code Marketplace
- Clear display at various sizes

## Original Source
The original ChatGPT-generated file is preserved in `../logo/` directory.
"""
    
    try:
        with open(readme_path, 'w') as f:
            f.write(content)
        print(f"\n✓ Created README: {readme_path}")
        return True
    except Exception as e:
        print(f"\n✗ Failed to create README: {e}")
        return False

def main():
    # Paths
    script_dir = Path(__file__).parent
    assets_dir = script_dir / 'guardian-vs' / 'assets'
    logo_dir = assets_dir / 'logo'
    output_dir = assets_dir / 'official-logos'  # New directory for official logos
    
    # Input file (ChatGPT-generated logo)
    input_file = logo_dir / 'ChatGPT Image Feb 18, 2026, 11_49_01 PM.png'
    
    # Official name
    official_name = "guardian-vs-logo"
    
    # Check if input exists
    if not input_file.exists():
        print(f"✗ Input file not found: {input_file}")
        sys.exit(1)
    
    print("=" * 60)
    print("GUARDIAN VS LOGO OPTIMIZATION TOOL")
    print("=" * 60)
    
    # Create official logo
    logo_path = create_official_logo(str(input_file), str(output_dir), official_name)
    
    if not logo_path:
        print("\n✗ Failed to create official logo")
        sys.exit(1)
    
    # Create README
    print("\n2. Creating documentation...")
    create_readme(str(output_dir), logo_path, official_name)
    
    # Final summary
    print("\n" + "=" * 60)
    print("✅ OPTIMIZATION COMPLETE")
    print("=" * 60)
    print(f"Official logo created: {logo_path}")
    
    # Show comparison
    original_size = os.path.getsize(input_file)
    new_size = os.path.getsize(logo_path)
    
    if original_size != new_size:
        reduction = ((original_size - new_size) / original_size) * 100
        print(f"Size reduction: {original_size:,} bytes → {new_size:,} bytes ({reduction:.1f}% smaller)")
    else:
        print(f"File size: {new_size:,} bytes (no optimization available)")
    
    print(f"\nNext steps:")
    print(f"1. Use '{official_name}.png' for all official branding")
    print(f"2. Update any references to use the new official logo")
    print(f"3. Check the LOGO_README.md for usage guidelines")
    print("\n" + "=" * 60)

if __name__ == '__main__':
    main()