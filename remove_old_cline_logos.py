#!/usr/bin/env python3
"""
Remove old Cline logo files that are no longer needed.
"""

import os
from pathlib import Path

def remove_old_cline_logos():
    """Remove old Cline logo files that have been replaced."""
    docs_assets_dir = Path(__file__).parent / 'guardian-vs' / 'docs' / 'assets'
    
    cline_files = [
        'Cline_Logo-complete_black.png',
        'Cline_Logo-complete_white.png'
    ]
    
    removed = []
    failed = []
    
    for filename in cline_files:
        file_path = docs_assets_dir / filename
        if file_path.exists():
            try:
                os.remove(file_path)
                removed.append(filename)
                print(f"✓ Removed {filename}")
            except Exception as e:
                failed.append(f"{filename}: {e}")
                print(f"✗ Failed to remove {filename}: {e}")
        else:
            print(f"ℹ {filename} not found (already removed)")
    
    return removed, failed

def main():
    print("=== Removing old Cline logo files ===\n")
    
    print("Note: Original files are backed up in docs/assets/backup/")
    print("These files are no longer referenced in docs.json\n")
    
    removed, failed = remove_old_cline_logos()
    
    if removed:
        print(f"\n✅ Removed {len(removed)} Cline logo file(s):")
        for filename in removed:
            print(f"   - {filename}")
    
    if failed:
        print(f"\n⚠ Failed to remove {len(failed)} file(s):")
        for error in failed:
            print(f"   - {error}")
    
    if not removed and not failed:
        print("\nℹ No Cline logo files found to remove")

if __name__ == '__main__':
    main()