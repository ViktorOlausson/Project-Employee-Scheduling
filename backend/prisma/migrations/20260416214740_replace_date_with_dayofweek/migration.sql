DELETE FROM "availabilities";

/*
  Warnings:

  - You are about to drop the column `date` on the `availabilities` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userId,dayOfWeek,shift]` on the table `availabilities` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `dayOfWeek` to the `availabilities` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "DayOfWeek" AS ENUM ('Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun');

-- DropIndex
DROP INDEX "availabilities_userId_date_shift_key";

-- AlterTable
ALTER TABLE "availabilities" DROP COLUMN "date",
ADD COLUMN     "dayOfWeek" "DayOfWeek" NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "availabilities_userId_dayOfWeek_shift_key" ON "availabilities"("userId", "dayOfWeek", "shift");
