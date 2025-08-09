ALTER TABLE "Message" ADD COLUMN "replyToId" INT;
ALTER TABLE "Message" ADD CONSTRAINT fk_reply_to_message FOREIGN KEY ("replyToId") REFERENCES "Message"(id) ON DELETE SET NULL;
