-- Drop foreign key constraint for conversationUserId
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.table_constraints tc
    WHERE tc.constraint_name = 'fk_conversation_user'
      AND tc.table_name = 'Message'
  ) THEN
    ALTER TABLE "Message" DROP CONSTRAINT fk_conversation_user;
  END IF;
END $$;

-- Drop conversationUserId column
ALTER TABLE "Message" DROP COLUMN IF EXISTS "conversationUserId";