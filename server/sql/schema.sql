-- Create User table
CREATE TABLE IF NOT EXISTS "User" (
    id SERIAL PRIMARY KEY,
    display_name TEXT NOT NULL,
    username TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    created_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    refresh_token TEXT NOT NULL DEFAULT '',
    profile_picture TEXT NOT NULL DEFAULT ''
);

-- Create Conversation table
CREATE TABLE IF NOT EXISTS "Conversation" (
    id SERIAL PRIMARY KEY,
    title TEXT,
    created_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dateLastMessage" TIMESTAMP(3)
);

-- Create Message table
CREATE TABLE IF NOT EXISTS "Message" (
    id SERIAL PRIMARY KEY,
    message TEXT NOT NULL,
    img TEXT NOT NULL DEFAULT '',
    "authorId" INT NOT NULL,
    created_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "conversationId" INT,
    "isEdited" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT fk_author FOREIGN KEY ("authorId") REFERENCES "User"(id) ON DELETE CASCADE,
    CONSTRAINT fk_conversation FOREIGN KEY ("conversationId") REFERENCES "Conversation"(id) ON DELETE CASCADE
);

-- Create ConversationUser table
CREATE TABLE IF NOT EXISTS "ConversationUser" (
    id SERIAL PRIMARY KEY,
    "userId" INT NOT NULL,
    "conversationId" INT NOT NULL,
    "isRead" BOOLEAN NOT NULL DEFAULT true,
    CONSTRAINT fk_user FOREIGN KEY ("userId") REFERENCES "User"(id) ON DELETE CASCADE,
    CONSTRAINT fk_conversation FOREIGN KEY ("conversationId") REFERENCES "Conversation"(id) ON DELETE CASCADE
);

-- Create Reaction table
CREATE TABLE IF NOT EXISTS "Reaction" (
    id SERIAL PRIMARY KEY,
    "userId" INT NOT NULL,
    "messageId" INT NOT NULL,
    emoji TEXT NOT NULL,
    CONSTRAINT fk_message FOREIGN KEY ("messageId") REFERENCES "Message"(id) ON DELETE CASCADE,
    CONSTRAINT unique_message_emoji UNIQUE ("messageId", emoji, "userId")
);

-- Create indices and constraints for relationships
ALTER TABLE "Message" ADD CONSTRAINT fk_author FOREIGN KEY ("authorId") REFERENCES "User"(id) ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "Message" ADD CONSTRAINT fk_conversation FOREIGN KEY ("conversationId") REFERENCES "Conversation"(id) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "ConversationUser" ADD CONSTRAINT fk_user FOREIGN KEY ("userId") REFERENCES "User"(id) ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "ConversationUser" ADD CONSTRAINT fk_conversation FOREIGN KEY ("conversationId") REFERENCES "Conversation"(id) ON DELETE CASCADE ON UPDATE CASCADE;
