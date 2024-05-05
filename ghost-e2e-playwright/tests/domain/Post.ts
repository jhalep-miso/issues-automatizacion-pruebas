export type Post = {
  title: string
  content: string
  tags: string[]
}

export type PostAccess = "public" | "members" | "paid" | "tiers"
