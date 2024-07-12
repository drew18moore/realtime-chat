/// <reference types="vite/client" />
type User = {
  id: number;
  display_name: string;
  username: string;
  accessToken: string;
  profile_picture?: string;
};

type Message = {
  id: number;
  message: string;
  img: string;
  authorId: number;
  created_at: Date;
  isEdited: boolean;
  reactions: {
    id: number;
    messageId: number;
    emoji: string;
    count: number;
  }[]
};

type Reaction = {
  id: number;
  messageId: number;
  emoji: string;
  count: number;
}

type Conversation = {
  id: number;
  title?: string | null;
  participants: {
    id: number;
    display_name: string;
    username: string;
    profile_picture?: string;
  }[];
  lastMessageSent?:
    | {
        id: number;
        message: string;
        img: string;
        created_at: Date;
      }
    | undefined;
  isRead: boolean;
};

type SearchResults = {
  users: User[];
  numFound: number;
};

interface ConversationState {
  recipient: {
    id: number;
    title: string;
    conversationWithSelf: boolean;
  };
}
