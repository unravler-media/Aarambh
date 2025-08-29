import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { User, X, ChevronDown, CheckIcon } from 'lucide-react';
import { processPostEdit } from '@/hooks/creatorDashboard';
import type { AddPostInterface } from '@/hooks/creatorDashboard';
import Layout from '@/components/layout';
import { Label, Listbox, ListboxButton, ListboxOption, ListboxOptions } from '@headlessui/react'
import { useCategories, type Category } from '@/hooks/useCategories.tsx';
import { Editor } from '@tinymce/tinymce-react';
import { usePost } from '@/hooks/usePost.tsx';
import CoverImageUploader from './coverImageUploader.tsx';

type EditPostCompProps = {
  onClose: () => void;
  postSlug: string;
};

const EditPostComp = ({ onClose, postSlug }: EditPostCompProps) => {
  const { user } = useAuth();
  const { post, loading, error } = usePost(postSlug);
  const { categories } = useCategories();
  const [selected, setSelected] = useState<Category>();

  const [editPostData, setEditPostData] = useState<AddPostInterface>({
    post_title: '',
    short_content: '',
    content: '',
    cover_image: '',
    category_id: '',
    is_featured: false
  });

  useEffect(() => {
    if (post) {
      setEditPostData({
        post_title: post.title || "",
        short_content: post.short_content || "",
        content: post.content || "",
        cover_image: post.cover_image || "",
        category_id: post.category?.id || "",
        is_featured: post.isFeatured || false,
      });
    }
  }, [post]);


  const handleEditPostUpdate = async () => {
    try {
      // Filter out empty string fields
      const filteredData = Object.fromEntries(
        Object.entries(editPostData).filter(([_, value]) => value !== "")
      );

      console.log("Filtered Post Edited:", filteredData);
      await processPostEdit(filteredData as AddPostInterface, postSlug);

      onClose(); // 
      // reload to update posts from server
      window.location.reload();
    } catch (err) {
      console.error(err);
    }
  }; const handleEditPostInputChange = (field: string, value: string) => {
    setEditPostData(prev => ({
      ...prev,
      [field]: value
    }));
  };



  if (loading) {
    return <Layout>
      <div className="animate-pulse space-y-6">
        <div className="h-12 bg-[#151619] rounded-xl w-1/4 mb-6"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 md:gap-8">
          {[1, 2, 3, 4, 5, 6].map(i => <div key={i} className="h-80 bg-[#151619] rounded-xl"></div>)}
        </div>
        <div className="h-12 bg-[#151619] rounded-xl w-1/3 mt-10"></div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map(i => <div key={i} className="h-72 bg-[#151619] rounded-xl"></div>)}
        </div>
      </div>
    </Layout>;

  }

  if (error) {
    return <Layout>
      <div className="text-center py-12">
        <p className="text-red-400">Error loading posts: {error}</p>
      </div>
    </Layout>;
  }

  return (
    <Layout>
      <div className="fixed inset-0 backdrop-blur-sm bg-opacity-50 flex items-center justify-center p-8 z-50">
        <div className="bg-[#0A0B0F] rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          <Card className="bg-[#151619] border-[#2A2C36] border-0">
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <div>
                <CardTitle className="text-white">Edit Post</CardTitle>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="text-gray-400 hover:text-white hover:cursor-pointer">
                <X size={30} />
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex items-center gap-6">
                  <div className="w-20 h-20  rounded-full flex items-center justify-center">
                    { /* TODO: add conditional in future if user has a profile show it otherwise show this */},
                    <User size={32} className="text-white" />
                  </div>
                  <div>
                    <h3 className="text-white font-medium">{user?.name}</h3>
                    <p className="text-gray-400">{user?.email} - {user?.role}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-gray-400 text-sm">Post Title</label>
                    <input
                      type="text"
                      value={editPostData.post_title}
                      onChange={(e) =>
                        setEditPostData((prev) => ({ ...prev, post_title: e.target.value }))
                      } className="w-full px-3 py-2 bg-[#0A0B0F] border border-[#2A2C36] rounded-md text-white focus:border-red-400 focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1">

                    <Listbox value={selected} onChange={(val) => {
                      setSelected(val);
                      handleEditPostInputChange("category_id", val.ID);
                    }}>
                      <Label className="block text-sm/6 font-medium text-white">Post Category</Label>
                      <div className="relative mt-2">
                        <ListboxButton className="grid w-full cursor-default grid-cols-1 rounded-md bg-gray-800/50 py-1.5 pr-2 pl-3 text-left text-white outline-1 -outline-offset-1 outline-white/10 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-indigo-500 sm:text-sm/6">
                          <span className="col-start-1 row-start-1 flex items-center gap-3 pr-6">
                            <span className="block truncate">
                              {selected ? selected.Name : post?.category?.name}
                            </span>
                          </span>
                          <ChevronDown
                            aria-hidden="true"
                            className="col-start-1 row-start-1 size-5 self-center justify-self-end text-gray-400 sm:size-4"
                          />
                        </ListboxButton>

                        <ListboxOptions
                          transition
                          className="absolute z-10 mt-1 max-h-56 w-full overflow-auto rounded-md bg-gray-800 py-1 text-base outline-1 -outline-offset-1 outline-white/10 data-leave:transition data-leave:duration-100 data-leave:ease-in data-closed:data-leave:opacity-0 sm:text-sm"
                        >
                          {categories.map((category) => (
                            <ListboxOption
                              key={category.ID}
                              value={category}
                              className="group relative cursor-default py-2 pr-9 pl-3 text-white select-none data-focus:bg-indigo-500 data-focus:outline-hidden"
                            >
                              <div className="flex items-center">
                                <Button
                                  className="ml-3 block truncate font-normal group-data-selected:font-semibold"
                                  onClick={() => handleEditPostInputChange("category_id", category.ID)}>
                                  {category.Name}
                                </Button>
                              </div>

                              <span className="absolute inset-y-0 right-0 flex items-center pr-4 text-indigo-400 group-not-data-selected:hidden group-data-focus:text-white">
                                <CheckIcon aria-hidden="true" className="size-5" />
                              </span>
                            </ListboxOption>
                          ))}
                        </ListboxOptions>
                      </div>
                    </Listbox>
                  </div>

                  { /* <div className="space-y-1">
                      <label className="text-gray-400 text-sm">Featured</label>
                      <input
                        type="checkbox"
                        checked={postData.is_featured} // <-- bind to checked, not value
                        onChange={(e) => handlePostInputChange('is_featured', e.target.checked)} // <-- use e.target.checked
                        className="w-5 h-5 accent-red-400"
                      />
                      </div> */ }
                  {/*
                  <div className="space-y-1">
                    <label className="text-gray-400 text-sm">Cover Image</label>
                    <input
                      type="text"
                      value={post?.cover_image}
                      onChange={(e) => handleEditPostInputChange('cover_image', e.target.value)}
                      className="w-full px-3 py-2 bg-[#0A0B0F] border border-[#2A2C36] rounded-md text-white focus:border-red-400 focus:outline-none"
                    />
                  </div> */}
                  <CoverImageUploader value={post?.cover_image}
                    onChange={(val) => handleEditPostInputChange("cover_image", val)} />
                  <div className="space-y-1">
                    <label className="text-gray-400 text-sm">Post Introduction</label>
                    <input
                      type="text"
                      value={post?.short_content}
                      onChange={(e) => handleEditPostInputChange('short_content', e.target.value)}
                      className="w-full px-3 py-2 bg-[#0A0B0F] border border-[#2A2C36] rounded-md text-white focus:border-red-400 focus:outline-none"
                    />
                  </div>

                </div>

                <div className="space-y-1">
                  <label className="text-gray-400 text-sm">Post Body</label>
                  <Editor
                    apiKey='dt775bgzqw3gx7h13waz8gh1361rghoujlwmdha0k0mr62yy'
                    onInit={(evt, editor) => console.log("Editor is ready to edit the post:", editor, evt)}
                    onEditorChange={(e) => handleEditPostInputChange('content', e)}
                    initialValue={post?.content}
                    init={{
                      placeholder: "Edit Your Post Body here.",
                      // paste_as_text: true,
                      browser_spellcheck: true,
                      contextmenu: true,
                      height: 300,
                      skin: 'snow',
                      plugins: 'link image code table lists advlist media hr emoticons autosave codesample fullscreen preview wordcount charmap',
                      toolbar: 'undo redo | bold italic underline | alignleft aligncenter alignright alignjustify | link image | bullist numlist | codesample | fullscreen',
                      menubar: 'file edit view insert format tools table help',
                      menu: {
                        file: {
                          title: 'File',
                          items: 'newdocument | restoredraft | preview | print'
                        },
                        edit: {
                          title: 'Edit',
                          items: 'undo redo | cut copy paste | selectall | searchreplace'
                        },
                        view: {
                          title: 'View',
                          items: 'visualaid visualchars visualblocks | preview | fullscreen | code'
                        },
                        insert: {
                          title: 'Insert',
                          items: 'image link media codesample | charmap hr'
                        },
                        format: {
                          title: 'Format',
                          items: 'bold italic underline strikethrough superscript subscript | formats | removeformat'
                        },
                        tools: {
                          title: 'Tools',
                          items: 'spellchecker spellcheckerlanguage | code | wordcount'
                        },
                        table: {
                          title: 'Table',
                          items: 'inserttable | cell row column | tableprops deletetable'
                        },
                        help: {
                          title: 'Help',
                          items: 'help'
                        }
                      }, codesample_languages: [
                        { text: 'HTML/XML', value: 'markup' },
                        { text: 'JavaScript', value: 'javascript' },
                        { text: 'CSS', value: 'css' },
                        { text: 'Python', value: 'python' },
                        { text: 'Java', value: 'java' },
                        { text: 'C', value: 'c' },
                        { text: 'C#', value: 'csharp' },
                        { text: 'C++', value: 'cpp' },
                        { text: 'Go Lang', value: 'go' },
                        { text: 'React JS', value: 'jsx' },
                        { text: 'React TS', value: 'tsx' },
                        { text: 'R', value: 'r' },
                        { text: 'Protocol Buffers', value: 'protobuf' },
                        { text: 'Powershell', value: 'powershell' },
                        { text: 'GraphQL', value: 'graphql' },
                        { text: 'Bash', value: 'bash' },
                      ],
                    }}
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <Button
                    onClick={handleEditPostUpdate}
                    className="text-white hover:text-gray-400 hover:cursor-pointer">
                    Update Post
                  </Button>
                  <Button
                    variant="outline"
                    onClick={onClose}
                    className="border-[#2A2C36] text-gray-400 hover:text-white hover:cursor-pointer">
                    Cancel
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

    </Layout>
  )
};
export default EditPostComp;

