/*
  Warnings:

  - You are about to drop the column `backgroundImg` on the `Movies` table. All the data in the column will be lost.
  - Added the required column `backgroundImage` to the `Movies` table without a default value. This is not possible if the table is not empty.
  - Added the required column `description` to the `Movies` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Movies" DROP COLUMN "backgroundImg",
ADD COLUMN     "backgroundImage" TEXT NOT NULL,
ADD COLUMN     "description" TEXT NOT NULL;
