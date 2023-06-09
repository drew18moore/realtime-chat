/*
  Warnings:

  - You are about to drop the column `creatorId` on the `Conversation` table. All the data in the column will be lost.
  - You are about to drop the column `joinerId` on the `Conversation` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Conversation" DROP CONSTRAINT "Conversation_creatorId_fkey";

-- DropForeignKey
ALTER TABLE "Conversation" DROP CONSTRAINT "Conversation_joinerId_fkey";

-- AlterTable
ALTER TABLE "Conversation" DROP COLUMN "creatorId",
DROP COLUMN "joinerId";
