/*
  Warnings:

  - You are about to drop the column `firstnname` on the `users` table. All the data in the column will be lost.
  - Added the required column `firstname` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `users` DROP COLUMN `firstnname`,
    ADD COLUMN `firstname` VARCHAR(191) NOT NULL;
