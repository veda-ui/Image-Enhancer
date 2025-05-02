import './global.css'
import Header from './components/Header'

export const metadata = {
  title: 'Image Enhancer',
  description: 'Enhance your images with our AI-powered tool',
  
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
    
      <body>
        <Header />
        {children}
      </body>
    </html>
  )
}
