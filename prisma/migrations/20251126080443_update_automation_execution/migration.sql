-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_AutomationExecution" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "ruleId" INTEGER,
    "status" TEXT NOT NULL,
    "startedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" DATETIME,
    "duration" INTEGER,
    "error" TEXT,
    "metadata" TEXT,
    CONSTRAINT "AutomationExecution_ruleId_fkey" FOREIGN KEY ("ruleId") REFERENCES "AutomationRule" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_AutomationExecution" ("completedAt", "error", "id", "metadata", "ruleId", "startedAt", "status") SELECT "completedAt", "error", "id", "metadata", "ruleId", "startedAt", "status" FROM "AutomationExecution";
DROP TABLE "AutomationExecution";
ALTER TABLE "new_AutomationExecution" RENAME TO "AutomationExecution";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
