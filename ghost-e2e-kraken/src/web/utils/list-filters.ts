export type ListFilters = {
    type?: "draft" | "published" | "sent" | "scheduled" | "featured";
    visibility?: "public" | "members" | "[paid,tiers]";
    author?: string;
    tag?: string;
};