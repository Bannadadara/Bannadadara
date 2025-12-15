import { useState } from 'react'
import products from './data/products'

import Header from './components/Header'
import Footer from './components/Footer'
import CartSidebar from './components/CartSidebar'
import ProductModal from './components/ProductModal'

import Home from './pages/Home'
import Shop from './pages/Shop'
import About from './pages/About'
import Contact from './pages/Contact'

export default function App() {
  const [page, setPage] = useState('home')
  const [cart, setCart] = useState([])
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [showCart, setShowCart] = useState(false)

  return (
    <>
      <Header setPage={setPage} setShowCart={setShowCart} />
      {page === 'home' && <Home setPage={setPage} />}
      {page === 'shop' && (
        <Shop products={products} setSelectedProduct={setSelectedProduct} />
      )}
      {page === 'about' && <About />}
      {page === 'contact' && <Contact />}
      <CartSidebar cart={cart} setCart={setCart} showCart={showCart} />
      <ProductModal product={selectedProduct} setSelectedProduct={setSelectedProduct} />
      <Footer />
    </>
  )
}
