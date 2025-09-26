-- CreateTable
CREATE TABLE "public"."images" (
    "id" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,

    CONSTRAINT "images_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "images_imageUrl_key" ON "public"."images"("imageUrl");
