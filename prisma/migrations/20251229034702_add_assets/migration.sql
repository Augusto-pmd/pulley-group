-- CreateTable
CREATE TABLE "Asset" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "fiscalStatus" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "AssetValuation" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "assetId" TEXT NOT NULL,
    "valueUSD" REAL NOT NULL,
    "date" TIMESTAMP NOT NULL,
    CONSTRAINT "AssetValuation_assetId_fkey" FOREIGN KEY ("assetId") REFERENCES "Asset" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Liability" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "assetId" TEXT NOT NULL,
    "totalAmountUSD" REAL NOT NULL,
    "remainingAmountUSD" REAL NOT NULL,
    "installmentsTotal" INTEGER NOT NULL,
    "installmentsRemaining" INTEGER NOT NULL,
    "monthlyInstallmentUSD" REAL NOT NULL,
    CONSTRAINT "Liability_assetId_fkey" FOREIGN KEY ("assetId") REFERENCES "Asset" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Liability_assetId_key" ON "Liability"("assetId");
