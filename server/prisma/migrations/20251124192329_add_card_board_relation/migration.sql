/*
  Warnings:

  - You are about to drop the column `updatedAt` on the `Board` table. All the data in the column will be lost.
  - Added the required column `boardId` to the `Card` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Board` DROP COLUMN `updatedAt`,
    ADD COLUMN `deadline` DATETIME(3) NULL,
    ADD COLUMN `members` INTEGER NOT NULL DEFAULT 1,
    ADD COLUMN `progress` INTEGER NOT NULL DEFAULT 0,
    ADD COLUMN `status` VARCHAR(191) NOT NULL DEFAULT 'Not Started',
    ADD COLUMN `template` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `Card` ADD COLUMN `boardId` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `Card` ADD CONSTRAINT `Card_boardId_fkey` FOREIGN KEY (`boardId`) REFERENCES `Board`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
