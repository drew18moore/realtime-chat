-- Add conversationUserId column to Message table
ALTER TABLE "Message"
  ADD COLUMN IF NOT EXISTS "conversationUserId" INT;

-- Add foreign key constraint to ConversationUser with cascade delete
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM information_schema.table_constraints tc
    WHERE tc.constraint_name = 'fk_conversation_user'
      AND tc.table_name = 'Message'
  ) THEN
    ALTER TABLE "Message"
      ADD CONSTRAINT fk_conversation_user FOREIGN KEY ("conversationUserId") REFERENCES "ConversationUser"(id) ON DELETE CASCADE;
  END IF;
END $$;

-- Populate existing messages with the correct conversationUserId
UPDATE "Message"
SET "conversationUserId" = (
  SELECT cu.id
  FROM "ConversationUser" cu
  WHERE cu."userId" = "Message"."authorId"
    AND cu."conversationId" = "Message"."conversationId"
)
WHERE "conversationUserId" IS NULL;