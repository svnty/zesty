/*
  Warnings:

  - You are about to alter the column `title` on the `PrivateAd` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(200)`.
  - You are about to alter the column `description` on the `PrivateAd` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(3000)`.
  - A unique constraint covering the columns `[userId,default]` on the table `Images` will be added. If there are existing duplicate values, this will fail.
  - Made the column `dob` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('MALE', 'FEMALE', 'TRANS');

-- CreateEnum
CREATE TYPE "PrivateAdCustomerCategory" AS ENUM ('MEN', 'WOMEN', 'GROUPS', 'TRANSGENDER', 'DISABLED');

-- CreateEnum
CREATE TYPE "PrivateAdServiceCategory" AS ENUM ('IN_CALL', 'OUT_CALL', 'PUBLIC_LOCATION', 'OVERNIGHT');

-- CreateEnum
CREATE TYPE "DaysAvailable" AS ENUM ('MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY');

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "PrivateAdServiceType" ADD VALUE 'MEET_AND_GREET';
ALTER TYPE "PrivateAdServiceType" ADD VALUE 'ANAL';

-- AlterTable
ALTER TABLE "Images" ADD COLUMN     "default" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "PrivateAd" ADD COLUMN     "acceptsGender" "PrivateAdCustomerCategory"[],
ADD COLUMN     "acceptsRace" "Race"[],
ALTER COLUMN "title" SET DATA TYPE VARCHAR(200),
ALTER COLUMN "description" SET DATA TYPE VARCHAR(3000);

-- AlterTable
ALTER TABLE "PrivateAdService" ADD COLUMN     "category" "PrivateAdServiceCategory" NOT NULL DEFAULT 'IN_CALL',
ADD COLUMN     "days" "DaysAvailable"[],
ADD COLUMN     "isExtra" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "gender" "Gender",
ALTER COLUMN "dob" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Images_userId_default_key" ON "Images"("userId", "default");
