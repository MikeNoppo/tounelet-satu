/*
  Warnings:

  - Changed the type of `jabatan` on the `StructureMember` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "StructureMember" DROP COLUMN "jabatan",
ADD COLUMN     "jabatan" TEXT NOT NULL;

-- DropEnum
DROP TYPE "public"."Jabatan";
