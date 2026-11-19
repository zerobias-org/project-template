#!/bin/sh
# Create package/<vendor>/<name>/ from templates/starter/.
#
#   sh scripts/new-template.sh <vendor> <name>
#   sh scripts/new-template.sh zerobias security_review
#
# Sets the npm name (@zerobias-org/project-template-<vendor>-<name>) and the
# package code (<vendor>.<name>.project_template), names the template
# <name>.yml, writes a new lowercase UUID into its id, and copies the starter
# README.md (the template's documentation) and files/ folder.

set -eu

if [ $# -ne 2 ]; then
  echo "Usage: $0 <vendor> <name>" >&2
  exit 1
fi

VENDOR=$1
NAME=$2
ROOT=$(cd "$(dirname "$0")/.." && pwd)
SRC="$ROOT/templates/starter"
DIR="$ROOT/package/$VENDOR/$NAME"

for v in "$VENDOR" "$NAME"; do
  echo "$v" | grep -Eq '^[a-z0-9_]+$' || { echo "'$v' must match ^[a-z0-9_]+\$" >&2; exit 1; }
done
[ -e "$DIR" ] && { echo "$DIR already exists" >&2; exit 1; }

ID=$(uuidgen | tr 'A-Z' 'a-z')

mkdir -p "$DIR"
cp "$SRC/.npmrc" "$SRC/build.gradle.kts" "$DIR/"
mkdir -p "$DIR/files"
sed -e "s/REPLACE-VENDOR/$VENDOR/g" -e "s/REPLACE-NAME/$NAME/g" "$SRC/files/OPERATING.md" > "$DIR/files/OPERATING.md"
sed -e "s/REPLACE-VENDOR/$VENDOR/g" -e "s/REPLACE-NAME/$NAME/g" "$SRC/package.json" > "$DIR/package.json"
sed -e "s/REPLACE-VENDOR/$VENDOR/g" -e "s/REPLACE-NAME/$NAME/g" "$SRC/README.md" > "$DIR/README.md"
sed -e "s/REPLACE-WITH-NEW-UUID/$ID/" -e "s/REPLACE-VENDOR/$VENDOR/g" -e "s/REPLACE-NAME/$NAME/g" "$SRC/starter.yml" > "$DIR/$NAME.yml"

echo "Created $DIR"
echo "  template: $NAME.yml (id $ID)"
echo "Next: replace every REPLACE-... value in $NAME.yml, README.md and files/OPERATING.md, then:"
echo "  unset ZB_SLOT; zbb :$VENDOR:$NAME:validateContent"
