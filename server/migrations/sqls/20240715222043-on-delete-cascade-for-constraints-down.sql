/* Replace with your SQL commands */
ALTER TABLE "ConversationUser"
DROP CONSTRAINT fk_user;

ALTER TABLE "ConversationUser"
ADD CONSTRAINT fk_user
FOREIGN KEY ("userId")
REFERENCES "User"(id);

ALTER TABLE "Message"
DROP CONSTRAINT fk_author;

ALTER TABLE "Message"
ADD CONSTRAINT fk_author
FOREIGN KEY ("authorId") 
REFERENCES "User"(id);
