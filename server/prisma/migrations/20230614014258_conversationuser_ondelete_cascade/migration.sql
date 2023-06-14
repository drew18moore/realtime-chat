-- DropForeignKey
ALTER TABLE "ConversationUser" DROP CONSTRAINT "ConversationUser_conversationId_fkey";

-- AddForeignKey
ALTER TABLE "ConversationUser" ADD CONSTRAINT "ConversationUser_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES "Conversation"("id") ON DELETE CASCADE ON UPDATE CASCADE;
