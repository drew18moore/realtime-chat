ALTER TABLE "Message" DROP CONSTRAINT fk_reply_to_message;
ALTER TABLE "Message" DROP COLUMN "replyToId";
