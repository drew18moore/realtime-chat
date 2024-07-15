/* Replace with your SQL commands */
CREATE TABLE IF NOT EXISTS "Reaction" (
    id SERIAL PRIMARY KEY,
    "userId" INT NOT NULL,
    "messageId" INT NOT NULL,
    emoji TEXT NOT NULL,
    CONSTRAINT fk_message FOREIGN KEY ("messageId") REFERENCES "Message"(id) ON DELETE CASCADE,
    CONSTRAINT unique_message_emoji UNIQUE ("messageId", emoji, "userId")
);
