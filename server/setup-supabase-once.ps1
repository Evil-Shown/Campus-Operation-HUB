param(
    [string]$DbHost = "db.wlcuxirbokzooxfxqtur.supabase.co",
    [string]$DbPort = "5432",
    [string]$DbName = "postgres",
    [string]$DbUser = "postgres",
    [Parameter(Mandatory = $true)]
    [string]$DbPassword
)

[Environment]::SetEnvironmentVariable(
    "SPRING_DATASOURCE_URL",
    "jdbc:postgresql://$DbHost`:$DbPort/$DbName?sslmode=require",
    "User"
)
[Environment]::SetEnvironmentVariable("SPRING_DATASOURCE_USERNAME", $DbUser, "User")
[Environment]::SetEnvironmentVariable("SPRING_DATASOURCE_PASSWORD", $DbPassword, "User")
[Environment]::SetEnvironmentVariable("SPRING_JPA_HIBERNATE_DDL_AUTO", "update", "User")

Write-Host "Supabase datasource saved to User environment variables."
Write-Host "Open a new terminal, then run:"
Write-Host "  cd server"
Write-Host "  .\mvnw.cmd spring-boot:run"
