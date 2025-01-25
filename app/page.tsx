import getPost from "@/server/actions/get-post";

export default async function Home() {
  const {error, data: response} = await getPost();
  if(error){  
    console.log(error);
    
  }
  if(response){
    console.log(response);
  }
  
  return (
    <div className="p-8">
      <h1>Welcome to My App</h1>
    </div>
  );
}
