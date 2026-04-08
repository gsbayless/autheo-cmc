import './style.css'

// ========================================
// Autheo Premium Animations — Pure TypeScript
// ========================================

// --- Scroll-triggered fade-in + slide-up ---
function initScrollReveal(): void {
  const revealElements = document.querySelectorAll<HTMLElement>('[data-reveal]')

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const el = entry.target as HTMLElement
          // Add small stagger delay based on sibling index
          const parent = el.parentElement
          if (parent) {
            const siblings = Array.from(parent.querySelectorAll('[data-reveal]'))
            const index = siblings.indexOf(el)
            el.style.transitionDelay = `${index * 80}ms`
          }
          el.classList.add('revealed')
          observer.unobserve(el)
        }
      })
    },
    { threshold: 0.08, rootMargin: '0px 0px -30px 0px' }
  )

  revealElements.forEach((el) => observer.observe(el))
}

// --- Staggered reveal for card grids ---
function initStaggerReveal(): void {
  const staggerElements = document.querySelectorAll<HTMLElement>('[data-stagger]')

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const grid = entry.target.closest('[data-stagger-grid]')
          if (grid) {
            const items = grid.querySelectorAll<HTMLElement>('[data-stagger]')
            items.forEach((item, index) => {
              setTimeout(() => {
                item.classList.add('revealed')
              }, index * 60)
            })
            items.forEach((item) => observer.unobserve(item))
          } else {
            const el = entry.target as HTMLElement
            el.classList.add('revealed')
            observer.unobserve(el)
          }
        }
      })
    },
    { threshold: 0.1 }
  )

  staggerElements.forEach((el) => observer.observe(el))
}

// --- Parallax on background images ---
function initParallax(): void {
  const parallaxElements = document.querySelectorAll<HTMLElement>('.parallax-bg')

  function updateParallax(): void {
    const scrollY = window.scrollY

    parallaxElements.forEach((el) => {
      const speed = parseFloat(el.dataset.speed || '0.3')
      const parent = el.parentElement
      if (!parent) return

      const rect = parent.getBoundingClientRect()
      const parentTop = rect.top + scrollY
      const offset = (scrollY - parentTop) * speed

      el.style.transform = `translateY(${offset}px)`
    })
  }

  let ticking = false
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        updateParallax()
        ticking = false
      })
      ticking = true
    }
  }, { passive: true })

  // Initial call
  updateParallax()
}

// --- Stat number count-up animation ---
function initCountUp(): void {
  const countElements = document.querySelectorAll<HTMLElement>('[data-countup]')

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const el = entry.target as HTMLElement
          const target = parseInt(el.dataset.countup || '0', 10)
          const suffix = el.dataset.suffix || ''
          const display = el.dataset.display || ''

          if (display) {
            animateToDisplay(el, display)
          } else {
            animateCountUp(el, target, suffix)
          }

          observer.unobserve(el)
        }
      })
    },
    { threshold: 0.3 }
  )

  countElements.forEach((el) => observer.observe(el))
}

function animateCountUp(el: HTMLElement, target: number, suffix: string): void {
  const duration = 2000
  const startTime = performance.now()

  function formatNumber(n: number): string {
    return n.toLocaleString('en-US')
  }

  function easeOutExpo(t: number): number {
    return t === 1 ? 1 : 1 - Math.pow(2, -10 * t)
  }

  function step(currentTime: number): void {
    const elapsed = currentTime - startTime
    const progress = Math.min(elapsed / duration, 1)
    const easedProgress = easeOutExpo(progress)
    const currentValue = Math.round(easedProgress * target)

    el.textContent = formatNumber(currentValue) + suffix

    if (progress < 1) {
      requestAnimationFrame(step)
    }
  }

  requestAnimationFrame(step)
}

function animateToDisplay(el: HTMLElement, display: string): void {
  const duration = 2000
  const startTime = performance.now()

  function easeOutExpo(t: number): number {
    return t === 1 ? 1 : 1 - Math.pow(2, -10 * t)
  }

  function step(currentTime: number): void {
    const elapsed = currentTime - startTime
    const progress = Math.min(elapsed / duration, 1)
    const easedProgress = easeOutExpo(progress)

    if (progress < 0.85) {
      const val = Math.round(easedProgress * 1000000)
      if (val >= 1000000) {
        el.textContent = '1M+'
      } else if (val >= 1000) {
        el.textContent = Math.round(val / 1000) + 'K+'
      } else {
        el.textContent = val.toLocaleString('en-US')
      }
      requestAnimationFrame(step)
    } else {
      el.textContent = display
    }
  }

  requestAnimationFrame(step)
}

// --- Smooth scroll for anchor links ---
function initSmoothScroll(): void {
  document.querySelectorAll<HTMLAnchorElement>('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e: Event) => {
      e.preventDefault()
      const href = (anchor as HTMLAnchorElement).getAttribute('href') || ''
      const target = document.querySelector(href)
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    })
  })
}

// --- Initialize all ---
document.addEventListener('DOMContentLoaded', () => {
  initScrollReveal()
  initStaggerReveal()
  initParallax()
  initCountUp()
  initSmoothScroll()
})
