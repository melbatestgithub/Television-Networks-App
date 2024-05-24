/*
  Warnings:

  - You are about to drop the column `backgroundImage` on the `Movies` table. All the data in the column will be lost.
  - You are about to drop the column `releaseDate` on the `Movies` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Movies" DROP COLUMN "backgroundImage",
DROP COLUMN "releaseDate";
