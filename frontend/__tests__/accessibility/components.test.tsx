import React from 'react'
import { render, screen } from '@testing-library/react'
import { axe, toHaveNoViolations } from 'jest-axe'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import HeroSlider from '@/components/ui/HeroSlider'
import ArticleCard from '@/components/ui/ArticleCard'
import ZoneCard from '@/components/zones/ZoneCard'
import { checkContrastCompliance } from '@/utils/accessibility'

// Extend Jest matchers
expect.extend(toHaveNoViolations)

// Mock Next.js components
jest.mock('next/link', () => {
  return ({ children, href, ...props }: any) => {
    return <a href={href} {...props}>{children}</a>
  }
})

jest.mock('next/image', () => {
  return ({ src, alt, ...props }: any) => {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={src} alt={alt} {...props} />
  }
})

describe('Header Component Accessibility', () => {
  it('should meet accessibility standards', async () => {
    const { container } = render(<Header />)
    
    const results = await axe(container)
    expect(results).toHaveNoViolations()
    
    // Check for navigation landmark
    const nav = screen.getByRole('navigation')
    expect(nav).toBeInTheDocument()
    
    // Check for accessible links
    const links = screen.getAllByRole('link')
    links.forEach(link => {
      expect(link).toHaveAttribute('href')
    })
  })

  it('should have proper contrast for navigation elements', async () => {
    const { container } = render(<Header />)
    
    const results = await axe(container, {
      rules: {
        'color-contrast': { enabled: true }
      }
    })
    
    const { contrastIssues } = checkContrastCompliance(results)
    expect(contrastIssues).toHaveLength(0)
  })
})

describe('Footer Component Accessibility', () => {
  it('should meet accessibility standards', async () => {
    const { container } = render(<Footer />)
    
    const results = await axe(container)
    expect(results).toHaveNoViolations()
    
    // Check for contentinfo landmark
    const footer = screen.getByRole('contentinfo')
    expect(footer).toBeInTheDocument()
    
    // Check for accessible links
    const links = screen.getAllByRole('link')
    links.forEach(link => {
      expect(link).toHaveAttribute('href')
    })
  })

  it('should have proper contrast for footer text', async () => {
    const { container } = render(<Footer />)
    
    const results = await axe(container, {
      rules: {
        'color-contrast': { enabled: true }
      }
    })
    
    const { contrastIssues } = checkContrastCompliance(results)
    expect(contrastIssues).toHaveLength(0)
  })
})

describe('HeroSlider Component Accessibility', () => {
  it('should meet accessibility standards', async () => {
    const { container } = render(<HeroSlider />)
    
    const results = await axe(container)
    expect(results).toHaveNoViolations()
    
    // Check for proper heading structure
    const headings = screen.getAllByRole('heading')
    expect(headings.length).toBeGreaterThan(0)
    
    // Check for accessible buttons
    const buttons = screen.getAllByRole('button')
    buttons.forEach(button => {
      expect(button).toBeInTheDocument()
    })
  })

  it('should have proper contrast for text over images', async () => {
    const { container } = render(<HeroSlider />)
    
    const results = await axe(container, {
      rules: {
        'color-contrast': { enabled: true },
        'color-contrast-enhanced': { enabled: true }
      }
    })
    
    const { contrastIssues } = checkContrastCompliance(results)
    expect(contrastIssues).toHaveLength(0)
  })
})

describe('ArticleCard Component Accessibility', () => {
  const mockArticle = {
    id: '1',
    title: 'Test Article Title',
    excerpt: 'This is a test article excerpt that should be long enough to test readability.',
    author: {
      name: 'Test Author',
      avatar: '/test-avatar.jpg'
    },
    publishedAt: '2024-01-01',
    readTime: '5 min read',
    category: 'Test Category',
    slug: 'test-article',
    tags: ['football', 'training', 'tactics']
  }

  it('should meet accessibility standards', async () => {
    const { container } = render(<ArticleCard article={mockArticle} />)
    
    const results = await axe(container)
    expect(results).toHaveNoViolations()
    
    // Check for proper heading
    const heading = screen.getByRole('heading')
    expect(heading).toBeInTheDocument()
    expect(heading).toHaveTextContent(mockArticle.title)
    
    // Check for accessible link
    const link = screen.getByRole('link')
    expect(link).toHaveAttribute('href')
  })

  it('should have proper contrast for text over background image', async () => {
    const { container } = render(<ArticleCard article={mockArticle} />)
    
    const results = await axe(container, {
      rules: {
        'color-contrast': { enabled: true }
      }
    })
    
    const { contrastIssues } = checkContrastCompliance(results)
    expect(contrastIssues).toHaveLength(0)
  })
})

describe('ZoneCard Component Accessibility', () => {
  const mockZone = {
    id: 'test-zone',
    name: 'Test Zone',
    description: 'This is a test zone description.',
    icon: '⚽',
    color: 'bg-blue-500',
    isPremium: false,
    articleCount: 10,
    videoCount: 5
  }

  it('should meet accessibility standards', async () => {
    const { container } = render(<ZoneCard zone={mockZone} />)
    
    const results = await axe(container)
    expect(results).toHaveNoViolations()
    
    // Check for proper heading
    const heading = screen.getByRole('heading')
    expect(heading).toBeInTheDocument()
    expect(heading).toHaveTextContent(mockZone.name)
    
    // Check for accessible link
    const link = screen.getByRole('link')
    expect(link).toHaveAttribute('href')
  })

  it('should have proper contrast for text elements', async () => {
    const { container } = render(<ZoneCard zone={mockZone} />)
    
    const results = await axe(container, {
      rules: {
        'color-contrast': { enabled: true }
      }
    })
    
    const { contrastIssues } = checkContrastCompliance(results)
    expect(contrastIssues).toHaveLength(0)
  })
})
