-- AlterTable
ALTER TABLE `Message` ADD COLUMN `attachmentUrl` LONGTEXT NULL,
    ADD COLUMN `fileName` VARCHAR(191) NULL,
    ADD COLUMN `fileType` VARCHAR(191) NULL;
