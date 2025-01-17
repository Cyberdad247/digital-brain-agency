import { motion } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Navigation } from '@/components/Navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2 },
  },
};

const fadeInUp = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1 },
};

export const Contact = () => {
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
          className="mb-12 text-center text-4xl font-bold md:text-5xl"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          Contact Us
        </motion.h1>

        <motion.div className="mx-auto max-w-3xl space-y-8">
          <motion.div variants={fadeInUp}>
            <Card>
              <CardHeader>
                <CardTitle>Get in Touch</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <Input placeholder="Your Name" />
                  <Input placeholder="Your Email" />
                </div>
                <Input placeholder="Subject" />
                <Textarea placeholder="Your Message" className="min-h-[150px]" />
                <Button className="w-full bg-accent hover:bg-accent/80">Send Message</Button>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={fadeInUp}>
            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <h3 className="font-semibold">Email</h3>
                  <p className="text-gray-600 dark:text-gray-300">hello@invisionedmarketing.com</p>
                </div>
                <div className="space-y-2">
                  <h3 className="font-semibold">Phone</h3>
                  <p className="text-gray-600 dark:text-gray-300">+1 (415) 555-7890</p>
                </div>
                <div className="space-y-2">
                  <h3 className="font-semibold">Address</h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    456 Marketing Avenue, Suite 300
                    <br />
                    San Francisco, CA 94107
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
};
