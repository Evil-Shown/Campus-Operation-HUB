param(
    [string]$DbHost = "db.wlcuxirbokzooxfxqtur.supabase.co",
    [string]$DbPort = "5432",
    [string]$DbName = "postgres",
    [string]$DbUser = "postgres",
    [string]$DbPassword
)

if (-not $DbPassword) {
    $securePassword = Read-Host "Enter Supabase DB password" -AsSecureString
    $bstr = [System.Runtime.InteropServices.Marshal]::SecureStringToBSTR($securePassword)
    $DbPassword = [System.Runtime.InteropServices.Marshal]::PtrToStringAuto($bstr)
}

$env:SPRING_DATASOURCE_URL = "jdbc:postgresql://$DbHost`:$DbPort/$DbName?sslmode=require"
$env:SPRING_DATASOURCE_USERNAME = $DbUser
$env:SPRING_DATASOURCE_PASSWORD = $DbPassword
$env:SPRING_JPA_HIBERNATE_DDL_AUTO = "update"

Write-Host "Using Supabase DB: $DbHost/$DbName"
Write-Host "Starting Spring Boot with cloud datasource..."

Set-Location $PSScriptRoot
.\mvnw.cmd spring-boot:run
