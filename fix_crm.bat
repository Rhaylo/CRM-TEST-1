@echo off
echo Restoring Schema...
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
    echo Schema updated.
) else (
    echo Schema already correct.
)

echo Generating Client...
call npx prisma generate

if %errorlevel% neq 0 (
    echo.
    echo ERROR: Could not generate client.
    echo PLEASE STOP YOUR SERVER (CTRL+C) AND RUN THIS AGAIN.
    pause
    exit /b 1
)

echo.
echo SUCCESS! You can now run 'npm run dev'.
pause
