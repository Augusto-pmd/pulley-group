-- AlterTable
ALTER TABLE "Emma" 
ADD COLUMN "capitalInicial" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN "aportePeriodico" DOUBLE PRECISION;

-- Update existing rows to have default values
UPDATE "Emma" 
SET "capitalInicial" = 0 
WHERE "capitalInicial" IS NULL;

-- Make startDate required (if it was optional before)
ALTER TABLE "Emma" 
ALTER COLUMN "startDate" SET NOT NULL;

