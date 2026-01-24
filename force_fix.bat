@echo off
echo.
echo ==========================================
echo      CRM SELF-HEALING FIX SCRIPT
echo ==========================================
echo.
echo 1. Restoring Schema Code...
type prisma\schema.prisma | findstr "CalendarEvent" >nul
if %errorlevel% neq 0 (
    (
        echo.
        echo model CalendarEvent {
        echo   id          Int      @id @default(autoincrement^)
        echo   title       String
        echo   description String?
        echo   date        DateTime
        echo   type        String   @default("Activity"^)
        echo   createdAt   DateTime @default(now^^(^)
        echo   updatedAt   DateTime @updatedAt
        echo }
    ) >> prisma\schema.prisma
    echo    - Schema Restored.
) else (
    echo    - Schema was already correct.
)

echo.
echo 2. Killing ANY background servers...
taskkill /F /IM node.exe >nul 2>&1
echo    - Processes killed.

echo.
echo 3. Updating Database Client...
call npx prisma generate
if %errorlevel% neq 0 (
    echo.
    echo    !!! ERROR: Generation Failed !!!
    pause
    exit /b 1
)

echo.
echo 4. Starting Server...
echo.
echo    (You can verify the fix now!)
echo.
npm run dev
