/*
  Warnings:

  - A unique constraint covering the columns `[messageId]` on the table `RawEmail` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "RawEmail" ADD COLUMN "imapUid" INTEGER;
ALTER TABLE "RawEmail" ADD COLUMN "messageId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "RawEmail_messageId_key" ON "RawEmail"("messageId");

-- CreateIndex
CREATE INDEX "RawEmail_imapUid_idx" ON "RawEmail"("imapUid");
