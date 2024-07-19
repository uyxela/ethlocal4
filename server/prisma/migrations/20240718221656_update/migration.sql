/*
  Warnings:

  - You are about to drop the column `ethglobal_slug` on the `ScheduleItem` table. All the data in the column will be lost.
  - You are about to drop the column `ethglobal_uuid` on the `ScheduleItem` table. All the data in the column will be lost.
  - You are about to drop the column `slug` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `uuid` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[ethglobal_event_id]` on the table `Schedule` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[user_id,ethglobal_event_id]` on the table `Schedule` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[ethglobal_id]` on the table `ScheduleItem` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[ethglobal_id]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `ethglobal_event_id` to the `Schedule` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ethglobal_id` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "User_uuid_key";

-- AlterTable
ALTER TABLE "Schedule" ADD COLUMN     "ethglobal_event_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "ScheduleItem" DROP COLUMN "ethglobal_slug",
DROP COLUMN "ethglobal_uuid";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "slug",
DROP COLUMN "uuid",
ADD COLUMN     "ethglobal_id" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Schedule_ethglobal_event_id_key" ON "Schedule"("ethglobal_event_id");

-- CreateIndex
CREATE UNIQUE INDEX "Schedule_user_id_ethglobal_event_id_key" ON "Schedule"("user_id", "ethglobal_event_id");

-- CreateIndex
CREATE UNIQUE INDEX "ScheduleItem_ethglobal_id_key" ON "ScheduleItem"("ethglobal_id");

-- CreateIndex
CREATE UNIQUE INDEX "User_ethglobal_id_key" ON "User"("ethglobal_id");
