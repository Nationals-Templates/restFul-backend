/*
  Warnings:

  - You are about to drop the column `bookingDate` on the `Booking` table. All the data in the column will be lost.
  - You are about to drop the column `exitDate` on the `Booking` table. All the data in the column will be lost.
  - Added the required column `entryTime` to the `Booking` table without a default value. This is not possible if the table is not empty.
  - Added the required column `exitTime` to the `Booking` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Booking" DROP COLUMN "bookingDate",
DROP COLUMN "exitDate",
ADD COLUMN     "entryTime" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "exitTime" TIMESTAMP(3) NOT NULL;
