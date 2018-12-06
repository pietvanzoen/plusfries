#!/bin/bash
# Install project githooks for development.

set -e

# Test if we're installed inside another project. If so, exit.
SCRIPTPATH="$( cd "$(dirname "$0")" ; pwd -P )"
[[ "$SCRIPTPATH" == */node_modules/* ]] && exit 0

[[ $CI ]] && echo "CI environment. Skipping git-hooks install." && exit 0

repo_root=$(git rev-parse --show-toplevel)

# find executable files in git-hooks folder
executable_hooks=$(find $repo_root/scripts/git-hooks -type f -executable)

# symlink them to the .git/hooks/ folder
echo "$executable_hooks" | xargs -I {} sh -c 'ln -sf {} .git/hooks/$(basename {})'

echo "git hooks installed"
