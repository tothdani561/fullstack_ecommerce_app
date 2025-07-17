/*
  Warnings:

  - You are about to drop the column `usedBy` on the `Coupon` table. All the data in the column will be lost.
  - You are about to drop the column `usedInOrder` on the `Coupon` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `Coupon` DROP COLUMN `usedBy`,
    DROP COLUMN `usedInOrder`;
