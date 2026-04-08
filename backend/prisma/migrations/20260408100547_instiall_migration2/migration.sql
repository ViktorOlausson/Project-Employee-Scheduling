/*
  Warnings:

  - The primary key for the `availabilities` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `availabilities` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `schedule_entries` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `schedule_entries` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `users` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `users` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Changed the type of `userId` on the `availabilities` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `userId` on the `schedule_entries` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "Occupation" AS ENUM ('RUNNER', 'WAITER', 'DISHWASHER', 'CHEF');

-- DropForeignKey
ALTER TABLE "availabilities" DROP CONSTRAINT "availabilities_userId_fkey";

-- DropForeignKey
ALTER TABLE "schedule_entries" DROP CONSTRAINT "schedule_entries_userId_fkey";

-- AlterTable
ALTER TABLE "availabilities" DROP CONSTRAINT "availabilities_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
DROP COLUMN "userId",
ADD COLUMN     "userId" INTEGER NOT NULL,
ADD CONSTRAINT "availabilities_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "schedule_entries" DROP CONSTRAINT "schedule_entries_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
DROP COLUMN "userId",
ADD COLUMN     "userId" INTEGER NOT NULL,
ADD CONSTRAINT "schedule_entries_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "users" DROP CONSTRAINT "users_pkey",
ADD COLUMN     "Occupation" "Occupation" NOT NULL DEFAULT 'RUNNER',
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "users_pkey" PRIMARY KEY ("id");

-- CreateIndex
CREATE UNIQUE INDEX "availabilities_userId_date_shift_key" ON "availabilities"("userId", "date", "shift");

-- CreateIndex
CREATE UNIQUE INDEX "schedule_entries_userId_date_shift_key" ON "schedule_entries"("userId", "date", "shift");

-- AddForeignKey
ALTER TABLE "availabilities" ADD CONSTRAINT "availabilities_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "schedule_entries" ADD CONSTRAINT "schedule_entries_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
