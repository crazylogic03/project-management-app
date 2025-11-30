/*
  Warnings:

  - Added the required column `message` to the `Activity` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `Activity` DROP FOREIGN KEY `Activity_boardId_fkey`;

-- DropForeignKey
ALTER TABLE `Activity` DROP FOREIGN KEY `Activity_userId_fkey`;

-- DropIndex
DROP INDEX `Activity_boardId_fkey` ON `Activity`;

-- DropIndex
DROP INDEX `Activity_userId_fkey` ON `Activity`;

-- AlterTable
ALTER TABLE `Activity` ADD COLUMN `message` VARCHAR(191) NOT NULL,
    MODIFY `userId` INTEGER NULL,
    MODIFY `boardId` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `Activity` ADD CONSTRAINT `Activity_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Activity` ADD CONSTRAINT `Activity_boardId_fkey` FOREIGN KEY (`boardId`) REFERENCES `Board`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
