-- Create User table
CREATE TABLE IF NOT EXISTS "User" (
    id SERIAL PRIMARY KEY,
    display_name VARCHAR NOT NULL,
    username VARCHAR NOT NULL UNIQUE,
    password VARCHAR NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    refresh_token VARCHAR DEFAULT '',
    profile_picture VARCHAR DEFAULT ''
);

-- Create Conversation table
CREATE TABLE IF NOT EXISTS "Conversation" (
    id SERIAL PRIMARY KEY,
    title VARCHAR,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "dateLastMessage" TIMESTAMP
);

-- Create Message table
CREATE TABLE IF NOT EXISTS "Message" (
    id SERIAL PRIMARY KEY,
    message TEXT NOT NULL,
    "authorId" INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "conversationId" INT,
    "isEdited" BOOLEAN DEFAULT FALSE,
    CONSTRAINT fk_author FOREIGN KEY ("authorId") REFERENCES "User"(id),
    CONSTRAINT fk_conversation FOREIGN KEY ("conversationId") REFERENCES "Conversation"(id) ON DELETE CASCADE
);

-- Create ConversationUser table
CREATE TABLE IF NOT EXISTS "ConversationUser" (
    id SERIAL PRIMARY KEY,
    "userId" INT NOT NULL,
    "conversationId" INT NOT NULL,
    "isRead" BOOLEAN DEFAULT TRUE,
    CONSTRAINT fk_user FOREIGN KEY ("userId") REFERENCES "User"(id),
    CONSTRAINT fk_conversation FOREIGN KEY ("conversationId") REFERENCES "Conversation"(id) ON DELETE CASCADE
);

-- Create indices and constraints for relationships
ALTER TABLE "Message" ADD CONSTRAINT fk_author FOREIGN KEY ("authorId") REFERENCES "User"(id);
ALTER TABLE "Message" ADD CONSTRAINT fk_conversation FOREIGN KEY ("conversationId") REFERENCES "Conversation"(id) ON DELETE CASCADE;
ALTER TABLE "ConversationUser" ADD CONSTRAINT fk_user FOREIGN KEY ("userId") REFERENCES "User"(id);
ALTER TABLE "ConversationUser" ADD CONSTRAINT fk_conversation FOREIGN KEY ("conversationId") REFERENCES "Conversation"(id) ON DELETE CASCADE;
