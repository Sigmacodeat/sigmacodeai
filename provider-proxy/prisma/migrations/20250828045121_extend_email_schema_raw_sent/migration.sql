-- CreateTable
CREATE TABLE "SentEmail" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "messageId" TEXT,
    "from" TEXT NOT NULL,
    "to" TEXT NOT NULL,
    "cc" TEXT,
    "subject" TEXT,
    "bodyText" TEXT,
    "bodyHtml" TEXT,
    "attachments" TEXT,
    "status" TEXT NOT NULL DEFAULT 'queued',
    "providerId" TEXT,
    "error" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "sentAt" DATETIME
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_RawEmail" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "source" TEXT NOT NULL,
    "subject" TEXT,
    "receivedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "messageId" TEXT,
    "imapUid" INTEGER,
    "mailbox" TEXT NOT NULL DEFAULT 'INBOX',
    "rawHeaders" TEXT,
    "rawBody" TEXT,
    "headers" TEXT,
    "attachments" TEXT,
    "hasAttachments" BOOLEAN NOT NULL DEFAULT false,
    "size" INTEGER,
    "from" TEXT,
    "to" TEXT,
    "cc" TEXT,
    "parsed" BOOLEAN NOT NULL DEFAULT false,
    "error" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_RawEmail" ("attachments", "createdAt", "error", "id", "imapUid", "messageId", "parsed", "rawBody", "rawHeaders", "receivedAt", "source", "subject", "updatedAt") SELECT "attachments", "createdAt", "error", "id", "imapUid", "messageId", "parsed", "rawBody", "rawHeaders", "receivedAt", "source", "subject", "updatedAt" FROM "RawEmail";
DROP TABLE "RawEmail";
ALTER TABLE "new_RawEmail" RENAME TO "RawEmail";
CREATE UNIQUE INDEX "RawEmail_messageId_key" ON "RawEmail"("messageId");
CREATE INDEX "RawEmail_imapUid_idx" ON "RawEmail"("imapUid");
CREATE INDEX "RawEmail_receivedAt_idx" ON "RawEmail"("receivedAt");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "SentEmail_messageId_key" ON "SentEmail"("messageId");

-- CreateIndex
CREATE INDEX "SentEmail_status_idx" ON "SentEmail"("status");

-- CreateIndex
CREATE INDEX "SentEmail_createdAt_idx" ON "SentEmail"("createdAt");
