-- AlterTable
ALTER TABLE "Booking" ADD COLUMN     "parkingId" INTEGER;

-- CreateTable
CREATE TABLE "Parking" (
    "id" SERIAL NOT NULL,
    "parkingCode" TEXT NOT NULL,
    "parkingName" TEXT NOT NULL,
    "availableSlots" INTEGER NOT NULL,
    "location" TEXT NOT NULL,
    "feePerHour" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Parking_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Parking_parkingCode_key" ON "Parking"("parkingCode");

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_parkingId_fkey" FOREIGN KEY ("parkingId") REFERENCES "Parking"("id") ON DELETE SET NULL ON UPDATE CASCADE;
