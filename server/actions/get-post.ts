"use server"

import { db } from "@/server/index"

export default async function getPost() {
    const posts = await db.query.posts.findMany();

    if(!posts) {
        return {error: "No posts found"}
    }

    return {success: posts}
}