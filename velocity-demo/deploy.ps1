Copy-Item ".\index.source.html" ".\index.html" -Force
npm run build
Remove-Item ".\assets" -Recurse -Force -ErrorAction SilentlyContinue
Remove-Item ".\index.html" -Force -ErrorAction SilentlyContinue
Copy-Item ".\dist\*" -Destination "." -Recurse -Force
