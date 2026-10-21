#!/bin/bash
echo "Branch: $(git branch --show-current)"
echo "Commits vs main:"
git log main..HEAD --oneline
echo "Files changed:"
git diff main...HEAD --stat