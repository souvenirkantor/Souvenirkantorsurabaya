$mapping = @{
    "detail-produk-souvenir-1.html" = "tumbler-stainless-premium.html"
    "detail-produk-souvenir-2.html" = "payung-lipat-souvenir-kantor.html"
    "detail-produk-souvenir-3.html" = "tote-bag-seminar-kit.html"
    "detail-produk-souvenir-4.html" = "paket-seminar-premium.html"
    "detail-produk-souvenir-5.html" = "tas-ransel-marchandise.html"
    "detail-produk-souvenir-6.html" = "cangkir-kopi-marchandise.html"
    "portfolio-detail-tb.html" = "portfolio-tumbler-custom.html"
    "portfolio-detail-bag.html" = "portfolio-tote-bag.html"
    "portfolio-detail-tas.html" = "portfolio-tas-ransel.html"
    "portfolio-detail-py.html" = "portfolio-payung-lipat.html"
    "portfolio-detail-pk.html" = "portfolio-paket-seminar-kit.html"
    "portfolio-detail-ck.html" = "portfolio-cangkir-kopi.html"
    "layanan-detail-1.html" = "layanan-souvenir-kustom-perusahaan.html"
    "layanan-detail-2.html" = "layanan-paket-seminar-event.html"
    "layanan-detail-3.html" = "layanan-merchandise-kantor.html"
    "layanan-detail-4.html" = "layanan-souvenir-event-khusus.html"
    "layanan-detail-5.html" = "layanan-paket-event-komplet.html"
    "layanan-detail-6.html" = "layanan-konsultasi-produk.html"
}

cd d:\GM\Souvenirkantorsurabaya-main\Souvenirkantorsurabaya-main

foreach ($key in $mapping.Keys) {
    $val = $mapping[$key]
    $file = $val
    
    # 1. Update the HTML file
    if (Test-Path $file) {
        $content = Get-Content $file -Raw
        $content = $content -replace $key, $val
        Set-Content -Path $file -Value $content
        Write-Host "Updated $file"
    }

    # 2. Update sitemap.xml
    if (Test-Path "sitemap.xml") {
        $sitemap = Get-Content "sitemap.xml" -Raw
        if ($sitemap -match $key) {
            $sitemap = $sitemap -replace $key, $val
            Set-Content -Path "sitemap.xml" -Value $sitemap
            Write-Host "Updated sitemap.xml for $key"
        }
    }
}
Write-Host "Done"
