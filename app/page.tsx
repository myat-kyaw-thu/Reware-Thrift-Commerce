import createPost from "@/server/actions/create-post";
import getPosts from "@/server/actions/get-post";

type Post = {
  id: number;
  title: string;
  content: string;
}

export default async function Home() {
  const response = await getPosts();

  if (response?.error) {
    console.log(response.error);
  }
  
  return (
    <div className="p-8">
      <div>
        <h1 className="text-3xl font-bold mb-4">Posts</h1>
        <ul>
          {response?.success?.map((post: Post) => (
            <li key={post.id} className="mb-4">
              <h2 className="text-xl font-semibold">{post.title}</h2>
              <p>{post.content}</p>
            </li>
          ))}
        </ul>
      </div>
      <div>
        <h1 className="text-3xl font-bold mb-4">Create Post</h1>
        <form action={createPost}>
          <input type="text" name="title" placeholder="Title" />
          <input type="text" name="content" placeholder="Content" />
          <button type="submit">Create Post</button>
        </form>
      </div>
    </div>
  );
}
