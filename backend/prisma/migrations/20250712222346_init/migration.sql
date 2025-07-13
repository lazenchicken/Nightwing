-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "blizzardId" TEXT NOT NULL,
    "battletag" TEXT NOT NULL,
    "accessToken" TEXT NOT NULL,
    "refreshToken" TEXT NOT NULL,
    "realm" TEXT,
    "character" TEXT,
    "classKey" TEXT,
    "specKey" TEXT,
    "theme" TEXT NOT NULL DEFAULT 'dark',
    "dateRange" TEXT NOT NULL DEFAULT '7d',
    "bossFilter" TEXT NOT NULL DEFAULT '',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_blizzardId_key" ON "User"("blizzardId");
