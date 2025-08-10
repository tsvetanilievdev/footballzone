import { AxeResults, Spec } from 'axe-core'

// Accessibility test configuration
export const accessibilityConfig: Spec = {
  rules: {
    'color-contrast': { enabled: true },
    'color-contrast-enhanced': { enabled: true },
    'link-in-text-block': { enabled: true },
    'button-name': { enabled: true },
    'heading-order': { enabled: true },
    'landmark-one-main': { enabled: true },
    'page-has-heading-one': { enabled: true },
    'region': { enabled: true },
  },
}

// Helper function to check if contrast meets WCAG AA standards
export const checkContrastCompliance = (results: AxeResults): {
  passes: number
  violations: number
  contrastIssues: Array<{
    description: string
    element: string
    impact: string
    help: string
  }>
} => {
  const contrastIssues = results.violations
    .filter(violation => 
      violation.id === 'color-contrast' || 
      violation.id === 'color-contrast-enhanced'
    )
    .flatMap(violation => 
      violation.nodes.map(node => ({
        description: violation.description,
        element: node.html,
        impact: violation.impact || 'unknown',
        help: violation.help,
      }))
    )

  return {
    passes: results.passes.length,
    violations: results.violations.length,
    contrastIssues,
  }
}

// Helper function to generate accessibility report
export const generateAccessibilityReport = (results: AxeResults): string => {
  const { passes, violations, contrastIssues } = checkContrastCompliance(results)
  
  let report = `# Accessibility Test Report\n\n`
  report += `## Summary\n`
  report += `- ✅ Passes: ${passes}\n`
  report += `- ❌ Violations: ${violations}\n`
  report += `- 🎨 Contrast Issues: ${contrastIssues.length}\n\n`

  if (contrastIssues.length > 0) {
    report += `## Contrast Issues (WCAG AA/AAA)\n\n`
    contrastIssues.forEach((issue, index) => {
      report += `### Issue ${index + 1}\n`
      report += `- **Element**: \`${issue.element}\`\n`
      report += `- **Description**: ${issue.description}\n`
      report += `- **Impact**: ${issue.impact}\n`
      report += `- **Help**: ${issue.help}\n\n`
    })
  }

  if (results.violations.length > 0) {
    report += `## All Violations\n\n`
    results.violations.forEach((violation, index) => {
      report += `### ${violation.id} (${violation.impact})\n`
      report += `- **Description**: ${violation.description}\n`
      report += `- **Help**: ${violation.help}\n`
      report += `- **Affected Elements**: ${violation.nodes.length}\n\n`
    })
  }

  return report
}

// Color contrast calculation utility
export const calculateContrastRatio = (color1: string, color2: string): number => {
  // Convert hex to RGB
  const hexToRgb = (hex: string): [number, number, number] => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
    return result ? [
      parseInt(result[1], 16),
      parseInt(result[2], 16),
      parseInt(result[3], 16)
    ] : [0, 0, 0]
  }

  // Calculate relative luminance
  const getLuminance = (r: number, g: number, b: number): number => {
    const [rs, gs, bs] = [r, g, b].map(c => {
      c = c / 255
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
    })
    return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs
  }

  const [r1, g1, b1] = hexToRgb(color1)
  const [r2, g2, b2] = hexToRgb(color2)
  
  const lum1 = getLuminance(r1, g1, b1)
  const lum2 = getLuminance(r2, g2, b2)
  
  const brightest = Math.max(lum1, lum2)
  const darkest = Math.min(lum1, lum2)
  
  return (brightest + 0.05) / (darkest + 0.05)
}

// Common color combinations for testing
export const commonColorPairs = [
  { foreground: '#ffffff', background: '#000000', expected: 21 }, // Perfect contrast
  { foreground: '#ffffff', background: '#1f2937', expected: 15.3 }, // Good contrast
  { foreground: '#ffffff', background: '#374151', expected: 12.6 }, // Good contrast
  { foreground: '#000000', background: '#f3f4f6', expected: 15.3 }, // Good contrast
  { foreground: '#1f2937', background: '#ffffff', expected: 15.3 }, // Good contrast
  { foreground: '#6b7280', background: '#ffffff', expected: 4.5 }, // Minimum AA
  { foreground: '#9ca3af', background: '#ffffff', expected: 2.8 }, // Below AA
]
