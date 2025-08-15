import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Heart, Bookmark, MessageCircle, User, Eye } from 'lucide-react';
import { useDashboard } from '@/hooks/memberDashboardHooks';
import Layout from '@/components/layout';

const MemberDashboard = () => {
  const { dashboard, loading, error } = useDashboard();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');

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
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Member Dashboard</h1>
          <p className="text-gray-400 mt-1">Welcome back, {user?.name}</p>
        </div>
        <Button variant="outline" className="border-[#2A2C36] text-gray-400 hover:text-white">
          <User size={16} className="mr-2" />
          Edit Profile
        </Button>
      </div>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-[#2A2C36] pb-4">
        {['overview', 'liked', 'saved', 'comments', 'profile'].map((tab) => (
          <Button
            key={tab}
            variant={activeTab === tab ? 'default' : 'ghost'}
            onClick={() => setActiveTab(tab)}
            className={activeTab === tab ? 'text-red-400 hover:text-red-400/70' : 'text-gray-400 hover:text-white'}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </Button>
        ))}
      </div>

      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="bg-[#151619] border-[#2A2C36]">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-400">Posts Liked</CardTitle>
                <Heart className="h-4 w-4 text-red-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">{dashboard?.liked_posts_total}</div>
                <p className="text-xs text-green-400 mt-1">+{dashboard?.liked_posts_weekly} this week</p>
              </CardContent>
            </Card>
            <Card className="bg-[#151619] border-[#2A2C36]">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-400">Comments</CardTitle>
                <MessageCircle className="h-4 w-4 text-red-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">{dashboard?.comments_total}</div>
                <p className="text-xs text-green-400 mt-1">+{dashboard?.comments_weekly} this week</p>
              </CardContent>
            </Card>
            <Card className="bg-[#151619] border-[#2A2C36]">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-400">Saved Posts</CardTitle>
                <Bookmark className="h-4 w-4 text-red-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">{dashboard?.saved_posts_total}</div>
                <p className="text-xs text-green-400 mt-1">+{dashboard?.saved_posts_weekly} this month</p>
              </CardContent>
            </Card>
            <Card className="bg-[#151619] border-[#2A2C36]">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-400">Posts Read</CardTitle>
                <Eye className="h-4 w-4 text-red-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">{dashboard?.posts_read_total}</div>
                <p className="text-xs text-green-400 mt-1">+{dashboard?.posts_read_weekly} this month</p>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-[#151619] border-[#2A2C36]">
              <CardHeader>
                <CardTitle className="text-white">Recently Liked</CardTitle>
                <CardDescription className="text-gray-400">Posts you've liked recently</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {dashboard?.recently_liked.map((post) => (
                    <div key={post.Slug} className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <a href={`/posts/${post.Slug}`} ><p className="text-white font-medium truncate hover:text-gray-400">{post.post_title}</p></a>
                        <p className="text-sm text-gray-500">Authored by: {post.Author.full_name}</p>
                      </div>
                      <div className="text-right ml-4">
                        <Heart size={16} className="text-red-400" />
                        <p className="text-xs text-gray-500 mt-1">{post.updated_at}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-[#151619] border-[#2A2C36]">
              <CardHeader>
                <CardTitle className="text-white">Saved Posts</CardTitle>
                <CardDescription className="text-gray-400">Posts you've bookmarked</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {dashboard?.recently_saved.map((post) => (
                    <div key={post.Slug} className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <a href={`/posts/${post.Slug}`} ><p className="text-white font-medium truncate hover:text-gray-400">{post.post_title}</p></a>
                        <p className="text-sm text-gray-400">Authored by {post.Author.full_name}</p>
                      </div>
                      <div className="text-right ml-4">
                        <Bookmark size={16} className="text-red-400" />
                        <p className="text-xs text-gray-500 mt-1">{post.updated_at}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {activeTab === 'liked' && (
        <Card className="bg-[#151619] border-[#2A2C36]">
          <CardHeader>
            <CardTitle className="text-white">Liked Posts</CardTitle>
            <CardDescription className="text-gray-400">All posts you've liked</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {dashboard?.recently_liked.map((post) => (
                <div key={post.Slug} className="p-4 rounded-lg bg-[#0A0B0F] border border-[#2A2C36]">
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <a href={`/posts/${post.Slug}`} ><h3 className="text-white font-medium text-red-400 hover:text-gray-400/90">{post.post_title}</h3></a>
                      <p className="text-sm text-gray-400">Authored by {post.Author.full_name}</p>
                    </div>
                    <Heart size={20} className="text-tech-red ml-4" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {activeTab === 'saved' && (
        <Card className="bg-[#151619] border-[#2A2C36]">
          <CardHeader>
            <CardTitle className="text-white">Saved Posts</CardTitle>
            <CardDescription className="text-gray-400">Your bookmarked posts</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {dashboard?.recently_saved.map((post) => (
                <div key={post.Slug} className="p-4 rounded-lg bg-[#0A0B0F] border border-[#2A2C36]">
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <a href={`/posts/${post.Slug}`}> <h3 className="text-white font-medium hover:text-gray-400">{post.post_title}</h3></a>
                      <p className="text-sm text-gray-400">Authored by {post.Author.full_name}</p>
                    </div>
                    <Bookmark size={20} className="text-tech-red ml-4" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )
      }

      {
        // activeTab === 'comments' && (
        //   <Card className="bg-[#151619] border-[#2A2C36]">
        //     <CardHeader>
        //       <CardTitle className="text-white">My Comments</CardTitle>
        //       <CardDescription className="text-gray-400">Comments you've made on posts</CardDescription>
        //     </CardHeader>
        //     <CardContent>
        //       <div className="space-y-4">
        //         {dashboard?.recently_saved.map((comment) => (
        //           <div key={comment.Slug} className="p-4 rounded-lg bg-[#0A0B0F] border border-[#2A2C36]">
        //             <div className="space-y-2">
        //               <h3 className="text-white font-medium">{comment.post_title}</h3>
        //               <p className="text-gray-300">{comment.Slug}</p>
        //               <p className="text-sm text-gray-500">Commented on {comment.updated_at}</p>
        //             </div>
        //           </div>
        //         ))}
        //       </div>
        //     </CardContent>
        //   </Card>
        // )
      }

      {
        activeTab === 'profile' && (
          <Card className="bg-[#151619] border-[#2A2C36]">
            <CardHeader>
              <CardTitle className="text-white">Profile Settings</CardTitle>
              <CardDescription className="text-gray-400">Update your profile information</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex items-center gap-6">
                  <div className="w-20 h-20 bg-tech-red rounded-full flex items-center justify-center">
                    <User size={32} className="text-white" />
                  </div>
                  <div>
                    <h3 className="text-white font-medium">{user?.name}</h3>
                    <p className="text-gray-400">{user?.email} - {user?.role}</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-gray-400 text-sm">Full Name</label>
                    <input
                      type="text"
                      value={user?.name || ''}
                      className="w-full px-3 py-2 bg-[#0A0B0F] border border-[#2A2C36] rounded-md text-white focus:border-tech-red"
                      readOnly
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-gray-400 text-sm">Email</label>
                    <input
                      type="email"
                      value={user?.email || ''}
                      className="w-full px-3 py-2 bg-[#0A0B0F] border border-[#2A2C36] rounded-md text-white focus:border-tech-red"
                      readOnly
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-gray-400 text-sm">Bio</label>
                    <textarea
                      placeholder="Tell us about yourself..."
                      className="w-full px-3 py-2 bg-[#0A0B0F] border border-[#2A2C36] rounded-md text-white focus:border-tech-red h-24"
                    />
                  </div>
                </div>
                <Button className="text-red-400 hover:text-red-400/70">
                  Update Profile
                </Button>
              </div>
            </CardContent>
          </Card>
        )
      }
    </div >
  );
};

export default MemberDashboard;
