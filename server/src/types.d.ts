  // USER TYPES
  export type dbUser = {
    id: number;
    display_name: string;
    username: string;
    password: string;
    created_at: Date;
    updated_at: Date;
    refresh_token: string;
    profile_picture: string;
  }

  export type UserCreationResponse = {
    id: number;
    display_name: string;
    username: string;
  }

  export type UserDetails = {
    id: number;
    display_name: string;
    username: string;
    profile_picture: string;
  }

  // CONVERSATION TYPES
  export type ParticipantDetails = {
    id: number;
    display_name: string;
    username?: string;
    profile_picture: string;
  }

  export type ConversationDetails = {
    id: number;
    title: string | null;
    participants: ParticipantDetails[];
    lastMessageSent: {
      id: number;
      message: string;
      created_at: Date;
    } | undefined
  }

  export type ConversationMessageDetails = {
    id: number;
    message: string;
    created_at: Date;
  }

  export type GetConversationResponse = {
    id: number;
    title: string | null;
    participants: ParticipantDetails[];
    lastMessageSent: {
      id: number;
      message: string;
      created_at: Date;
    } | undefined
    isRead: boolean;
  }

  export type ConversationWithParticipants = {
    id: number;
    title: string | null;
    participants: Participant[];
  }

  export type Participant = {
    id: number;
    display_name: string;
    profile_picture: string;
  }

  // MESSAGE TYPES
  export type NewMessageResponse = {
    id: number;
    message: string;
    authorId: number;
    created_at: Date;
  }

  export type MessageDetails = {
    id: number;
    message: string;
    authorId: number;
    created_at: Date;
    isEdited: boolean;
    conversationId: number;
  }
