'use client'

import { useState } from 'react'

const faqs = [
  {
    question: 'What is Sultan?',
    answer: 'ReedStreams is a free sports streaming platform where you can watch live matches from different sports and check upcoming schedules. We make it easy for fans to stay connected to their favorite games.'
  },
  {
    question: 'Do I need to sign up or create an account?',
    answer: 'No. ReedStreams does not require any signup or login. You can access live matches and schedules directly without creating an account.'
  },
  {
    question: 'Which sports can I watch?',
    answer: 'You can watch a wide range of sports including Soccer, Basketball, NFL, MMA, Hockey, Baseball, and more. We update our sports list regularly so you never miss the action.'
  },
  {
    question: 'Are the matches shown live?',
    answer: 'Yes. ReedStreams provides live matches as they happen. You can also check the schedule page to see upcoming games and plan ahead.'
  },
  {
    question: 'Can I watch on mobile devices?',
    answer: 'Yes. ReedStreams is fully responsive and works on smartphones, tablets, and desktops, so you can enjoy sports on the go.'
  }
]

export default function FAQ() {
  const [activeIndex, setActiveIndex] = useState(0)

  return (
    <div className="faq-container">
      <div className="faq-header">
        <h1 className="faq-title">Frequently Asked Questions</h1>
        <p className="faq-subtitle">Find answers to common questions about ReedStreams and how to get the most out of our platform.</p>
      </div>

      <div className="faq-items">
        {faqs.map((faq, index) => (
          <div 
            key={index}
            className={`faq-item ${activeIndex === index ? 'active' : ''}`}
          >
            <div 
              className="faq-question"
              onClick={() => setActiveIndex(activeIndex === index ? -1 : index)}
            >
              <span>{faq.question}</span>
              <div className="faq-icon"></div>
            </div>
            <div className="faq-answer">
              <div className="faq-answer-content">
                <p>{faq.answer}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
