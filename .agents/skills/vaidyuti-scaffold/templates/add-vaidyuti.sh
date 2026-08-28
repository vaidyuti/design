#!/bin/sh
# Add Vaidyuti components by name.
#
# The shadcn CLI's `@vaidyuti/<name>` namespace currently breaks because the
# registry serves items at `.../{name}/{name}.json` and the CLI only
# substitutes the first `{name}` placeholder. Until that's fixed upstream,
# this script expands names into direct registry item URLs, which work fine
# (including cross-component registryDependencies, which vaidyuti publishes
# as absolute URLs).
#
# Usage: pnpm vaidyuti:add button combobox data-table
set -e

if [ $# -eq 0 ]; then
  echo "Usage: pnpm vaidyuti:add <component> [<component> ...]" >&2
  echo "Browse components at https://ui.vaidyuti.in" >&2
  exit 1
fi

urls=""
for name in "$@"; do
  urls="$urls https://ui.vaidyuti.in/registry/vaidyuti/$name/$name.json"
done

# shellcheck disable=SC2086
exec pnpm dlx shadcn@latest add --yes --overwrite $urls
