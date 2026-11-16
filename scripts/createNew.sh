#!/bin/sh

set -x

# ============================================================================
# Create a new content package in the vendor/suite/version structure.
#
# Usage varies by directory depth:
#   1-level (vendor):   ./scripts/createNew.sh <vendor>
#   2-level (product):  ./scripts/createNew.sh <vendor> <code>
#   3-level (standard): ./scripts/createNew.sh <vendor> <suite> <version>
#
# Update this script for your artifact type's directory depth.
# ============================================================================

if [ $# -lt 3 ]; then
    echo "Usage: $0 <vendor> <suite> <version>"
    exit 1
fi

BASE_DIR=$(dirname $0)
VENDOR=$1
SUITE=$2
VERSION=$3
EDITED_VERSION=$(echo $VERSION | sed "s/\./_/g")
CODE="${VENDOR}_${SUITE}_${EDITED_VERSION}"
FOLDER_PATH="$BASE_DIR/../package/$VENDOR/$SUITE/$EDITED_VERSION"

if [ ! -d "$FOLDER_PATH" ]; then
  echo "Creating folder $FOLDER_PATH."
  mkdir -p $FOLDER_PATH
fi

cp -r $BASE_DIR/../templates/* $FOLDER_PATH
cp $BASE_DIR/../templates/.npmrc $FOLDER_PATH

sed -i '' "s/{vendor}/$VENDOR/g" $FOLDER_PATH/package.json
sed -i '' "s/{suite}/$SUITE/g" $FOLDER_PATH/package.json
sed -i '' "s/{version}/$EDITED_VERSION/g" $FOLDER_PATH/package.json

UUID=$(uuidgen | tr '[:upper:]' '[:lower:]')
sed -i '' "s/{id}/$UUID/g" $FOLDER_PATH/index.yml
sed -i '' "s/{code}/$CODE/g" $FOLDER_PATH/index.yml
sed -i '' "s/{version}/$VERSION/g" $FOLDER_PATH/index.yml
sed -i '' "s/{vendor}/$VENDOR/g" $FOLDER_PATH/index.yml

echo ""
echo "Created new package at: $FOLDER_PATH"
echo "Next steps:"
echo "  1. Update index.yml - fill in name, description, externalId, url"
echo "  2. Update package.json - fill in description"
echo "  3. Add content files (elements/, baselines/, etc.)"
echo "  4. Run: cd $FOLDER_PATH && npm run validate"
