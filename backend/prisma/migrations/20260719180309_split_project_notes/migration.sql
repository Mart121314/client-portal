-- RenameColumn
ALTER TABLE "Project" RENAME COLUMN "notes" TO "customerNotes";

-- AddColumn
ALTER TABLE "Project" ADD COLUMN "internalNotes" TEXT;
