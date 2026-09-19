Add-Type -AssemblyName System.Drawing

$srcPath = "d:\good\public\logo.png"
$splashPaths = @(
    "d:\good\ios\App\App\Assets.xcassets\Splash.imageset\splash-2732x2732.png",
    "d:\good\ios\App\App\Assets.xcassets\Splash.imageset\splash-2732x2732-1.png",
    "d:\good\ios\App\App\Assets.xcassets\Splash.imageset\splash-2732x2732-2.png"
)

$srcImg = [System.Drawing.Image]::FromFile($srcPath)

foreach ($splashPath in $splashPaths) {
    $canvasWidth = 2732
    $canvasHeight = 2732
    $bmp = New-Object System.Drawing.Bitmap $canvasWidth, $canvasHeight
    $graphics = [System.Drawing.Graphics]::FromImage($bmp)
    
    $graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
    $graphics.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
    
    # Fill with white background matching the new logo
    $brush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 255, 255, 255))
    $graphics.FillRectangle($brush, 0, 0, $canvasWidth, $canvasHeight)
    
    # Draw logo centered at 720x720 (or 800x800)
    $logoSize = 800
    $destX = [int](($canvasWidth - $logoSize) / 2)
    $destY = [int](($canvasHeight - $logoSize) / 2)
    
    $destRect = New-Object System.Drawing.Rectangle $destX, $destY, $logoSize, $logoSize
    $graphics.DrawImage($srcImg, $destRect)
    
    $bmp.Save($splashPath, [System.Drawing.Imaging.ImageFormat]::Png)
    
    $graphics.Dispose()
    $brush.Dispose()
    $bmp.Dispose()
    Write-Host "Generated splash: $splashPath"
}

$srcImg.Dispose()
