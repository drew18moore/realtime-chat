-- Drop constraints/columns added for group chats
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.table_constraints tc
    WHERE tc.constraint_name = 'fk_conversation_owner'
      AND tc.table_name = 'Conversation'
  ) THEN
    ALTER TABLE "Conversation" DROP CONSTRAINT fk_conversation_owner;
  END IF;
END $$;

ALTER TABLE "Conversation" 
  DROP COLUMN IF EXISTS group_picture,
  DROP COLUMN IF EXISTS "ownerId",
  DROP COLUMN IF EXISTS "isGroup";

DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.table_constraints tc
    WHERE tc.constraint_name = 'conversationuser_role_check'
      AND tc.table_name = 'ConversationUser'
  ) THEN
    ALTER TABLE "ConversationUser" DROP CONSTRAINT conversationuser_role_check;
  END IF;
END $$;

ALTER TABLE "ConversationUser" DROP COLUMN IF EXISTS role;


