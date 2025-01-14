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

export const About = () => {
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
          About Us
        </motion.h1>
        
        <motion.div className="max-w-3xl mx-auto space-y-8">
          <motion.div variants={fadeInUp}>
            <Card>
              <CardHeader>
                <CardTitle>Our Story</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-600 dark:text-gray-300">
                  Founded in 2023, Invisioned Marketing was born from a vision to revolutionize digital marketing through AI-powered strategies. Our team of marketing experts, data scientists, and creative professionals came together with a shared mission: to help businesses achieve their full potential in the digital space.
                </p>
                <p className="text-gray-600 dark:text-gray-300">
                  In just one year, we've helped over 50 businesses achieve measurable growth, with our clients seeing an average 300% increase in online engagement and a 150% boost in conversion rates.
                </p>
                <p className="text-gray-600 dark:text-gray-300">
                  Our unique approach combines cutting-edge AI technology with proven marketing strategies, delivering results that go beyond traditional marketing methods.
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={fadeInUp}>
            <Card>
              <CardHeader>
                <CardTitle>Our Mission</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-600 dark:text-gray-300">
                  We're committed to transforming businesses through AI-driven marketing strategies that deliver measurable results. Our mission is to help businesses not just survive, but thrive in the digital age by providing innovative, data-driven solutions that create real impact.
                </p>
                <p className="text-gray-600 dark:text-gray-300">
                  We believe in creating marketing strategies that are as unique as your business, combining the power of AI with human creativity to deliver campaigns that truly resonate with your audience.
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={fadeInUp}>
            <Card>
              <CardHeader>
                <CardTitle>Our Values</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <h3 className="font-semibold">Innovation</h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    We're pioneers in AI-driven marketing, constantly developing new tools and strategies to keep our clients ahead of the competition.
                  </p>
                </div>
                <div className="space-y-2">
                  <h3 className="font-semibold">Integrity</h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    We maintain complete transparency in our strategies and results, building trust through honest communication and ethical marketing practices.
                  </p>
                </div>
                <div className="space-y-2">
                  <h3 className="font-semibold">Excellence</h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    We set the highest standards for our work, delivering measurable results and continuously optimizing our strategies for maximum impact.
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div 
            className="text-center"
            variants={fadeInUp}
          >
            <Button className="bg-accent hover:bg-accent/80">
              Learn More About Our Work
            </Button>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  )
}
