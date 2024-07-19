/*
  Warnings:

  - Added the required column `body` to the `Notification` table without a default value. This is not possible if the table is not empty.
  - Added the required column `title` to the `Notification` table without a default value. This is not possible if the table is not empty.
  - Added the required column `info` to the `ScheduleItem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `ScheduleItem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `start_time` to the `ScheduleItem` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Notification" ADD COLUMN     "body" TEXT NOT NULL,
ADD COLUMN     "schedule_item_id" INTEGER,
ADD COLUMN     "title" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "ScheduleItem" ADD COLUMN     "info" TEXT NOT NULL,
ADD COLUMN     "name" TEXT NOT NULL,
ADD COLUMN     "start_time" TIMESTAMP(3) NOT NULL;
