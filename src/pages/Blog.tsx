import { motion } from 'framer-motion'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Navigation } from '@/components/Navigation'
import { Button } from '@/components/ui/button'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { staggerChildren: 0.2 }
  }
}

const fadeInUp = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1 }
}

const blogPosts = [
  {
    title: "The Future of Web Development",
    date: "October 15, 2023",
    excerpt: "Exploring the latest trends and technologies shaping the future of web development.",
    image: "/lovable-uploads/e37ad8e8-a3f4-4d85-a0bc-308b8addbb92.png"
  },
  {
    title: "Mastering Responsive Design",
    date: "September 28, 2023",
    excerpt: "Best practices and techniques for creating truly responsive web designs.",
    image: "/lovable-uploads/eaecd866-2c98-451b-bc04-52404085afe5.png"
  },
  {
    title: "AI in Digital Marketing",
    date: "September 10, 2023",
    excerpt: "How artificial intelligence is revolutionizing digital marketing strategies.",
    image: "/lovable-uploads/e37ad8e8-a3f4-4d85-a0bc-308b8addbb92.png"
  }
]

export const Blog = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <motion.div 
        className="container mx-auto px-4 py-16"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <motion.h1 
          className="text-4xl md:text-5xl font-bold mb-12 text-center"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          Our Blog
        </motion.h1>
        
        <motion.div className="max-w-4xl mx-auto space-y-8">
          {blogPosts.map((post, index) => (
            <motion.div 
              key={index}
              variants={fadeInUp}
            >
              <Card>
                <CardHeader>
                  <img 
                    src={post.image}
                    alt={post.title}
                    className="w-full h-64 object-cover rounded-lg mb-4"
                  />
                  <CardTitle>{post.title}</CardTitle>
                  <p className="text-sm text-gray-500">{post.date}</p>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    {post.excerpt}
                  </p>
                  <Button 
                    variant="outline"
                    className="border-accent text-accent hover:bg-accent/10"
                  >
                    Read More
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        <motion.div 
          className="text-center mt-12"
          variants={fadeInUp}
        >
          <Button className="bg-accent hover:bg-accent/80">
            View All Posts
          </Button>
        </motion.div>
      </motion.div>
    </div>
  )
}
