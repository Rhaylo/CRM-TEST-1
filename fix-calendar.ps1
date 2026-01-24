
$schemaPath = "prisma/schema.prisma"
$content = Get-Content $schemaPath -Raw

if ($content -notmatch "model CalendarEvent") {
    Write-Host "Restoring CalendarEvent model to schema.prisma..." -ForegroundColor Yellow
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
} else {
    Write-Host "Schema already contains CalendarEvent." -ForegroundColor Green
}

Write-Host "Regenerating Prisma Client..." -ForegroundColor Cyan
npx prisma generate

if ($LASTEXITCODE -eq 0) {
    Write-Host "SUCCESS! The database client is updated." -ForegroundColor Green
    Write-Host "You can now start your server with: npm run dev" -ForegroundColor Green
} else {
    Write-Host "ERROR: Failed to generate client. Make sure your server is STOPPED." -ForegroundColor Red
}
