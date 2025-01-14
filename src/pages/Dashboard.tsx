import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { useNavigate } from 'react-router-dom'

export default function Dashboard() {
  const [user, setUser] = useState(null)
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        navigate('/')
        return
      }
      setUser(user)
      fetchPosts()
    }

    const fetchPosts = async () => {
      try {
        const { data, error } = await supabase
          .from('posts')
          .select('*')
          .order('created_at', { ascending: false })
        
        if (error) throw error
        setPosts(data)
      } catch (error) {
        console.error('Error fetching posts:', error)
      } finally {
        setLoading(false)
      }
    }

    getUser()
  }, [navigate])

  if (!user) return <div>Loading...</div>

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      <div className="bg-white p-6 rounded-lg shadow mb-4">
        <h2 className="text-xl font-semibold mb-2">User Information</h2>
        <p>Email: {user.email}</p>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Recent Posts</h2>
        {loading ? (
          <p>Loading posts...</p>
        ) : posts.length > 0 ? (
          <div className="space-y-4">
            {posts.map(post => (
              <div key={post.id} className="border-b pb-4">
                <h3 className="font-semibold">{post.title}</h3>
                <p className="text-sm text-gray-600">{post.content}</p>
                <p className="text-xs text-gray-400 mt-2">
                  {new Date(post.created_at).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p>No posts found</p>
        )}
      </div>
    </div>
  )
}
