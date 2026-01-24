
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "      CRM SELF-HEALING FIX SCRIPT         " -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan

$schemaPath = "prisma\schema.prisma"
$content = Get-Content $schemaPath -Raw

if ($content -notmatch "model CalendarEvent") {
    Write-Host "1. Restoring Schema Code..." -ForegroundColor Yellow
    $modelDef = "
model CalendarEvent {
  id          Int      @id @default(autoincrement())
  title       String
  description String?
  date        DateTime
  type        String   @default(""Activity"")
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
"
    Add-Content -Path $schemaPath -Value $modelDef
    Write-Host "   - Schema Restored." -ForegroundColor Green
}
else {
    Write-Host "1. Schema was already correct." -ForegroundColor Green
}

Write-Host "2. Killing background Node.js processes..." -ForegroundColor Yellow
Stop-Process -Name "node" -Force -ErrorAction SilentlyContinue
Write-Host "   - Processes killed." -ForegroundColor Green

Write-Host "3. Updating Database Client..." -ForegroundColor Yellow
cmd /c "npx prisma generate"

if ($LASTEXITCODE -eq 0) {
    Write-Host "4. Starting Server..." -ForegroundColor Green
    cmd /c "npm run dev"
}
else {
    Write-Host "!!! ERROR: Generation Failed !!!" -ForegroundColor Red
    Read-Host "Press Enter to exit..."
}
