/*
  Warnings:

  - You are about to drop the `_Friends` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_Participants` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `creatorId` to the `Conversation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `joinerId` to the `Conversation` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "_Friends" DROP CONSTRAINT "_Friends_A_fkey";

-- DropForeignKey
ALTER TABLE "_Friends" DROP CONSTRAINT "_Friends_B_fkey";

-- DropForeignKey
ALTER TABLE "_Participants" DROP CONSTRAINT "_Participants_A_fkey";

-- DropForeignKey
ALTER TABLE "_Participants" DROP CONSTRAINT "_Participants_B_fkey";

-- AlterTable
ALTER TABLE "Conversation" ADD COLUMN     "creatorId" INTEGER NOT NULL,
ADD COLUMN     "joinerId" INTEGER NOT NULL;

-- DropTable
DROP TABLE "_Friends";

-- DropTable
DROP TABLE "_Participants";

-- AddForeignKey
ALTER TABLE "Conversation" ADD CONSTRAINT "Conversation_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Conversation" ADD CONSTRAINT "Conversation_joinerId_fkey" FOREIGN KEY ("joinerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
