/*
  Warnings:

  - You are about to drop the column `username` on the `Room` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[slug]` on the table `Room` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `creatorId` to the `Room` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."Room" DROP CONSTRAINT "Room_username_fkey";

-- AlterTable
ALTER TABLE "public"."Room" DROP COLUMN "username",
ADD COLUMN     "creatorId" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Room_slug_key" ON "public"."Room"("slug");

-- AddForeignKey
ALTER TABLE "public"."Room" ADD CONSTRAINT "Room_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
