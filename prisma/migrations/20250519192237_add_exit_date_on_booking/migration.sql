/*
  Warnings:

  - Added the required column `exitDate` to the `Booking` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Booking" ADD COLUMN     "exitDate" TIMESTAMP(3) NOT NULL;
