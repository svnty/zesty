/*
  Warnings:

  - The values [SLIM,AVERAGE,PLUS_SIZE] on the enum `BodyType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "BodyType_new" AS ENUM ('REGULAR', 'PLUS', 'ATHLETE');
ALTER TABLE "User" ALTER COLUMN "bodyType" TYPE "BodyType_new" USING ("bodyType"::text::"BodyType_new");
ALTER TYPE "BodyType" RENAME TO "BodyType_old";
ALTER TYPE "BodyType_new" RENAME TO "BodyType";
DROP TYPE "public"."BodyType_old";
COMMIT;
