-- CreateEnum
CREATE TYPE "VIPContentType" AS ENUM ('IMAGE', 'VIDEO', 'STATUS');

-- CreateTable
CREATE TABLE "VIPPage" (
    "id" TEXT NOT NULL,
    "title" VARCHAR(200) NOT NULL,
    "description" VARCHAR(3000) NOT NULL,
    "bannerUrl" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "subscriptionPrice" INTEGER NOT NULL DEFAULT 999,
    "isFree" BOOLEAN NOT NULL DEFAULT false,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "VIPPage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VIPContent" (
    "id" TEXT NOT NULL,
    "type" "VIPContentType" NOT NULL,
    "caption" VARCHAR(1000),
    "imageUrl" TEXT,
    "imageWidth" INTEGER,
    "imageHeight" INTEGER,
    "videoUrl" TEXT,
    "thumbnailUrl" TEXT,
    "duration" INTEGER,
    "statusText" VARCHAR(5000),
    "NSFW" BOOLEAN NOT NULL DEFAULT false,
    "vipPageId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "VIPContent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VIPSubscription" (
    "id" TEXT NOT NULL,
    "subscriberId" TEXT NOT NULL,
    "vipPageId" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "expiresAt" TIMESTAMP(3),
    "amountPaid" INTEGER NOT NULL,
    "stripeSubscriptionId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "VIPSubscription_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VIPDiscountOffer" (
    "id" TEXT NOT NULL,
    "vipPageId" TEXT NOT NULL,
    "discountPercent" INTEGER NOT NULL,
    "discountedPrice" INTEGER NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "validFrom" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "validUntil" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "VIPDiscountOffer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VIPLike" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "contentId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "VIPLike_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VIPComment" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "contentId" TEXT NOT NULL,
    "text" VARCHAR(1000) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "VIPComment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "VIPPage_userId_key" ON "VIPPage"("userId");

-- CreateIndex
CREATE INDEX "VIPContent_vipPageId_createdAt_idx" ON "VIPContent"("vipPageId", "createdAt");

-- CreateIndex
CREATE INDEX "VIPSubscription_subscriberId_idx" ON "VIPSubscription"("subscriberId");

-- CreateIndex
CREATE INDEX "VIPSubscription_vipPageId_idx" ON "VIPSubscription"("vipPageId");

-- CreateIndex
CREATE UNIQUE INDEX "VIPSubscription_subscriberId_vipPageId_key" ON "VIPSubscription"("subscriberId", "vipPageId");

-- CreateIndex
CREATE INDEX "VIPDiscountOffer_vipPageId_active_idx" ON "VIPDiscountOffer"("vipPageId", "active");

-- CreateIndex
CREATE INDEX "VIPLike_contentId_idx" ON "VIPLike"("contentId");

-- CreateIndex
CREATE UNIQUE INDEX "VIPLike_userId_contentId_key" ON "VIPLike"("userId", "contentId");

-- CreateIndex
CREATE INDEX "VIPComment_contentId_createdAt_idx" ON "VIPComment"("contentId", "createdAt");

-- AddForeignKey
ALTER TABLE "VIPPage" ADD CONSTRAINT "VIPPage_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VIPContent" ADD CONSTRAINT "VIPContent_vipPageId_fkey" FOREIGN KEY ("vipPageId") REFERENCES "VIPPage"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VIPSubscription" ADD CONSTRAINT "VIPSubscription_subscriberId_fkey" FOREIGN KEY ("subscriberId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VIPSubscription" ADD CONSTRAINT "VIPSubscription_vipPageId_fkey" FOREIGN KEY ("vipPageId") REFERENCES "VIPPage"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VIPDiscountOffer" ADD CONSTRAINT "VIPDiscountOffer_vipPageId_fkey" FOREIGN KEY ("vipPageId") REFERENCES "VIPPage"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VIPLike" ADD CONSTRAINT "VIPLike_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VIPLike" ADD CONSTRAINT "VIPLike_contentId_fkey" FOREIGN KEY ("contentId") REFERENCES "VIPContent"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VIPComment" ADD CONSTRAINT "VIPComment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VIPComment" ADD CONSTRAINT "VIPComment_contentId_fkey" FOREIGN KEY ("contentId") REFERENCES "VIPContent"("id") ON DELETE CASCADE ON UPDATE CASCADE;
