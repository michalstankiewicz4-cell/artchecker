#!/bin/bash
UA="Mozilla/5.0 (artchecker-fetch; GitHub Actions)"
curl -sL -A "$UA" "https://threedscans.com/lincoln/napoleon/" > /tmp/n.html; grep -n -i -B3 -A3 "download" /tmp/n.html | head -80
echo "=== garfield low glb size"; curl -sIL "https://3d-api.si.edu/content/document/3d_package:d2887438-0f09-4e72-887d-0966ff177149/james-garfield-bronze-sculpture-150k-1024-low.glb" | grep -i "content-length\|HTTP/"
curl -sIL "https://3d-api.si.edu/content/document/3d_package:d2887438-0f09-4e72-887d-0966ff177149/james-garfield-bronze-sculpture-20k-512-thumb.glb" | grep -i "content-length\|HTTP/"
