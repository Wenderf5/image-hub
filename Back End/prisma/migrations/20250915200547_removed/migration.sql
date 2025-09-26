/*
  Warnings:

  - You are about to drop the column `name` on the `images` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "public"."images_name_key";

-- AlterTable
ALTER TABLE "public"."images" DROP COLUMN "name";
