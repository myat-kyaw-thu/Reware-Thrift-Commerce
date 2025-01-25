"use server"

import { queries } from "@/server"
import { revalidatePath } from "next/cache";

export default async function createPost(
    formData: FormData
) {
    try {
        const title = formData.get('title') as string;
        const content = formData.get('content') as string;

        if (!title || !content) {
            return { error: "Title and content are required" }
        }

        const newPost = await queries.posts.create(title, content)

        if (!newPost) {
            return { error: "Failed to create post" }
        }
        revalidatePath('/')
        return { success: newPost }
    } catch (error) {
        console.error('Error creating post:', error);
        return { error: "Failed to create post" }
    }
}