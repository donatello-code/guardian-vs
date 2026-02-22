#!/usr/bin/env python3
"""
Automate VSIX creation and version iteration for Guardian VS extension.
Simplifies the release process with a single command.
"""

import os
import sys
import json
import re
import subprocess
import argparse
from pathlib import Path
from typing import Optional, Tuple, Dict, Any
from datetime import datetime

class VSIXAutomator:
    """Automate VSIX release process."""
    
    def __init__(self, project_root: str = "."):
        self.project_root = Path(project_root).resolve()
        self.guardian_dir = self.project_root / "guardian-vs"
        self.package_json_path = self.guardian_dir / "package.json"
        
        if not self.package_json_path.exists():
            raise FileNotFoundError(f"package.json not found at {self.package_json_path}")
    
    def read_current_version(self) -> str:
        """Read current version from package.json."""
        with open(self.package_json_path, 'r') as f:
            package_data = json.load(f)
        
        return package_data.get("version", "0.0.0")
    
    def parse_version(self, version: str) -> Tuple[int, int, int]:
        """Parse semantic version string into components."""
        match = re.match(r'^(\d+)\.(\d+)\.(\d+)$', version)
        if not match:
            raise ValueError(f"Invalid version format: {version}")
        
        return tuple(map(int, match.groups()))
    
    def increment_version(self, current_version: str, increment_type: str = "patch") -> str:
        """
        Increment version based on type.
        
        Args:
            current_version: Current version string (e.g., "1.2.3")
            increment_type: One of "major", "minor", "patch", or "custom:X.Y.Z"
        
        Returns:
            New version string
        """
        if increment_type.startswith("custom:"):
            # Custom version like "custom:3.99.0"
            return increment_type.split(":", 1)[1]
        
        major, minor, patch = self.parse_version(current_version)
        
        if increment_type == "major":
            return f"{major + 1}.0.0"
        elif increment_type == "minor":
            return f"{major}.{minor + 1}.0"
        elif increment_type == "patch":
            return f"{major}.{minor}.{patch + 1}"
        else:
            raise ValueError(f"Unknown increment type: {increment_type}")
    
    def update_package_json(self, new_version: str) -> None:
        """Update version in package.json."""
        with open(self.package_json_path, 'r') as f:
            package_data = json.load(f)
        
        old_version = package_data.get("version", "0.0.0")
        package_data["version"] = new_version
        
        with open(self.package_json_path, 'w') as f:
            json.dump(package_data, f, indent=2)
        
        print(f"✓ Updated package.json: {old_version} → {new_version}")
    
    def run_command(self, cmd: str, cwd: Optional[Path] = None, check: bool = True) -> subprocess.CompletedProcess:
        """Run a shell command and return result."""
        if cwd is None:
            cwd = self.guardian_dir
        
        print(f"  Running: {cmd}")
        result = subprocess.run(cmd, shell=True, cwd=cwd, capture_output=True, text=True)
        
        if check and result.returncode != 0:
            print(f"  ✗ Command failed with exit code {result.returncode}")
            print(f"  stderr: {result.stderr}")
            raise subprocess.CalledProcessError(result.returncode, cmd, result.stdout, result.stderr)
        
        return result
    
    def build_vsix(self, output_name: Optional[str] = None) -> Path:
        """
        Build VSIX file.
        
        Args:
            output_name: Custom output name (without .vsix extension)
        
        Returns:
            Path to created VSIX file
        """
        if output_name is None:
            version = self.read_current_version()
            output_name = f"guardian-vs-{version}"
        
        # Ensure output is in project root (parent of guardian-vs directory)
        output_path = self.project_root / f"{output_name}.vsix"
        
        print(f"\nBuilding VSIX: {output_path.name}")
        
        # Run vsce package command
        cmd = f'npx vsce package --allow-package-secrets sendgrid --out "{output_path}"'
        result = self.run_command(cmd)
        
        if output_path.exists():
            size = output_path.stat().st_size
            print(f"✓ VSIX created: {output_path.name} ({size:,} bytes)")
            return output_path
        else:
            raise FileNotFoundError(f"VSIX file not created at {output_path}")
    
    def git_commit(self, version: str, message: Optional[str] = None) -> None:
        """Commit changes to git."""
        if message is None:
            message = f"Release {version}: Automated version update and VSIX creation"
        
        print(f"\nCommitting to git: {message}")
        
        # Add package.json
        self.run_command(f'git add "{self.package_json_path.relative_to(self.project_root)}"')
        
        # Commit
        self.run_command(f'git commit -m "{message}"')
        
        print("✓ Git commit created")
    
    def git_push(self, branch: str = "main") -> None:
        """Push to git remote."""
        print(f"\nPushing to git remote (branch: {branch})")
        
        self.run_command(f"git push origin {branch}")
        
        print("✓ Git push completed")
    
    def create_release(
        self,
        increment_type: str = "patch",
        custom_version: Optional[str] = None,
        commit: bool = True,
        push: bool = False,
        build_vsix: bool = True,
        vsix_output_name: Optional[str] = None,
        commit_message: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        Create a complete release.
        
        Args:
            increment_type: "major", "minor", "patch", or "custom:X.Y.Z"
            custom_version: Deprecated, use increment_type="custom:X.Y.Z" instead
            commit: Whether to commit changes
            push: Whether to push to git (requires commit=True)
            build_vsix: Whether to build VSIX file
            vsix_output_name: Custom VSIX output name
            commit_message: Custom commit message
        
        Returns:
            Dictionary with release information
        """
        print("=" * 60)
        print("GUARDIAN VS RELEASE AUTOMATION")
        print("=" * 60)
        
        # Read current version
        current_version = self.read_current_version()
        print(f"Current version: {current_version}")
        
        # Determine new version
        if custom_version:
            new_version = custom_version
            print(f"Custom version specified: {new_version}")
        else:
            new_version = self.increment_version(current_version, increment_type)
            print(f"Increment type: {increment_type}")
            print(f"New version: {new_version}")
        
        # Update package.json
        print("\n1. Updating package.json...")
        self.update_package_json(new_version)
        
        # Build VSIX
        vsix_path = None
        if build_vsix:
            print("\n2. Building VSIX...")
            try:
                vsix_path = self.build_vsix(vsix_output_name)
            except Exception as e:
                print(f"✗ VSIX build failed: {e}")
                if commit:
                    print("  Rolling back version change...")
                    self.update_package_json(current_version)
                raise
        
        # Git commit
        if commit:
            print("\n3. Committing changes...")
            self.git_commit(new_version, commit_message)
            
            # Git push
            if push:
                print("\n4. Pushing to git...")
                self.git_push()
        
        # Summary
        print("\n" + "=" * 60)
        print("✅ RELEASE COMPLETE")
        print("=" * 60)
        print(f"Version: {current_version} → {new_version}")
        
        if vsix_path:
            size = vsix_path.stat().st_size
            print(f"VSIX: {vsix_path.name} ({size:,} bytes)")
        
        if commit:
            print(f"Git: {'Committed' + (' and pushed' if push else '')}")
        
        return {
            "old_version": current_version,
            "new_version": new_version,
            "vsix_path": str(vsix_path) if vsix_path else None,
            "committed": commit,
            "pushed": push if commit else False
        }
    
    def quick_release(self, version_bump: str = "patch") -> Dict[str, Any]:
        """
        Quick release with sensible defaults.
        
        Args:
            version_bump: "patch", "minor", "major", or version like "3.99.0"
        
        Returns:
            Release information
        """
        # Check if version_bump is a full version
        if re.match(r'^\d+\.\d+\.\d+$', version_bump):
            increment_type = f"custom:{version_bump}"
        else:
            increment_type = version_bump
        
        return self.create_release(
            increment_type=increment_type,
            commit=True,
            push=True,
            build_vsix=True,
            commit_message=f"Release {self.read_current_version()}: Automated release"
        )

def main():
    parser = argparse.ArgumentParser(description="Automate VSIX creation and version iteration")
    parser.add_argument("action", nargs="?", default="release", 
                       choices=["release", "version", "build", "info"],
                       help="Action to perform (default: release)")
    
    # Version options
    version_group = parser.add_argument_group("Version options")
    version_group.add_argument("--bump", default="patch",
                              choices=["major", "minor", "patch"],
                              help="Version bump type (default: patch)")
    version_group.add_argument("--version", type=str,
                              help="Set specific version (e.g., 3.99.0)")
    
    # Release options
    release_group = parser.add_argument_group("Release options")
    release_group.add_argument("--no-commit", action="store_true",
                              help="Don't commit changes")
    release_group.add_argument("--no-push", action="store_true",
                              help="Don't push to git (implies commit)")
    release_group.add_argument("--no-build", action="store_true",
                              help="Don't build VSIX")
    release_group.add_argument("--output", type=str,
                              help="Custom VSIX output name (without .vsix)")
    release_group.add_argument("--message", type=str,
                              help="Custom commit message")
    
    # Quick release
    parser.add_argument("--quick", action="store_true",
                       help="Quick release with all defaults (bump, commit, push, build)")
    parser.add_argument("--quick-version", type=str,
                       help="Quick release with specific version (e.g., 3.99.0)")
    
    args = parser.parse_args()
    
    try:
        automator = VSIXAutomator()
        
        if args.action == "info" or (args.action == "release" and args.quick_version):
            current_version = automator.read_current_version()
            print(f"Current version: {current_version}")
            
            if args.quick_version:
                # Quick release with specific version
                result = automator.quick_release(args.quick_version)
                sys.exit(0)
        
        if args.action == "version":
            current_version = automator.read_current_version()
            print(f"Current version: {current_version}")
            
            if args.version:
                automator.update_package_json(args.version)
                print(f"Updated to: {args.version}")
            elif args.bump:
                new_version = automator.increment_version(current_version, args.bump)
                automator.update_package_json(new_version)
                print(f"Updated to: {new_version}")
        
        elif args.action == "build":
            vsix_path = automator.build_vsix(args.output)
            print(f"VSIX built: {vsix_path}")
        
        elif args.action == "release":
            if args.quick:
                result = automator.quick_release(args.bump)
            else:
                # Determine increment type
                if args.version:
                    increment_type = f"custom:{args.version}"
                else:
                    increment_type = args.bump
                
                result = automator.create_release(
                    increment_type=increment_type,
                    commit=not args.no_commit,
                    push=not args.no_push and not args.no_commit,
                    build_vsix=not args.no_build,
                    vsix_output_name=args.output,
                    commit_message=args.message
                )
            
            print("\nRelease summary:")
            for key, value in result.items():
                print(f"  {key}: {value}")
        
        print("\n✅ Done!")
        
    except Exception as e:
        print(f"\n✗ Error: {e}", file=sys.stderr)
        sys.exit(1)

if __name__ == "__main__":
    main()