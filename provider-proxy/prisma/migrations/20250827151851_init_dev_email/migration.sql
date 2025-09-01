-- CreateTable
CREATE TABLE "RawEmail" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "source" TEXT NOT NULL,
    "subject" TEXT,
    "receivedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "rawHeaders" TEXT,
    "rawBody" TEXT,
    "attachments" TEXT,
    "parsed" BOOLEAN NOT NULL DEFAULT false,
    "error" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "DMARCReport" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "rawEmailId" TEXT,
    "org" TEXT,
    "reportId" TEXT,
    "domain" TEXT,
    "dateBegin" INTEGER,
    "dateEnd" INTEGER,
    "policyAdkim" TEXT,
    "policyAspf" TEXT,
    "policyP" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "DMARCReport_rawEmailId_fkey" FOREIGN KEY ("rawEmailId") REFERENCES "RawEmail" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "DMARCRecord" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "reportId" TEXT NOT NULL,
    "sourceIp" TEXT,
    "count" INTEGER DEFAULT 0,
    "disposition" TEXT,
    "dkim" TEXT,
    "spf" TEXT,
    "headerFrom" TEXT,
    "authDkim" TEXT,
    "authSpf" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "DMARCRecord_reportId_fkey" FOREIGN KEY ("reportId") REFERENCES "DMARCReport" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "DMARCReport_domain_idx" ON "DMARCReport"("domain");

-- CreateIndex
CREATE INDEX "DMARCReport_reportId_idx" ON "DMARCReport"("reportId");

-- CreateIndex
CREATE INDEX "DMARCRecord_sourceIp_idx" ON "DMARCRecord"("sourceIp");
