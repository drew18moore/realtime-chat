-- Drop constraints and indices for relationships
ALTER TABLE "Message" DROP CONSTRAINT IF EXISTS fk_author;
ALTER TABLE "Message" DROP CONSTRAINT IF EXISTS fk_conversation;
ALTER TABLE "ConversationUser" DROP CONSTRAINT IF EXISTS fk_user;
ALTER TABLE "ConversationUser" DROP CONSTRAINT IF EXISTS fk_conversation;

-- Drop ConversationUser table
DROP TABLE IF EXISTS "ConversationUser";

-- Drop Message table
DROP TABLE IF EXISTS "Message";

-- Drop Conversation table
DROP TABLE IF EXISTS "Conversation";

-- Drop User table
DROP TABLE IF EXISTS "User";
