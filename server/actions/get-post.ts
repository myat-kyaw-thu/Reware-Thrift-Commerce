"use server"

import { queries } from "@/server"

export default async function getPosts() {
    try {
        const allPosts = await queries.posts.findMany();
        
        if (!allPosts || allPosts.length === 0) {
            return { error: "No posts found" }
        }

        return { success: allPosts }
    } catch (error) {
        console.error('Error fetching posts:', error);
        return { error: "Failed to fetch posts" }
    }
}