/// <reference types="vite/client" />
type User = {
  id: int
  display_name: string
  username: string
}

type Message = {
  id?: int
  message: string
  receiverId: int
  authorId: int
  created_at: Date
}