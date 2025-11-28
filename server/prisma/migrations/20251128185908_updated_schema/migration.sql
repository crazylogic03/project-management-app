-- AlterTable
ALTER TABLE `User` ADD COLUMN `city` VARCHAR(191) NULL,
    ADD COLUMN `country` VARCHAR(191) NULL,
    ADD COLUMN `notifications` JSON NULL,
    ADD COLUMN `phone` VARCHAR(191) NULL,
    ADD COLUMN `preferences` JSON NULL,
    ADD COLUMN `zipCode` VARCHAR(191) NULL;
