ROOT="./"
KEY="publish"
VALUE="true"

find "$ROOT" -name "*.md" | while read -r file; do
  if grep -q "^$KEY:" "$file"; then
    continue
  fi

  if head -n 1 "$file" | grep -q "^---"; then
    sed -i "1a $KEY: $VALUE" "$file"
  else
    sed -i "1s/^/---\n$KEY: $VALUE\n---\n\n/" "$file"
  fi

  echo "✔ Updated: $file"
done

