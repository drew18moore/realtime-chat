/// <reference types="vite/client" />
type User = {
  id: number
  display_name: string
  username: string
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
  users: [{
    id: number
    username: string
  }]
  lastMessageSent: {
    message: string,
    created_at: Date
  }
}

type SearchResults = {
  users: User[],
  numFound: number
}