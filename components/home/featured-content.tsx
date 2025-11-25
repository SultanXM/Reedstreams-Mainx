"use client"

import { useState, useEffect } from "react"
import Link from "next/link"

export default function FeaturedContent() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const totalSlides = 3

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % totalSlides)
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  const slides = [
    {
      bg: "/Images/NFLField.jpg",
      logo: "https://logos-world.net/wp-content/uploads/2021/09/NFL-Logo.png",
      title: "NFL Highlights",
      description:
        "Catch all the NFL action with our exclusive highlights and full game replays. Experience the thrill of every Goal.",
      link: "/sports",
      badge: "NFL • Highlights",
    },
    {
      bg: "https://images.unsplash.com/photo-1556056504-5c7696c4c28d",
      logo: "https://image.fonwall.ru/o/ra/wallpaper-cristiano-ronaldo-football-real-madrid-cr7.jpeg",
      title: "Football Matches",
      description:
        "Watch the biggest football leagues live with HD streaming. Never miss a goal with our real-time coverage and multiple camera angles.",
      link: "/sports",
      badge: "Football • Live Matches",
    },
    {
      bg: "https://getwallpapers.com/wallpaper/full/c/6/0/1325866-best-mma-wallpaper-2048x1280.jpg",
      /* Added missing image for the third slide */
      logo: "https://getwallpapers.com/wallpaper/full/1/b/8/1325851-vertical-mma-wallpaper-1920x1080-htc.jpg",
      title: "Upcoming Events",
      description:
        "Stay updated with our calendar of upcoming sports events. Set reminders so you never miss your favorite teams in action.",
      link: "#",
      badge: "Events • Schedule",
    },
  ]

  return (
    <section className="featured-section">
      <h2 className="section-title">Featured Content</h2>
      <p className="section-subtitle">Discover the most exciting sports events and highlights</p>

      <div className="carousel-container">
        <div className="carousel" style={{ transform: `translateX(-${currentSlide * 100}%)` }}>
          {slides.map((slide, index) => (
            <div key={index} className="carousel-item">
              <div className="carousel-bg" style={{ backgroundImage: `url(${slide.bg})` }}></div>
              <div className="carousel-content-container">
                <div className="carousel-image">
                  <img src={slide.logo || "/placeholder.svg"} alt={slide.title} />
                  <div className="image-overlay">{slide.badge}</div>
                </div>
                <div className="carousel-content">
                  <h3 className="carousel-heading">{slide.title}</h3>
                  <p className="carousel-description">{slide.description}</p>
                  <Link href={slide.link}>
                    <button className="carousel-button">
                      <i className="fas fa-play-circle" style={{ marginRight: "8px" }}></i>
                      Watch Now
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        <button
          className="nav-button prev-btn"
          onClick={() => setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides)}
        >
          <i className="fas fa-chevron-left"></i>
        </button>
        <button className="nav-button next-btn" onClick={() => setCurrentSlide((prev) => (prev + 1) % totalSlides)}>
          <i className="fas fa-chevron-right"></i>
        </button>

        <div className="carousel-indicators">
          {[0, 1, 2].map((index) => (
            <div
              key={index}
              className={`indicator ${currentSlide === index ? "active" : ""}`}
              onClick={() => setCurrentSlide(index)}
            ></div>
          ))}
        </div>
      </div>
    </section>
  )
}
