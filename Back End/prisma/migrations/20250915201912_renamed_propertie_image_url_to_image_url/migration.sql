/*
  Warnings:

  - You are about to drop the column `imageUrl` on the `images` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[image_url]` on the table `images` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `image_url` to the `images` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "public"."images_imageUrl_key";

-- AlterTable
ALTER TABLE "public"."images" DROP COLUMN "imageUrl",
ADD COLUMN     "image_url" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "images_image_url_key" ON "public"."images"("image_url");
