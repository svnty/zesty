-- DropIndex
DROP INDEX "public"."Images_userId_default_key";

-- CreateIndex
CREATE INDEX "images_userId_idx" ON "Images"("userId");

-- CreateIndex (Partial unique index: only one default image per user)
CREATE UNIQUE INDEX "Images_userId_default_key" ON "Images"("userId", "default") WHERE "default" = true;
