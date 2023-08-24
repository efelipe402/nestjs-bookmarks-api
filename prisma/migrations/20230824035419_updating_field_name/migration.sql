/*
  Warnings:

  - You are about to drop the column `decription` on the `bookmarks` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "bookmarks" DROP COLUMN "decription",
ADD COLUMN     "description" TEXT;
