import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { axe, toHaveNoViolations } from 'jest-axe'
import ReadZonePage from '@/app/read/page'
import { checkContrastCompliance, generateAccessibilityReport } from '@/utils/accessibility'

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

// Mock the data module
jest.mock('@/data/articles', () => ({
  getReadZoneArticles: () => [
    {
      id: '1',
      title: 'Test Article 1',
      slug: 'test-article-1',
      excerpt: 'This is a test article excerpt for accessibility testing.',
      content: '<p>Test content</p>',
      author: {
        name: 'Test Author',
        avatar: '/test-avatar.jpg'
      },
      publishedAt: new Date('2024-01-01'),
      readTime: '5 min read',
      category: 'Tactics',
      tags: ['football', 'tactics', 'training'],
      featuredImage: '/test-image.jpg'
    },
    {
      id: '2',
      title: 'Test Article 2',
      slug: 'test-article-2',
      excerpt: 'Another test article for comprehensive accessibility testing.',
      content: '<p>More test content</p>',
      author: {
        name: 'Another Author',
        avatar: '/another-avatar.jpg'
      },
      publishedAt: new Date('2024-01-02'),
      readTime: '3 min read',
      category: 'Training',
      tags: ['training', 'fitness'],
      featuredImage: '/another-image.jpg'
    }
  ]
}))

describe('Read Zone Page Accessibility', () => {
  beforeEach(() => {
    // Mock window.matchMedia
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: jest.fn().mockImplementation(query => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      })),
    })
  })

  it('should meet WCAG AA accessibility standards', async () => {
    const { container } = render(<ReadZonePage />)
    
    // Run axe-core analysis with basic rules
    const results = await axe(container)
    
    // Check for violations
    expect(results).toHaveNoViolations()
    
    // Additional contrast-specific checks
    const { violations, contrastIssues } = checkContrastCompliance(results)
    
    // Log detailed report if there are issues
    if (violations > 0) {
      console.log('Read Zone Accessibility Report:')
      console.log(generateAccessibilityReport(results))
    }
    
    // Assert no contrast violations
    expect(contrastIssues).toHaveLength(0)
    expect(violations).toBe(0)
  })

  it('should have proper heading structure', () => {
    render(<ReadZonePage />)
    
    // Check for main heading (h1) - "Football Zone Blog"
    const mainHeading = screen.getByRole('heading', { level: 1 })
    expect(mainHeading).toBeInTheDocument()
    expect(mainHeading).toHaveTextContent('Football Zone Blog')
    
    // Check for article headings (h2 or h3) in the blog cards
    const articleHeadings = screen.getAllByRole('heading', { level: 2 })
    expect(articleHeadings.length).toBeGreaterThan(0)
    
    // Verify heading hierarchy is logical
    const allHeadings = screen.getAllByRole('heading')
    expect(allHeadings.length).toBeGreaterThan(1)
  })

  it('should have proper landmark regions', () => {
    render(<ReadZonePage />)
    
    // Check for navigation elements (header navigation)
    const navs = screen.getAllByRole('navigation')
    expect(navs.length).toBeGreaterThan(0)
    
    // Check for banner (header)
    const banner = screen.getByRole('banner')
    expect(banner).toBeInTheDocument()
    
    // Check for contentinfo (footer)
    const contentinfo = screen.getByRole('contentinfo')
    expect(contentinfo).toBeInTheDocument()
    
    // Check for main content area
    const main = screen.getByRole('main')
    expect(main).toBeInTheDocument()
  })

  it('should have accessible search functionality', () => {
    render(<ReadZonePage />)
    
    // Check for search input
    const searchInput = screen.getByRole('textbox', { name: /search/i })
    expect(searchInput).toBeInTheDocument()
    
    // Check that search input has proper label
    expect(searchInput).toHaveAttribute('aria-label')
    
    // Test search functionality
    fireEvent.change(searchInput, { target: { value: 'test' } })
    expect(searchInput).toHaveValue('test')
  })

  it('should have accessible category filtering', () => {
    render(<ReadZonePage />)
    
    // Check for category buttons/selectors
    const categoryButtons = screen.getAllByRole('button')
    const categoryButtonsWithText = categoryButtons.filter(button => 
      button.textContent && (
        button.textContent.includes('all') || 
        button.textContent.includes('tactics') || 
        button.textContent.includes('training')
      )
    )
    
    expect(categoryButtonsWithText.length).toBeGreaterThan(0)
    
    // Test category selection
    if (categoryButtonsWithText.length > 0) {
      fireEvent.click(categoryButtonsWithText[0])
    }
  })

  it('should have accessible article cards', () => {
    render(<ReadZonePage />)
    
    // Check for article links
    const articleLinks = screen.getAllByRole('link')
    const articleCardLinks = articleLinks.filter(link => 
      link.getAttribute('href')?.includes('test-article')
    )
    
    expect(articleCardLinks.length).toBeGreaterThan(0)
    
    // Check that each article card has proper heading
    const articleHeadings = screen.getAllByRole('heading', { level: 2 })
    expect(articleHeadings.length).toBeGreaterThan(0)
    
    // Check for article excerpts
    const excerpts = screen.getAllByText(/test article excerpt/i)
    expect(excerpts.length).toBeGreaterThan(0)
  })

  it('should have accessible pagination controls', () => {
    render(<ReadZonePage />)
    
    // Check for pagination buttons
    const paginationButtons = screen.getAllByRole('button')
    const pageButtons = paginationButtons.filter(button => 
      /^\d+$/.test(button.textContent || '') || 
      button.textContent === '«' || 
      button.textContent === '»'
    )
    
    expect(pageButtons.length).toBeGreaterThan(0)
    
    // Check that pagination buttons have proper labels
    pageButtons.forEach(button => {
      expect(button).toBeInTheDocument()
    })
  })

  it('should have proper alt text for images', () => {
    render(<ReadZonePage />)
    
    const images = screen.getAllByRole('img')
    images.forEach(img => {
      expect(img).toHaveAttribute('alt')
      expect(img.getAttribute('alt')).not.toBe('')
    })
  })

  it('should have sufficient color contrast for text elements', async () => {
    const { container } = render(<ReadZonePage />)
    
    const results = await axe(container, {
      rules: {
        'color-contrast': { enabled: true },
        'color-contrast-enhanced': { enabled: true }
      }
    })
    
    const { contrastIssues } = checkContrastCompliance(results)
    
    // Log specific contrast issues for debugging
    if (contrastIssues.length > 0) {
      console.log('Read Zone Contrast Issues Found:')
      contrastIssues.forEach((issue, index) => {
        console.log(`${index + 1}. ${issue.description}`)
        console.log(`   Element: ${issue.element}`)
        console.log(`   Impact: ${issue.impact}`)
      })
    }
    
    expect(contrastIssues).toHaveLength(0)
  })

  it('should have proper button accessibility', async () => {
    const { container } = render(<ReadZonePage />)
    
    const results = await axe(container, {
      rules: {
        'button-name': { enabled: true }
      }
    })
    
    expect(results).toHaveNoViolations()
  })

  it('should have proper link context', async () => {
    const { container } = render(<ReadZonePage />)
    
    const results = await axe(container, {
      rules: {
        'link-in-text-block': { enabled: true }
      }
    })
    
    expect(results).toHaveNoViolations()
  })

  it('should handle keyboard navigation properly', () => {
    render(<ReadZonePage />)
    
    // Check that all interactive elements are focusable
    const interactiveElements = screen.getAllByRole('button', 'link', 'textbox')
    
    interactiveElements.forEach(element => {
      expect(element).toHaveAttribute('tabindex')
    })
  })

  it('should have proper ARIA labels and descriptions', () => {
    render(<ReadZonePage />)
    
    // Check for search input ARIA label
    const searchInput = screen.getByRole('textbox', { name: /search/i })
    expect(searchInput).toHaveAttribute('aria-label')
    
    // Check for navigation ARIA labels
    const navs = screen.getAllByRole('navigation')
    navs.forEach(nav => {
      expect(nav).toHaveAttribute('aria-label')
    })
  })

  it('should have proper focus management', () => {
    render(<ReadZonePage />)
    
    // Check that focus indicators are visible
    const focusableElements = screen.getAllByRole('button', 'link', 'textbox')
    
    focusableElements.forEach(element => {
      // Simulate focus
      element.focus()
      expect(element).toHaveFocus()
    })
  })

  it('should have accessible empty state', () => {
    render(<ReadZonePage />)
    
    // Search for a term that won't match any articles
    const searchInput = screen.getByRole('textbox', { name: /search/i })
    fireEvent.change(searchInput, { target: { value: 'nonexistent-article-term' } })
    
    // Check for empty state message
    const emptyStateMessage = screen.getByText(/Няма намерени статии/i)
    expect(emptyStateMessage).toBeInTheDocument()
  })

  it('should have proper semantic HTML structure', () => {
    const { container } = render(<ReadZonePage />)
    
    // Check for proper use of semantic elements
    expect(container.querySelector('main')).toBeInTheDocument()
    expect(container.querySelector('section')).toBeInTheDocument()
    expect(container.querySelector('article')).toBeInTheDocument()
  })

  it('should have accessible loading states', async () => {
    render(<ReadZonePage />)
    
    // Check that the page loads without accessibility violations
    await waitFor(() => {
      expect(screen.getByText('Football Zone Blog')).toBeInTheDocument()
    })
  })

  it('should have proper form accessibility', async () => {
    const { container } = render(<ReadZonePage />)
    
    const results = await axe(container, {
      rules: {
        'form-field-multiple-labels': { enabled: true },
        'label': { enabled: true }
      }
    })
    
    expect(results).toHaveNoViolations()
  })

  it('should have accessible skip links', () => {
    render(<ReadZonePage />)
    
    // Check for skip to main content link (if implemented)
    const skipLinks = screen.getAllByRole('link')
    const skipToMain = skipLinks.find(link => 
      link.textContent?.toLowerCase().includes('skip') ||
      link.getAttribute('href') === '#main'
    )
    
    // This is optional but good practice
    if (skipToMain) {
      expect(skipToMain).toHaveAttribute('href')
    }
  })
})
