import { useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { Card, CardContent } from '../components/ui/card'

interface FAQItem {
  question: string
  answer: string
  category: string
}

const faqData: FAQItem[] = [
  {
    category: "Getting Started",
    question: "How do I add my business to the directory?",
    answer: "Adding your business is simple! Click the 'Add Your Business' button in the top navigation, create an account if you haven't already, and fill out the business listing form with your company details, contact information, and description. Your listing will be reviewed and published within 24 hours."
  },
  {
    category: "Getting Started",
    question: "Is it free to list my business?",
    answer: "Yes! Basic business listings are completely free. We also offer premium features like featured listings, enhanced analytics, and priority placement for businesses that want additional visibility."
  },
  {
    category: "Getting Started",
    question: "How do I search for businesses?",
    answer: "Use the search bar on our homepage to enter keywords, business names, or services you're looking for. You can also filter by location, category, ratings, and other criteria to find exactly what you need."
  },
  {
    category: "Account Management",
    question: "How do I edit my business listing?",
    answer: "Log into your account and go to your dashboard. Click on 'My Listings' to see all your business listings, then click 'Edit' on the listing you want to update. You can modify any information including photos, hours, contact details, and descriptions."
  },
  {
    category: "Account Management",
    question: "Can I have multiple business listings?",
    answer: "Absolutely! You can add multiple business listings under one account. This is perfect for business owners with multiple locations or different business ventures."
  },
  {
    category: "Account Management",
    question: "How do I delete my account?",
    answer: "To delete your account, go to your account settings and click 'Delete Account'. Please note that this action is permanent and will remove all your business listings and data. Contact support if you need assistance."
  },
  {
    category: "Reviews & Ratings",
    question: "How do reviews work?",
    answer: "Customers can leave reviews and ratings (1-5 stars) for businesses they've visited. Reviews help other customers make informed decisions and help businesses improve their services. All reviews are moderated to ensure quality and authenticity."
  },
  {
    category: "Reviews & Ratings",
    question: "Can I respond to reviews?",
    answer: "Yes! Business owners can respond to reviews left on their listings. This is a great way to thank customers for positive feedback or address any concerns mentioned in negative reviews professionally."
  },
  {
    category: "Reviews & Ratings",
    question: "How do I report inappropriate reviews?",
    answer: "If you find a review that violates our guidelines (fake, spam, inappropriate language, etc.), click the 'Report' button next to the review. Our moderation team will investigate and take appropriate action."
  },
  {
    category: "Technical Support",
    question: "Why isn't my business showing up in search results?",
    answer: "There are several reasons this might happen: your listing may still be under review, you might need to optimize your business description with relevant keywords, or your listing category might not match what customers are searching for. Contact support for personalized help."
  },
  {
    category: "Technical Support",
    question: "How do I upload photos to my listing?",
    answer: "In your business listing editor, look for the 'Photos' section. You can drag and drop images or click to browse and select files from your computer. We recommend high-quality images that showcase your business, products, or services."
  },
  {
    category: "Technical Support",
    question: "What image formats are supported?",
    answer: "We support JPG, PNG, and WebP image formats. Images should be at least 800x600 pixels for best quality. The maximum file size is 10MB per image."
  },
  {
    category: "Billing & Subscriptions",
    question: "What premium features are available?",
    answer: "Premium features include: featured listing placement, advanced analytics, priority customer support, multiple photos, social media integration, and promotional badges. Check our pricing page for detailed information."
  },
  {
    category: "Billing & Subscriptions",
    question: "How do I upgrade to a premium plan?",
    answer: "Go to your dashboard and click 'Upgrade Plan' or visit our pricing page. Choose the plan that best fits your needs and complete the payment process. Premium features will be activated immediately."
  },
  {
    category: "Billing & Subscriptions",
    question: "Can I cancel my subscription anytime?",
    answer: "Yes, you can cancel your subscription at any time from your account settings. Your premium features will remain active until the end of your current billing period."
  },
  {
    category: "Privacy & Security",
    question: "How is my personal information protected?",
    answer: "We take privacy seriously and use industry-standard security measures to protect your data. We never sell your personal information to third parties. Please read our Privacy Policy for detailed information about how we handle your data."
  },
  {
    category: "Privacy & Security",
    question: "Can I control what information is public?",
    answer: "Yes! You have full control over what information appears in your public business listing. Personal account information like your email and phone number are kept private unless you choose to display them in your business contact information."
  }
]

export default function FAQ() {
  const [openItems, setOpenItems] = useState<number[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>('All')

  const categories = ['All', ...Array.from(new Set(faqData.map(item => item.category)))]
  
  const filteredFAQs = selectedCategory === 'All' 
    ? faqData 
    : faqData.filter(item => item.category === selectedCategory)

  const toggleItem = (index: number) => {
    setOpenItems(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    )
  }

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-xl text-muted-foreground">
            Find answers to common questions about our platform
          </p>
        </div>

        {/* Category Filter */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-2 justify-center">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedCategory === category
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground hover:bg-muted/80'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* FAQ Items */}
        <div className="space-y-4">
          {filteredFAQs.map((faq, index) => (
            <Card key={index} className="overflow-hidden">
              <CardContent className="p-0">
                <button
                  onClick={() => toggleItem(index)}
                  className="w-full p-6 text-left hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded">
                          {faq.category}
                        </span>
                      </div>
                      <h3 className="text-lg font-semibold text-foreground">
                        {faq.question}
                      </h3>
                    </div>
                    <div className="ml-4">
                      {openItems.includes(index) ? (
                        <ChevronUp className="h-5 w-5 text-muted-foreground" />
                      ) : (
                        <ChevronDown className="h-5 w-5 text-muted-foreground" />
                      )}
                    </div>
                  </div>
                </button>
                
                {openItems.includes(index) && (
                  <div className="px-6 pb-6">
                    <div className="pt-4 border-t border-border">
                      <p className="text-muted-foreground leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Contact Section */}
        <div className="mt-12 text-center">
          <div className="bg-muted/50 rounded-lg p-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">
              Still have questions?
            </h2>
            <p className="text-muted-foreground mb-6">
              Can't find the answer you're looking for? Our support team is here to help.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="mailto:support@globaldirectory.com"
                className="inline-flex items-center justify-center px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
              >
                Contact Support
              </a>
              <a
                href="tel:+15551234567"
                className="inline-flex items-center justify-center px-6 py-3 border border-border rounded-lg hover:bg-muted transition-colors"
              >
                Call Us: +1 (555) 123-4567
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}