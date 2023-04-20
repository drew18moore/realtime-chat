/// <reference types="vite/client" />
type User = {
  id: number
  displayName: string
  username: string
  accessToken: string
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
    username: string
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