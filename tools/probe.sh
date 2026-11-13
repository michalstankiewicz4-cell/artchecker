#!/bin/bash
# Rozpoznanie źródeł modeli 3D (uruchamiane w GitHub Actions).
UA="Mozilla/5.0 (artchecker-fetch; GitHub Actions)"
echo "=== ids media_view"; curl -sL -A "$UA" "https://ids.si.edu/ids/media_view?id=3d_package:d2887438-0f09-4e72-887d-0966ff177149" -o /tmp/p1; file /tmp/p1; ls -la /tmp/p1; (unzip -l /tmp/p1 2>/dev/null || head -c 600 /tmp/p1)
echo "=== 3d-api search"; curl -sL -A "$UA" "https://3d-api.si.edu/api/v1.0/content/file/search?q=NPG.2008.3" | head -c 3000; echo
echo "=== 3d.si.edu search"; curl -sL -A "$UA" "https://3d.si.edu/search/results?search_api_fulltext=garfield" | grep -oE 'href="/object/3d/[^"]+"' | sort -u | head
echo "=== edan collections"; curl -sL -A "$UA" "https://collections.si.edu/search/detail/edanmdm:npg_NPG.2008.3" | grep -oE '(https?:)?//[^"]*(3d-api|ids\.si\.edu|\.glb|\.zip)[^"]*' | sort -u | head -20
echo "=== threedscans napoleon"; for u in "http://threedscans.com/lincoln/napoleon/" "https://threedscans.com/lincoln/napoleon/"; do curl -sL -A "$UA" "$u" | grep -oE 'href="[^"]+\.(zip|stl|obj|ply)"' | sort -u; done
curl -sL -A "$UA" "https://threedscans.com/lincoln/napoleon/" | grep -ioE '(s3[^"]*|download[^"]*)' | sort -u | head -20
