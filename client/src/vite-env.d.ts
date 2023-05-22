/// <reference types="vite/client" />
type User = {
  id: number
  display_name: string
  username: string
  accessToken: string
  profile_picture?: string
}

type Message = {
  id?: number
  message: string
  receiverId: number
  authorId: number
  created_at: Date
}

type Conversation = {
  id: number
  title?: string | null
  recipient: {
    id: number
    display_name: string
  }
  lastMessageSent?: {
    message: string,
    created_at: Date
  } | undefined
}

type SearchResults = {
  users: User[],
  numFound: number
}