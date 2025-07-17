
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useNavigate } from "react-router-dom";

const AddPost = () => {
  const navigate = useNavigate();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    // Show a simple "success" toast or navigate back for now
    alert("New post created! (Not yet connected to backend)");
    navigate("/dashboard");
  }

  return (
    <div className="flex items-center justify-center min-h-[80vh] bg-[#090A0E]">
      <Card className="w-full max-w-xl bg-[#151619] border-[#2A2C36]">
        <CardHeader>
          <CardTitle className="text-white text-2xl">Add a New Post</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label className="text-gray-400 text-sm">Title</label>
              <Input
                required
                placeholder="Post title"
                className="mt-1 bg-[#0A0B0F] border-[#2A2C36] text-white"
              />
            </div>
            <div>
              <label className="text-gray-400 text-sm">Content</label>
              <Textarea
                required
                placeholder="Write your post here..."
                className="mt-1 bg-[#0A0B0F] border-[#2A2C36] text-white min-h-[120px]"
              />
            </div>
            <div>
              <label className="text-gray-400 text-sm">Category</label>
              <Input
                required
                placeholder="e.g. Web Development"
                className="mt-1 bg-[#0A0B0F] border-[#2A2C36] text-white"
              />
            </div>
            <Button className="w-full bg-tech-red hover:bg-tech-red/90">Publish</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddPost;
