function calculateLuminance(color: string): number {
  // Converte a cor HEX para RGB
  const rgb = parseInt(color.replace('#', ''), 16)
  const r = (rgb >> 16) & 0xff
  const g = (rgb >>  8) & 0xff
  const b = (rgb >>  0) & 0xff
  
  // Calcula a luminância relativa
  const a = [r, g, b].map((x) => {
    x /= 255
    return x <= 0.03928 ? x / 12.92 : Math.pow((x + 0.055) / 1.055, 2.4)
  })
    
  return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722
}
  
export function getTextColorBasedOnContrast(backgroundColor: string): string {
  const luminance = calculateLuminance(backgroundColor)
  const textColor = luminance > 0.5 ? '#000000' : '#FFFFFF'
  return textColor
}