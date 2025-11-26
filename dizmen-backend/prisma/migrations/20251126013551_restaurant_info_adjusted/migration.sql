/*
  Warnings:

  - You are about to drop the column `category` on the `Restaurant` table. All the data in the column will be lost.
  - You are about to drop the column `social_media_link` on the `Restaurant` table. All the data in the column will be lost.
  - You are about to drop the `RefreshToken` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "RefreshToken" DROP CONSTRAINT "RefreshToken_userId_fkey";

-- AlterTable
ALTER TABLE "Restaurant" DROP COLUMN "category",
DROP COLUMN "social_media_link",
ALTER COLUMN "logo" DROP NOT NULL,
ALTER COLUMN "logo" DROP DEFAULT,
ALTER COLUMN "logo" SET DATA TYPE TEXT,
ALTER COLUMN "website" DROP NOT NULL,
ALTER COLUMN "website" DROP DEFAULT,
ALTER COLUMN "website" SET DATA TYPE TEXT,
ALTER COLUMN "map_link" DROP NOT NULL,
ALTER COLUMN "map_link" DROP DEFAULT,
ALTER COLUMN "map_link" SET DATA TYPE TEXT;

-- DropTable
DROP TABLE "RefreshToken";

-- CreateTable
CREATE TABLE "SocialMediaLink" (
    "id" SERIAL NOT NULL,
    "url" TEXT NOT NULL,
    "platform" TEXT NOT NULL,
    "restaurantId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SocialMediaLink_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "SocialMediaLink" ADD CONSTRAINT "SocialMediaLink_restaurantId_fkey" FOREIGN KEY ("restaurantId") REFERENCES "Restaurant"("id") ON DELETE CASCADE ON UPDATE CASCADE;
