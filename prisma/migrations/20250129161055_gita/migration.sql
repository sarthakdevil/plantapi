/*
  Warnings:

  - You are about to drop the column `type` on the `Plant` table. All the data in the column will be lost.
  - Added the required column `nickname` to the `Plant` table without a default value. This is not possible if the table is not empty.
  - Added the required column `species` to the `Plant` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Plant" DROP COLUMN "type",
ADD COLUMN     "nickname" TEXT NOT NULL,
ADD COLUMN     "species" TEXT NOT NULL;
