$files = @('frontend\public\passbook.html', 'frontend\public\dashboard.html')
foreach ($f in $files) {
    $content = Get-Content $f -Raw -Encoding UTF8
    $content = $content -replace ',1', '?'
    $content = $content -replace '\?\?\?', '•••'
    $content = $content -replace 'â‚¹', '?'
    $content = $content -replace 'â€¢', '•'
    $content | Set-Content $f -Encoding UTF8
}
