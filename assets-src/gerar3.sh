#!/usr/bin/env bash
cd "$(dirname "$0")"
gen(){ n="$1"; ar="$2"; p="$3"; [ -f "$n.png" ] && return
  url=$(higgsfield generate create z_image --prompt "$p" --aspect_ratio "$ar" --wait --json </dev/null 2>/dev/null | python -c "import json,sys;print(json.load(sys.stdin)[0]['result_url'])")
  [ -n "$url" ] && curl -sSL -o "$n.png" "$url" && echo "ok $n" || echo "FALHOU $n"; }
while IFS=$'\t' read -r n ar p; do gen "$n" "$ar" "$p"; done < prompts3.tsv
wait; ls *.png | wc -l
