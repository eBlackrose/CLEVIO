/*
  Warnings:

  - Added the required column `companyId` to the `AdvisorySession` table without a default value. This is not possible if the table is not empty.
  - Added the required column `companyId` to the `AmexCard` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_AdvisorySession" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "type" TEXT NOT NULL,
    "date" DATETIME NOT NULL,
    "time" TEXT NOT NULL,
    "duration" INTEGER NOT NULL,
    "advisor" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "meetingLink" TEXT,
    "notes" TEXT,
    "companyId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "AdvisorySession_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_AdvisorySession" ("advisor", "createdAt", "date", "duration", "id", "meetingLink", "notes", "status", "time", "type", "updatedAt") SELECT "advisor", "createdAt", "date", "duration", "id", "meetingLink", "notes", "status", "time", "type", "updatedAt" FROM "AdvisorySession";
DROP TABLE "AdvisorySession";
ALTER TABLE "new_AdvisorySession" RENAME TO "AdvisorySession";
CREATE INDEX "AdvisorySession_date_idx" ON "AdvisorySession"("date");
CREATE INDEX "AdvisorySession_companyId_idx" ON "AdvisorySession"("companyId");
CREATE TABLE "new_AmexCard" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "last4" TEXT NOT NULL,
    "cardName" TEXT NOT NULL,
    "expiryMonth" INTEGER,
    "expiryYear" INTEGER,
    "token" TEXT,
    "connected" BOOLEAN NOT NULL DEFAULT false,
    "companyId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "AmexCard_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_AmexCard" ("cardName", "connected", "createdAt", "expiryMonth", "expiryYear", "id", "last4", "token", "updatedAt") SELECT "cardName", "connected", "createdAt", "expiryMonth", "expiryYear", "id", "last4", "token", "updatedAt" FROM "AmexCard";
DROP TABLE "AmexCard";
ALTER TABLE "new_AmexCard" RENAME TO "AmexCard";
CREATE UNIQUE INDEX "AmexCard_companyId_key" ON "AmexCard"("companyId");
CREATE INDEX "AmexCard_last4_idx" ON "AmexCard"("last4");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
