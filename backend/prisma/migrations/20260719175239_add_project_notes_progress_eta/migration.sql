-- AlterTable
ALTER TABLE "Project" ADD COLUMN     "eta" TIMESTAMP(3),
ADD COLUMN     "notes" TEXT,
ADD COLUMN     "progressPercent" INTEGER NOT NULL DEFAULT 0;
