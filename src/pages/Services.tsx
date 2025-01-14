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

const services = [
  {
    title: "AI-Powered Marketing",
    description: "Leverage cutting-edge AI to create hyper-targeted marketing campaigns that deliver measurable results.",
    icon: "🤖"
  },
  {
    title: "Data Analytics",
    description: "Gain actionable insights from your marketing data with our advanced analytics and reporting tools.",
    icon: "📊"
  },
  {
    title: "Social Media Management",
    description: "Maximize your social media impact with our comprehensive management and optimization services.",
    icon: "📱"
  },
  {
    title: "SEO & Content Strategy",
    description: "Boost your search rankings and online visibility with our proven SEO and content marketing strategies.",
    icon: "🔍"
  },
  {
    title: "Email Marketing Automation",
    description: "Create personalized, automated email campaigns that nurture leads and drive conversions.",
    icon: "✉️"
  },
  {
    title: "Performance Marketing",
    description: "Optimize your ad spend and maximize ROI with our data-driven performance marketing solutions.",
    icon: "🚀"
  },
  {
    title: "Brand Strategy",
    description: "Develop a strong, consistent brand identity that resonates with your target audience.",
    icon: "🎯"
  },
  {
    title: "Conversion Rate Optimization",
    description: "Increase your website's conversion rates through data-driven testing and optimization.",
    icon: "📈"
  },
  {
    title: "Marketing Technology",
    description: "Implement and optimize marketing technology stacks to streamline your operations and improve efficiency.",
    icon: "🛠️"
  },
  {
    title: "AI Agent Creation",
    description: "Develop custom AI agents to automate complex marketing tasks and decision-making processes.",
    icon: "🤖"
  },
  {
    title: "Marketing Automation",
    description: "Create intelligent automation workflows to optimize marketing operations and customer journeys.",
    icon: "⚙️"
  }
]

export const Services = () => {
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
          Our Services
        </motion.h1>
        
        <motion.div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <motion.div 
              key={index}
              variants={fadeInUp}
            >
              <Card className="h-full">
                <CardHeader>
                  <div className="flex items-center space-x-4">
                    <span className="text-2xl">{service.icon}</span>
                    <CardTitle>{service.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 dark:text-gray-300">
                    {service.description}
                  </p>
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
            Explore Our Services
          </Button>
        </motion.div>
      </motion.div>
    </div>
  )
}
