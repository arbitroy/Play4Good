import Link from 'next/link'
import Navbar from '../components/Navbar'

export default function AuthLayout({
    children, // will be a page or nested layout
  }: {
    children: React.ReactNode
  }) {
    return (
      <section>
        {children}
      </section>
    )
  }