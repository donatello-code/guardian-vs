# Guardian VS VSIX Automation Script

A comprehensive Python script to automate VSIX creation and version iteration for the Guardian VS extension.

## Features

- **Version Management**: Read, increment (major/minor/patch), or set custom versions
- **VSIX Building**: Automatically build VSIX files with proper naming
- **Git Integration**: Commit version changes and push to remote
- **Flexible Workflows**: Support for different release strategies
- **Error Handling**: Rollback on failure, detailed logging

## Installation

No installation required! Just ensure you have:
- Python 3.6+
- Node.js/npm (for VSIX building)
- Git (for version control operations)

## Quick Start

### 1. Check current version
```bash
python3 automate_vsix_release.py info
```

### 2. Quick release (bump patch version, commit, push, build VSIX)
```bash
python3 automate_vsix_release.py --quick
```

### 3. Quick release with specific version
```bash
python3 automate_vsix_release.py --quick-version 4.0.0
```

## Detailed Usage

### Basic Commands

**Check current version:**
```bash
python3 automate_vsix_release.py info
```

**Update version (patch bump):**
```bash
python3 automate_vsix_release.py version --bump patch
```

**Set specific version:**
```bash
python3 automate_vsix_release.py version --version 3.99.0
```

**Build VSIX only:**
```bash
python3 automate_vsix_release.py build
```

**Build VSIX with custom name:**
```bash
python3 automate_vsix_release.py build --output my-custom-release
```

### Complete Release Workflows

**Standard release (bump, commit, push, build):**
```bash
python3 automate_vsix_release.py release --bump minor
```

**Release without git push:**
```bash
python3 automate_vsix_release.py release --bump patch --no-push
```

**Release without committing:**
```bash
python3 automate_vsix_release.py release --bump major --no-commit
```

**Release without building VSIX:**
```bash
python3 automate_vsix_release.py release --bump patch --no-build
```

**Custom release with all options:**
```bash
python3 automate_vsix_release.py release \
  --version 4.0.0 \
  --output guardian-vs-4.0.0-beta \
  --message "Release 4.0.0: Major update with new features" \
  --no-push
```

## Command Reference

### Positional Arguments
- `action`: Action to perform (`release`, `version`, `build`, `info`)

### Version Options
- `--bump`: Version bump type (`major`, `minor`, `patch`)
- `--version`: Set specific version (e.g., `3.99.0`)

### Release Options
- `--no-commit`: Don't commit changes
- `--no-push`: Don't push to git (implies commit)
- `--no-build`: Don't build VSIX
- `--output`: Custom VSIX output name (without .vsix)
- `--message`: Custom commit message

### Quick Release Options
- `--quick`: Quick release with all defaults
- `--quick-version`: Quick release with specific version

## Examples

### Example 1: Simple patch release
```bash
# This will:
# 1. Bump patch version (3.99.0 → 3.99.1)
# 2. Commit changes
# 3. Push to git
# 4. Build VSIX file
python3 automate_vsix_release.py --quick
```

### Example 2: Major release with custom message
```bash
# This will:
# 1. Bump major version (3.99.0 → 4.0.0)
# 2. Commit with custom message
# 3. Push to git
# 4. Build VSIX named guardian-vs-4.0.0.vsix
python3 automate_vsix_release.py release \
  --bump major \
  --message "Release 4.0.0: Complete rewrite with new architecture"
```

### Example 3: Test build without git operations
```bash
# This will:
# 1. Bump minor version (3.99.0 → 3.100.0)
# 2. Build VSIX without committing
# 3. Keep version change in package.json
python3 automate_vsix_release.py release \
  --bump minor \
  --no-commit \
  --no-build
```

### Example 4: Build existing version
```bash
# This will:
# 1. Build VSIX for current version (3.99.0)
# 2. No version changes or git operations
python3 automate_vsix_release.py build
```

## Integration with Existing Workflow

### Combine with logo optimization:
```bash
# 1. Optimize logos
python3 optimize_guardian_logo.py

# 2. Create release
python3 automate_vsix_release.py --quick
```

### CI/CD Pipeline Example:
```bash
#!/bin/bash
# release.sh
set -e

# Update version
python3 automate_vsix_release.py version --bump minor

# Build VSIX
python3 automate_vsix_release.py build

# Commit and push
python3 automate_vsix_release.py release --no-build
```

## Error Handling

The script includes comprehensive error handling:

1. **VSIX build failure**: Rolls back version change if commit was planned
2. **Git operations**: Checks for git availability and proper configuration
3. **Version validation**: Ensures semantic version format
4. **File permissions**: Checks write access to package.json

## Project Structure

```
automate_vsix_release.py     # Main automation script
AUTOMATE_VSIX_README.md      # This documentation
optimize_guardian_logo.py    # Logo optimization script (companion)
guardian-vs/                 # Guardian VS extension source
  package.json              # Version source file
```

## Related Scripts

- **`optimize_guardian_logo.py`**: Optimize and rename logo files
- **`convert_logo.py`**: Convert logos to different formats
- **`convert_logo_simple.py`**: Simplified logo conversion

## Troubleshooting

### Common Issues

1. **"package.json not found"**: Ensure you're in the project root directory
2. **VSIX build fails**: Check Node.js/npm installation and dependencies
3. **Git operations fail**: Verify git is configured and you have permissions
4. **Permission denied**: Ensure write access to package.json and project files

### Debug Mode
For detailed output, you can modify the script to add `print()` statements or use Python's logging module.

## License

This script is part of the Guardian VS project and follows the same licensing terms.

## Contributing

Feel free to submit issues or pull requests for improvements!