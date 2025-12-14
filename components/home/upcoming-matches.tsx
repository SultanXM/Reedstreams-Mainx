"use client"

import { useEffect, useRef } from "react"
import Link from "next/link"

const getTomorrowDate = () => {
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)

  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ]

  const dayName = days[tomorrow.getDay()]
  const month = months[tomorrow.getMonth()]
  const date = tomorrow.getDate()

  return {
    fullDate: `${dayName}, ${month} ${date}`,
    shortDate: `${month} ${date}`,
  }
}

const row1BaseMatches = (tomorrowDate: { fullDate: string; shortDate: string }) => [
  {
    id: "1",
    team1: "SBA",
    team2: "BOY",
    date: tomorrowDate.fullDate,
    time: "17:00hs",
    logo1: "https://assets.nunchee.com/out/663e77558f3b977371bc211f/original/square/25.png",
    logo2: "https://assets.nunchee.com/out/67b3863a88ce21802deacd8c/original/square/25.webp",
  },
  {
    id: "2",
    team1: "ALI",
    team2: "SCL",
    date: tomorrowDate.shortDate,
    time: "18:00hs",
    logo1: "https://assets.nunchee.com/out/65e0dcfbd7158f00248870b1/original/square/25.png",
    logo2: "https://assets.nunchee.com/out/65e0dcfda34797002386bccf/original/square/25.png",
  },
  {
    id: "3",
    team1: "UNI",
    team2: "BIN",
    date: tomorrowDate.fullDate,
    time: "16:00hs",
    logo1: "https://assets.nunchee.com/out/65e0dcf7ffdfd4001d4acc09/original/square/25.png",
    logo2: "https://assets.nunchee.com/out/663e77918f3b977371bc221d/original/square/25.png",
  },
  {
    id: "4",
    team1: "UTC",
    team2: "CUS",
    date: tomorrowDate.fullDate,
    time: "16:00hs",
    logo1: "https://assets.nunchee.com/out/65d9e412878f81001c9d878d/original/square/25.png",
    logo2: "https://assets.nunchee.com/out/663e7763c2e2b7b5bb8349d8/original/square/25.png",
  },
  {
    id: "5",
    team1: "CAG",
    team2: "SCL",
    date: tomorrowDate.fullDate,
    time: "09:00hs",
    logo1: "https://assets.nunchee.com/out/65e0dd08ffdfd4001d4acc28/original/square/25.png",
    logo2: "https://assets.nunchee.com/out/65e0dcf9ffdfd4001d4acc0d/original/square/25.png",
  },
  {
    id: "6",
    team1: "LCH",
    team2: "UTC",
    date: tomorrowDate.fullDate,
    time: "11:15hs",
    logo1: "https://assets.nunchee.com/out/65e0dd01d7158f00248870b9/original/square/25.png",
    logo2: "https://assets.nunchee.com/out/6894e05afe52bdaf931ec436/original/square/25.webp",
  },
  {
    id: "7",
    team1: "MUN",
    team2: "CHE",
    date: tomorrowDate.fullDate,
    time: "15:00hs",
    logo1: "https://assets.nunchee.com/out/65e0dcfbd7158f00248870b1/original/square/25.png",
    logo2: "https://assets.nunchee.com/out/65e0dcfda34797002386bccf/original/square/25.png",
  },
  {
    id: "8",
    team1: "ARS",
    team2: "LIV",
    date: tomorrowDate.fullDate,
    time: "17:30hs",
    logo1: "https://assets.nunchee.com/out/65e0dcf7ffdfd4001d4acc09/original/square/25.png",
    logo2: "https://assets.nunchee.com/out/663e77918f3b977371bc221d/original/square/25.png",
  },
  {
    id: "9",
    team1: "BAR",
    team2: "MAD",
    date: tomorrowDate.fullDate,
    time: "20:00hs",
    logo1: "https://assets.nunchee.com/out/65d9e412878f81001c9d878d/original/square/25.png",
    logo2: "https://assets.nunchee.com/out/663e7763c2e2b7b5bb8349d8/original/square/25.png",
  },
  {
    id: "10",
    team1: "PSG",
    team2: "BAY",
    date: tomorrowDate.fullDate,
    time: "21:00hs",
    logo1: "https://assets.nunchee.com/out/65e0dd08ffdfd4001d4acc28/original/square/25.png",
    logo2: "https://assets.nunchee.com/out/65e0dcf9ffdfd4001d4acc0d/original/square/25.png",
  },
]

const row2BaseMatches = (tomorrowDate: { fullDate: string; shortDate: string }) => [
  {
    id: "11",
    team1: "AUN",
    team2: "ADT",
    date: tomorrowDate.fullDate,
    time: "13:30hs",
    logo1: "https://assets.nunchee.com/out/663e777f52a56c84b6901908/original/square/25.png",
    logo2: "https://assets.nunchee.com/out/65e0dcf5878f81001c9e8c7e/original/square/25.png",
  },
  {
    id: "12",
    team1: "ADT",
    team2: "UNI",
    date: tomorrowDate.fullDate,
    time: "13:30hs",
    logo1: "https://assets.nunchee.com/out/63d978be8df6657354bf1530/original/square/25.png",
    logo2: "https://assets.nunchee.com/out/65e0dceed7158f00248870a5/original/square/25.png",
  },
  {
    id: "13",
    team1: "INT",
    team2: "JUV",
    date: tomorrowDate.fullDate,
    time: "14:00hs",
    logo1: "https://assets.nunchee.com/out/65e0dcfbd7158f00248870b1/original/square/25.png",
    logo2: "https://assets.nunchee.com/out/65e0dcfda34797002386bccf/original/square/25.png",
  },
  {
    id: "14",
    team1: "ATM",
    team2: "RMA",
    date: tomorrowDate.fullDate,
    time: "16:30hs",
    logo1: "https://assets.nunchee.com/out/65e0dcf7ffdfd4001d4acc09/original/square/25.png",
    logo2: "https://assets.nunchee.com/out/663e77918f3b977371bc221d/original/square/25.png",
  },
  {
    id: "15",
    team1: "NAP",
    team2: "ROM",
    date: tomorrowDate.fullDate,
    time: "19:00hs",
    logo1: "https://assets.nunchee.com/out/65d9e412878f81001c9d878d/original/square/25.png",
    logo2: "https://assets.nunchee.com/out/663e7763c2e2b7b5bb8349d8/original/square/25.png",
  },
  {
    id: "16",
    team1: "DOR",
    team2: "LEV",
    date: tomorrowDate.fullDate,
    time: "21:30hs",
    logo1: "https://assets.nunchee.com/out/65e0dd08ffdfd4001d4acc28/original/square/25.png",
    logo2: "https://assets.nunchee.com/out/65e0dcf9ffdfd4001d4acc0d/original/square/25.png",
  },
  {
    id: "17",
    team1: "MAR",
    team2: "LYO",
    date: tomorrowDate.fullDate,
    time: "18:00hs",
    logo1: "https://assets.nunchee.com/out/663e777f52a56c84b6901908/original/square/25.png",
    logo2: "https://assets.nunchee.com/out/65e0dcf5878f81001c9e8c7e/original/square/25.png",
  },
  {
    id: "18",
    team1: "MON",
    team2: "LIL",
    date: tomorrowDate.fullDate,
    time: "20:00hs",
    logo1: "https://assets.nunchee.com/out/63d978be8df6657354bf1530/original/square/25.png",
    logo2: "https://assets.nunchee.com/out/65e0dceed7158f00248870a5/original/square/25.png",
  },
  {
    id: "19",
    team1: "CEL",
    team2: "RAN",
    date: tomorrowDate.fullDate,
    time: "19:45hs",
    logo1: "https://assets.nunchee.com/out/65e0dcfbd7158f00248870b1/original/square/25.png",
    logo2: "https://assets.nunchee.com/out/65e0dcfda34797002386bccf/original/square/25.png",
  },
  {
    id: "20",
    team1: "BEN",
    team2: "POR",
    date: tomorrowDate.fullDate,
    time: "21:00hs",
    logo1: "https://assets.nunchee.com/out/65e0dcf7ffdfd4001d4acc09/original/square/25.png",
    logo2: "https://assets.nunchee.com/out/663e77918f3b977371bc221d/original/square/25.png",
  },
]

export default function UpcomingMatches() {
  const mobileRow1Ref = useRef<HTMLDivElement>(null)
  const mobileRow2Ref = useRef<HTMLDivElement>(null)
  const desktopRow1Ref = useRef<HTMLDivElement>(null)
  const desktopRow2Ref = useRef<HTMLDivElement>(null)

  const tomorrow = getTomorrowDate()
  const row1Matches = row1BaseMatches(tomorrow)
  const row2Matches = row2BaseMatches(tomorrow)

  useEffect(() => {
    const allRows = [
      mobileRow1Ref.current,
      mobileRow2Ref.current,
      desktopRow1Ref.current,
      desktopRow2Ref.current,
    ].filter((row): row is HTMLDivElement => row !== null)

    let lastScrollPosition = 0
    const isUserScrolling = false
    const userScrollTimeout: NodeJS.Timeout | null = null

    // Calculate content width for infinite loop
    const getContentWidth = (row: HTMLDivElement) => {
      if (!row.children.length) return 0
      const cardWidth = 340
      const gap = 28
      const cardsPerSet = 10
      return (cardWidth + gap) * cardsPerSet
    }

    // Set initial positions
    allRows.forEach((row) => {
      const initialOffset = (340 + 28) * 5
      row.style.transform = `translateX(-${initialOffset}px)`
      row.style.transition = "transform 0.1s ease-out"
    })

    // Handle scroll-based animation with infinite loop
    const handleScroll = () => {
      if (isUserScrolling) return

      const scrollPosition = window.scrollY
      const scrollDelta = scrollPosition - lastScrollPosition

      if (Math.abs(scrollDelta) > 0) {
        allRows.forEach((row, index) => {
          const speed = index % 2 === 0 ? 0.8 : 0.6
          const rowWidth = getContentWidth(row)

          let currentTransform = Number.parseFloat(
            row.style.transform?.replace("translateX(", "").replace("px)", "") || "0",
          )

          // Apply movement based on scroll direction
          if (index % 2 === 0) {
            currentTransform = currentTransform + scrollDelta * speed
          } else {
            currentTransform = currentTransform - scrollDelta * speed
          }

          // Infinite loop - reset when reaching content width
          if (currentTransform >= 0) {
            currentTransform = -rowWidth
          } else if (currentTransform <= -rowWidth) {
            currentTransform = 0
          }

          row.style.transform = `translateX(${currentTransform}px)`
        })
      }

      lastScrollPosition = scrollPosition
    }

    // Throttled scroll handler for performance
    let ticking = false
    let lastTime = 0
    const fps = 60
    const interval = 1000 / fps

    const throttledScroll = () => {
      const now = Date.now()
      const elapsed = now - lastTime

      if (!ticking && elapsed > interval) {
        lastTime = now - (elapsed % interval)
        requestAnimationFrame(() => {
          handleScroll()
          ticking = false
        })
        ticking = true
      }
    }

    window.addEventListener("scroll", throttledScroll, { passive: true })

    // Reset positions on resize
    const handleResize = () => {
      const newInitialOffset = (340 + 28) * 5
      allRows.forEach((row) => {
        row.style.transform = `translateX(-${newInitialOffset}px)`
      })
    }

    window.addEventListener("resize", handleResize)

    return () => {
      window.removeEventListener("scroll", throttledScroll)
      window.removeEventListener("resize", handleResize)
      if (userScrollTimeout) clearTimeout(userScrollTimeout)
    }
  }, [])

  return (
    <section className="matches-section">
      <div className="gradient-accent accent-1"></div>
      <div className="gradient-accent accent-2"></div>

      <div className="section-header">
        <h2 id="section-title">
          Upcoming
          {/* <i className="ri-live-line"></i> */}
        </h2>
        <p className="section-subtitle">Don&apos;t miss out exciting matches happening in Future!</p>

        <div className="header-buttons">
          <Link href="/sports">
            <button className="select-sports-btn">
              <i className="fas fa-list"></i> Select Sports
            </button>
          </Link>
          <button
            onClick={() =>
              alert("You can check all upcoming matches directly on the match page after selecting a sport. Thanks!")
            }
            className="all-upcoming-btn"
          >
            <i className="fas fa-calendar"></i> All Upcoming
          </button>
        </div>
      </div>

      {/* Mobile Scrolling Layout */}
      <div className="mobile-scrolling-container">
        <div className="mobile-scrolling-row" id="mobile-scrolling-row-1" ref={mobileRow1Ref}>
          {row1Matches.map((match) => (
            <MatchCard key={match.id} match={match} />
          ))}
        </div>
      </div>

      <div className="mobile-scrolling-container">
        <div className="mobile-scrolling-row" id="mobile-scrolling-row-2" ref={mobileRow2Ref}>
          {row2Matches.map((match) => (
            <MatchCard key={match.id} match={match} />
          ))}
        </div>
      </div>

      {/* Desktop Scrolling Layout - Triplicate for infinite effect */}
      <div className="desktop-scrolling-container">
        <div
          className="desktop-scrolling-row desktop-scrolling-row-1"
          id="desktop-scrolling-row-1"
          ref={desktopRow1Ref}
        >
          {[...row1Matches, ...row1Matches, ...row1Matches].map((match, idx) => (
            <MatchCard key={`${match.id}-${idx}`} match={match} />
          ))}
        </div>
        <div
          className="desktop-scrolling-row desktop-scrolling-row-2"
          id="desktop-scrolling-row-2"
          ref={desktopRow2Ref}
        >
          {[...row2Matches, ...row2Matches, ...row2Matches].map((match, idx) => (
            <MatchCard key={`${match.id}-${idx}`} match={match} />
          ))}
        </div>
      </div>
    </section>
  )
}

function MatchCard({ match }: { match: any }) {
  return (
    <div className="match-card-u">
      <div className="match-header">
        <span className="upcoming-badge">UPCOMING</span>
      </div>

      <div className="teams-container-u">
        <div className="team-u">
          <div className="team-logo">
            <img src={match.logo1 || "/placeholder.svg"} alt={match.team1} style={{ width: "100px", height: "80px" }} />
          </div>
          <span className="team-name-u">{match.team1}</span>
        </div>

        <div className="match-info-u">
          <div className="match-time-u">{match.time}</div>
          <div className="match-date">{match.date}</div>
        </div>

        <div className="team-u">
          <div className="team-logo">
            <img src={match.logo2 || "/placeholder.svg"} alt={match.team2} style={{ width: "100px", height: "80px" }} />
          </div>
          <span className="team-name-u">{match.team2}</span>
        </div>
      </div>
    </div>
  )
}
