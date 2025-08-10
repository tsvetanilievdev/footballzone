import React from 'react'
import { render, screen } from '@testing-library/react'
import { axe, toHaveNoViolations } from 'jest-axe'
import HomePage from '@/app/page'
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

describe('HomePage Accessibility', () => {
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
    const { container } = render(<HomePage />)
    
    // Run axe-core analysis with basic rules
    const results = await axe(container)
    
    // Check for violations
    expect(results).toHaveNoViolations()
    
    // Additional contrast-specific checks
    const { violations, contrastIssues } = checkContrastCompliance(results)
    
    // Log detailed report if there are issues
    if (violations > 0) {
      console.log('Accessibility Report:')
      console.log(generateAccessibilityReport(results))
    }
    
    // Assert no contrast violations
    expect(contrastIssues).toHaveLength(0)
    expect(violations).toBe(0)
  })

  it('should have proper heading structure', () => {
    render(<HomePage />)
    
    // Check for main heading (h1)
    const mainHeading = screen.getByRole('heading', { level: 1 })
    expect(mainHeading).toBeInTheDocument()
    
    // Check for h2 headings
    const h2Headings = screen.getAllByRole('heading', { level: 2 })
    expect(h2Headings.length).toBeGreaterThan(0)
    
    // Check for h3 headings
    const h3Headings = screen.getAllByRole('heading', { level: 3 })
    expect(h3Headings.length).toBeGreaterThan(0)
  })

  it('should have proper landmark regions', () => {
    render(<HomePage />)
    
    // Check for navigation elements (there are multiple)
    const navs = screen.getAllByRole('navigation')
    expect(navs.length).toBeGreaterThan(0)
    
    // Check for banner (header)
    const banner = screen.getByRole('banner')
    expect(banner).toBeInTheDocument()
    
    // Check for contentinfo (footer)
    const contentinfo = screen.getByRole('contentinfo')
    expect(contentinfo).toBeInTheDocument()
  })

  it('should have accessible links and buttons', () => {
    render(<HomePage />)
    
    // Check for accessible links
    const links = screen.getAllByRole('link')
    links.forEach(link => {
      expect(link).toHaveAttribute('href')
    })
    
    // Check for accessible buttons
    const buttons = screen.getAllByRole('button')
    buttons.forEach(button => {
      expect(button).toBeInTheDocument()
    })
  })

  it('should have proper alt text for images', () => {
    render(<HomePage />)
    
    const images = screen.getAllByRole('img')
    images.forEach(img => {
      expect(img).toHaveAttribute('alt')
    })
  })

  it('should have sufficient color contrast for text elements', async () => {
    const { container } = render(<HomePage />)
    
    const results = await axe(container, {
      rules: {
        'color-contrast': { enabled: true },
        'color-contrast-enhanced': { enabled: true }
      }
    })
    
    const { contrastIssues } = checkContrastCompliance(results)
    
    // Log specific contrast issues for debugging
    if (contrastIssues.length > 0) {
      console.log('Contrast Issues Found:')
      contrastIssues.forEach((issue, index) => {
        console.log(`${index + 1}. ${issue.description}`)
        console.log(`   Element: ${issue.element}`)
        console.log(`   Impact: ${issue.impact}`)
      })
    }
    
    expect(contrastIssues).toHaveLength(0)
  })

  it('should have proper button accessibility', async () => {
    const { container } = render(<HomePage />)
    
    const results = await axe(container, {
      rules: {
        'button-name': { enabled: true }
      }
    })
    
    expect(results).toHaveNoViolations()
  })

  it('should have proper link context', async () => {
    const { container } = render(<HomePage />)
    
    const results = await axe(container, {
      rules: {
        'link-in-text-block': { enabled: true }
      }
    })
    
    expect(results).toHaveNoViolations()
  })
})
