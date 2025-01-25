import { pgTable, serial, text } from "drizzle-orm/pg-core";

export const poast = pgTable("poast", {
    id: serial("id").primaryKey().notNull(),
    title: text("title").notNull(),
    content: text("content").notNull(),
});