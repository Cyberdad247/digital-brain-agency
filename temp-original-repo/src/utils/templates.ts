/**
 * Represents a code template with metadata and content
 */
export interface Template {
  id: string;
  title: string;
  description: string;
  code: string;
  language: string;
  /** Optional tags for categorization */
  tags?: string[];
  /** Optional metadata for template usage */
  metadata?: {
    lastUsed?: Date;
    usageCount?: number;
    rating?: number;
  };
}

/**
 * Predefined code templates for various use cases
 */
export const TEMPLATES: Template[] = [
  {
    id: 'data-analysis',
    title: 'Data Analysis',
    description: 'Python scripts for analyzing datasets and creating visualizations',
    code: `import pandas as pd
import matplotlib.pyplot as plt

# Load dataset
df = pd.read_csv('data.csv')

# Basic analysis
print(df.describe())

# Create visualization
df.plot(kind='bar', x='category', y='value')
plt.show()`,
    language: 'python'
  },
  {
    id: 'web-dev',
    title: 'Web Development',
    description: 'Front-end and back-end component templates',
    code: `// React component template
function MyComponent() {
  const [state, setState] = useState();

  return (
    <div>
      <h1>My Component</h1>
    </div>
  );
}`,
    language: 'typescript'
  },
  {
    id: 'game-dev',
    title: 'Game Development',
    description: 'Script mechanics and features for game engines',
    code: `// Unity C# script template
using UnityEngine;

public class PlayerController : MonoBehaviour {
    public float speed = 5.0f;

    void Update() {
        float move = Input.GetAxis("Vertical") * speed * Time.deltaTime;
        transform.Translate(0, 0, move);
    }
}`,
    language: 'csharp'
  },
  {
    id: 'api-integration',
    title: 'API Integration',
    description: 'API call templates for various services',
    code: `// Fetch API template
async function fetchData() {
  try {
    const response = await fetch('https://api.example.com/data');
    const data = await response.json();
    console.log(data);
  } catch (error) {
    console.error('Error:', error);
  }
}`,
    language: 'typescript'
  },
  {
    id: 'automation',
    title: 'Automation',
    description: 'Scripts for automating repetitive tasks',
    code: `// File processing automation
const fs = require('fs');
const path = require('path');

function processFiles(directory) {
  fs.readdir(directory, (err, files) => {
    files.forEach(file => {
      const filePath = path.join(directory, file);
      // Process each file
    });
  });
}`,
    language: 'javascript'
  },
  {
    id: 'simulations',
    title: 'Mathematical Simulations',
    description: 'Algorithms for simulations and modeling',
    code: `// Monte Carlo simulation
function monteCarlo(iterations) {
  let inside = 0;
  
  for (let i = 0; i < iterations; i++) {
    const x = Math.random();
    const y = Math.random();
    
    if (x*x + y*y <= 1) {
      inside++;
    }
  }
  
  return 4 * inside / iterations;
}`,
    language: 'javascript'
  },
  {
    id: 'learning-resources',
    title: 'Learning Resources',
    description: 'Curated tutorials and documentation',
    code: `// Available learning resources:
const resources = {
  'TypeScript': 'https://www.typescriptlang.org/docs/',
  'React': 'https://react.dev/learn',
  'JavaScript': 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide',
  'Python': 'https://docs.python.org/3/tutorial/',
  'Node.js': 'https://nodejs.org/en/docs/guides/',
  'Best Practices': 'https://github.com/ryanmcdermott/clean-code-javascript'
};

// Access resources
function openResource(resource) {
  window.open(resources[resource], '_blank');
}`,
    language: 'typescript'
  },
  {
    id: 'community-features',
    title: 'Community Features',
    description: 'Forum and discussion board templates',
    code: `// Community API client
class CommunityClient {
  constructor(baseUrl) {
    this.baseUrl = baseUrl;
  }

  // Get all forum posts
  async getPosts() {
    const response = await fetch(\`\${this.baseUrl}/posts\`);
    return response.json();
  }

  // Create new post
  async createPost(post) {
    const response = await fetch(\`\${this.baseUrl}/posts\`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(post)
    });
    return response.json();
  }

  // Get post comments
  async getComments(postId) {
    const response = await fetch(\`\${this.baseUrl}/posts/\${postId}/comments\`);
    return response.json();
  }

  // Add comment
  async addComment(postId, comment) {
    const response = await fetch(\`\${this.baseUrl}/posts/\${postId}/comments\`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(comment)
    });
    return response.json();
  }
}

// Forum component
function Forum() {
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState({ title: '', content: '' });
  const client = new CommunityClient('https://api.example.com/community');

  useEffect(() => {
    client.getPosts().then(setPosts);
  }, []);

  const handlePostSubmit = async (e) => {
    e.preventDefault();
    const createdPost = await client.createPost(newPost);
    setPosts([createdPost, ...posts]);
    setNewPost({ title: '', content: '' });
  };

  return (
    <div className="space-y-4">
      <form onSubmit={handlePostSubmit} className="space-y-2">
        <input
          type="text"
          value={newPost.title}
          onChange={(e) => setNewPost({...newPost, title: e.target.value})}
          placeholder="Post title"
          required
        />
        <textarea
          value={newPost.content}
          onChange={(e) => setNewPost({...newPost, content: e.target.value})}
          placeholder="Post content"
          required
        />
        <button type="submit">Create Post</button>
      </form>

      <div className="space-y-4">
        {posts.map(post => (
          <div key={post.id} className="border p-4 rounded">
            <h3>{post.title}</h3>
            <p>{post.content}</p>
            <Comments postId={post.id} />
          </div>
        ))}
      </div>
    </div>
  );
}

// Comments component
function Comments({ postId }) {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const client = new CommunityClient('https://api.example.com/community');

  useEffect(() => {
    client.getComments(postId).then(setComments);
  }, [postId]);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    const createdComment = await client.addComment(postId, { content: newComment });
    setComments([createdComment, ...comments]);
    setNewComment('');
  };

  return (
    <div className="mt-4 space-y-2">
      <form onSubmit={handleCommentSubmit} className="flex gap-2">
        <input
          type="text"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Add a comment..."
          required
        />
        <button type="submit">Comment</button>
      </form>

      <div className="space-y-2">
        {comments.map(comment => (
          <div key={comment.id} className="pl-4 border-l">
            <p>{comment.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
}`,
    language: 'typescript'
  }
];
