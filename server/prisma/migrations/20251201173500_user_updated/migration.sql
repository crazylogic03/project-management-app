-- DropForeignKey
ALTER TABLE `Activity` DROP FOREIGN KEY `Activity_boardId_fkey`;

-- DropForeignKey
ALTER TABLE `Activity` DROP FOREIGN KEY `Activity_cardId_fkey`;

-- DropForeignKey
ALTER TABLE `Attachment` DROP FOREIGN KEY `Attachment_boardId_fkey`;

-- DropForeignKey
ALTER TABLE `Attachment` DROP FOREIGN KEY `Attachment_cardId_fkey`;

-- DropForeignKey
ALTER TABLE `BoardMember` DROP FOREIGN KEY `BoardMember_boardId_fkey`;

-- DropForeignKey
ALTER TABLE `Card` DROP FOREIGN KEY `Card_boardId_fkey`;

-- DropForeignKey
ALTER TABLE `Card` DROP FOREIGN KEY `Card_listId_fkey`;

-- DropForeignKey
ALTER TABLE `CardLabel` DROP FOREIGN KEY `CardLabel_cardId_fkey`;

-- DropForeignKey
ALTER TABLE `CardLabel` DROP FOREIGN KEY `CardLabel_labelId_fkey`;

-- DropForeignKey
ALTER TABLE `Comment` DROP FOREIGN KEY `Comment_boardId_fkey`;

-- DropForeignKey
ALTER TABLE `Comment` DROP FOREIGN KEY `Comment_cardId_fkey`;

-- DropForeignKey
ALTER TABLE `Label` DROP FOREIGN KEY `Label_boardId_fkey`;

-- DropForeignKey
ALTER TABLE `List` DROP FOREIGN KEY `List_boardId_fkey`;

-- DropIndex
DROP INDEX `Activity_boardId_fkey` ON `Activity`;

-- DropIndex
DROP INDEX `Activity_cardId_fkey` ON `Activity`;

-- DropIndex
DROP INDEX `Attachment_boardId_fkey` ON `Attachment`;

-- DropIndex
DROP INDEX `Attachment_cardId_fkey` ON `Attachment`;

-- DropIndex
DROP INDEX `BoardMember_boardId_fkey` ON `BoardMember`;

-- DropIndex
DROP INDEX `Card_boardId_fkey` ON `Card`;

-- DropIndex
DROP INDEX `Card_listId_fkey` ON `Card`;

-- DropIndex
DROP INDEX `CardLabel_cardId_fkey` ON `CardLabel`;

-- DropIndex
DROP INDEX `CardLabel_labelId_fkey` ON `CardLabel`;

-- DropIndex
DROP INDEX `Comment_boardId_fkey` ON `Comment`;

-- DropIndex
DROP INDEX `Comment_cardId_fkey` ON `Comment`;

-- DropIndex
DROP INDEX `Label_boardId_fkey` ON `Label`;

-- DropIndex
DROP INDEX `List_boardId_fkey` ON `List`;

-- AlterTable
ALTER TABLE `User` MODIFY `profilePic` LONGTEXT NULL;

-- AddForeignKey
ALTER TABLE `BoardMember` ADD CONSTRAINT `BoardMember_boardId_fkey` FOREIGN KEY (`boardId`) REFERENCES `Board`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `List` ADD CONSTRAINT `List_boardId_fkey` FOREIGN KEY (`boardId`) REFERENCES `Board`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Card` ADD CONSTRAINT `Card_listId_fkey` FOREIGN KEY (`listId`) REFERENCES `List`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Card` ADD CONSTRAINT `Card_boardId_fkey` FOREIGN KEY (`boardId`) REFERENCES `Board`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Comment` ADD CONSTRAINT `Comment_boardId_fkey` FOREIGN KEY (`boardId`) REFERENCES `Board`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Comment` ADD CONSTRAINT `Comment_cardId_fkey` FOREIGN KEY (`cardId`) REFERENCES `Card`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Activity` ADD CONSTRAINT `Activity_boardId_fkey` FOREIGN KEY (`boardId`) REFERENCES `Board`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Activity` ADD CONSTRAINT `Activity_cardId_fkey` FOREIGN KEY (`cardId`) REFERENCES `Card`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Label` ADD CONSTRAINT `Label_boardId_fkey` FOREIGN KEY (`boardId`) REFERENCES `Board`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CardLabel` ADD CONSTRAINT `CardLabel_cardId_fkey` FOREIGN KEY (`cardId`) REFERENCES `Card`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CardLabel` ADD CONSTRAINT `CardLabel_labelId_fkey` FOREIGN KEY (`labelId`) REFERENCES `Label`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Attachment` ADD CONSTRAINT `Attachment_boardId_fkey` FOREIGN KEY (`boardId`) REFERENCES `Board`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Attachment` ADD CONSTRAINT `Attachment_cardId_fkey` FOREIGN KEY (`cardId`) REFERENCES `Card`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
