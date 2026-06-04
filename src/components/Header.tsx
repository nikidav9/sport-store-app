'use client'

import Link from 'next/link'

export default function Header() {
  return (
    <header className="bg-blue-600 text-white p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold">
          СпортМагазин
        </Link>
        <nav>
          <ul className="flex space-x-4">
            <li>
              <Link href="/products" className="hover:underline">
                Товары
              </Link>
            </li>
            <li>
              <Link href="/cart" className="hover:underline">
                Корзина
              </Link>
            </li>
            <li>
              <Link href="/account" className="hover:underline">
                Аккаунт
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  )
}
