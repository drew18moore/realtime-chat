/*
  Warnings:

  - Added the required column `dateLastMessage` to the `Conversation` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Conversation" ADD COLUMN     "dateLastMessage" TIMESTAMP(3) NOT NULL;
