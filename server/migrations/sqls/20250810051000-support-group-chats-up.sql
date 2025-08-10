-- Add group chat support fields
ALTER TABLE "Conversation"
  ADD COLUMN IF NOT EXISTS "isGroup" BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS "ownerId" INT,
  ADD COLUMN IF NOT EXISTS group_picture TEXT NOT NULL DEFAULT '';

-- Add owner FK if missing
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM information_schema.table_constraints tc
    WHERE tc.constraint_name = 'fk_conversation_owner'
      AND tc.table_name = 'Conversation'
  ) THEN
    ALTER TABLE "Conversation"
      ADD CONSTRAINT fk_conversation_owner FOREIGN KEY ("ownerId") REFERENCES "User"(id) ON DELETE SET NULL ON UPDATE CASCADE;
  END IF;
END $$;

-- Add role column to ConversationUser with enum-like check
ALTER TABLE "ConversationUser"
  ADD COLUMN IF NOT EXISTS role TEXT NOT NULL DEFAULT 'member';

-- Add check constraint for role allowed values if missing
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM information_schema.table_constraints tc
    WHERE tc.constraint_name = 'conversationuser_role_check'
      AND tc.table_name = 'ConversationUser'
  ) THEN
    ALTER TABLE "ConversationUser"
      ADD CONSTRAINT conversationuser_role_check CHECK (role IN ('owner','admin','member'));
  END IF;
END $$;


