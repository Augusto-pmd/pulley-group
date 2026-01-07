-- CreateTable
CREATE TABLE "Emma" (
    "id" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "capitalInicial" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "aportePeriodico" DOUBLE PRECISION,
    "expectedRate" DOUBLE PRECISION NOT NULL,
    "horizon" INTEGER NOT NULL,
    "contributionFrequency" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Emma_pkey" PRIMARY KEY ("id")
);

