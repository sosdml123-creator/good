Add-Type -AssemblyName System.Drawing
$bmp = New-Object System.Drawing.Bitmap 1080, 560
$g = [System.Drawing.Graphics]::FromImage($bmp)
$rect = New-Object System.Drawing.Rectangle 0,0,1080,560
$br = New-Object System.Drawing.Drawing2D.LinearGradientBrush -ArgumentList $rect, ([System.Drawing.Color]::FromArgb(235,6,10,18)), ([System.Drawing.Color]::FromArgb(0,6,10,18)), ([single]90)
$g.FillRectangle($br,$rect); $g.Dispose(); $bmp.Save('D:/good/store-assets/ad-creatives/_work/veil.png')
