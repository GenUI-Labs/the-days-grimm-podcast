import { motion } from 'framer-motion'
import { ShoppingBag, Home as HomeIcon, Loader2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import Footer from '../components/Footer'

// COMMENTED OUT INTERFACES FOR COMING SOON MODE - Uncomment when ready for full ecommerce
/*
import { useState, useEffect } from 'react'
import { printfulService } from '../services/printful'

interface Product {
  id: string
  name: string
  description: string
  price: number
  image: string
  category: string
  variants: ProductVariant[]
}

interface ProductVariant {
  id: string
  name: string
  price: number
  color?: string
  size?: string
}
*/

// Placeholder helper was unused; remove to keep lints clean

const Shop: React.FC = () => {
  // Commented out for Coming Soon mode - uncomment when ready for full ecommerce
  // const [products, setProducts] = useState<Product[]>([])
  // const [loading, setLoading] = useState(true)
  // const [selectedCategory, setSelectedCategory] = useState<string>('all')
  // const [apiConfigured, setApiConfigured] = useState(false)
  // const [apiError, setApiError] = useState<string>('')
  // const [currentIndex, setCurrentIndex] = useState<number>(0)
  // const [showCheckoutModal, setShowCheckoutModal] = useState(false)
  // const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)

  // COMMENTED OUT FOR COMING SOON MODE - Uncomment when ready for full ecommerce
  /*
  const inferCategory = (name: string): string => {
    const normalized = (name || '').toLowerCase()
    if (/(hat|beanie|cap)/i.test(normalized)) return 'hats'
    if (/(hoodie|shirt|tee|t-shirt|sweatshirt)/i.test(normalized)) return 'shirts'
    return 'shirts'
  }

  // Mock products for now - will be replaced with Printful API
  const mockProducts: Product[] = [
    {
      id: '1',
      name: 'The Days Grimm T-Shirt',
      description: 'Premium cotton t-shirt featuring The Days Grimm logo',
      price: 29.99,
      image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMWExYTFhIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNiIgZmlsbD0iI2ZmZiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPlRERyBTaGlydDwvdGV4dD48L3N2Zz4=',
      category: 'shirts',
      variants: [
        { id: '1-s', name: 'Small', price: 29.99, size: 'S' },
        { id: '1-m', name: 'Medium', price: 29.99, size: 'M' },
        { id: '1-l', name: 'Large', price: 29.99, size: 'L' },
        { id: '1-xl', name: 'X-Large', price: 29.99, size: 'XL' }
      ]
    },
    {
      id: '2',
      name: 'The Days Grimm Hat',
      description: 'Embroidered baseball cap with The Days Grimm branding',
      price: 24.99,
      image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMWExYTFhIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNiIgZmlsbD0iI2ZmZiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPlRERyBIYXQ8L3RleHQ+PC9zdmc+',
      category: 'hats',
      variants: [
        { id: '2-one', name: 'One Size', price: 24.99, size: 'One Size' }
      ]
    },
    {
      id: '3',
      name: 'The Days Grimm Hoodie',
      description: 'Comfortable hoodie perfect for those dark days',
      price: 49.99,
      image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMWExYTFhIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNiIgZmlsbD0iI2ZmZiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPlRERyBIb29kaWU8L3RleHQ+PC9zdmc+',
      category: 'shirts',
      variants: [
        { id: '3-s', name: 'Small', price: 49.99, size: 'S' },
        { id: '3-m', name: 'Medium', price: 49.99, size: 'M' },
        { id: '3-l', name: 'Large', price: 49.99, size: 'L' },
        { id: '3-xl', name: 'X-Large', price: 49.99, size: 'XL' }
      ]
    }
  ]

  useEffect(() => {
    const initializeShop = async () => {
      try {
        // Check if Printful API is configured
        const configured = printfulService.isConfigured()
        setApiConfigured(configured)

        if (configured) {
          // Test connection to backend
          const canConnect = await printfulService.testConnection()
          
          if (canConnect) {
            // Try to fetch real products from Printful via backend
            const printfulProducts = await printfulService.getProducts()
            if (printfulProducts.length > 0) {
              // Convert Printful products to our format
              const convertedProducts = printfulProducts.map((product: any) => {
                // Handle different variants structures from Printful API
                let variants = []
                
                if (Array.isArray(product.variants)) {
                  // If variants is already an array, use it
                  variants = product.variants.map((variant: any) => ({
                    id: variant.id?.toString() || 'default',
                    name: variant.name || 'Default',
                    price: parseFloat(variant.retail_price || product.retail_price || '0'),
                    size: variant.size || 'One Size'
                  }))
                } else if (product.variants && typeof product.variants === 'number') {
                  // If variants is a count, create a default variant
                  variants = [{
                    id: 'default',
                    name: 'Default',
                    price: parseFloat(product.retail_price || '0'),
                    size: 'One Size'
                  }]
                } else {
                  // Fallback to default variant
                  variants = [{
                    id: 'default',
                    name: 'Default',
                    price: parseFloat(product.retail_price || '0'),
                    size: 'One Size'
                  }]
                }

                return {
                  id: product.id?.toString() || 'unknown',
                  name: product.name || 'Unknown Product',
                  description: product.description || 'The Days Grimm merchandise',
                  price: parseFloat(product.retail_price || '0'),
                  image: product.thumbnail_url || product.image || 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMWExYTFhIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNiIgZmlsbD0iI2ZmZiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPlRERyBQcm9kdWN0PC90ZXh0Pjwvc3ZnPg==',
                  category: inferCategory(product.name || ''),
                  variants: variants
                }
              })
              setProducts(convertedProducts)
            } else {
              setProducts(mockProducts)
            }
          } else {
            // Backend connection issue
            setApiError('Backend server is not available. Please start the backend server on port 5000.')
            setProducts(mockProducts)
          }
        } else {
          setProducts(mockProducts)
        }
      } catch (error) {
        console.error('Error initializing shop:', error)
        setApiError('Failed to connect to Printful API. Using mock data instead.')
        setProducts(mockProducts)
      } finally {
        setLoading(false)
      }
    }
    initializeShop()
  }, [])

  const filteredProducts = selectedCategory === 'all' 
    ? products 
    : products.filter(product => product.category === selectedCategory)

  // Reset index when filters or data change
  useEffect(() => {
    setCurrentIndex(0)
  }, [selectedCategory, products.length])

  // Auto-advance carousel index only if more than 3 filtered products
  useEffect(() => {
    if (!filteredProducts || filteredProducts.length <= 3) return
    const interval = setInterval(() => {
      // Valid positions are 0..(length-3)
      setCurrentIndex((prev) => (prev + 1) % (filteredProducts.length - 2))
    }, 6000) // Slower: 6 seconds instead of 4
    return () => clearInterval(interval)
  }, [filteredProducts])

  const categories = [
    { id: 'all', name: 'All Products' },
    { id: 'shirts', name: 'Shirts & Hoodies' },
    { id: 'hats', name: 'Hats' }
  ]

  const handleAddToCart = (product: Product) => {
    setSelectedProduct(product)
    setShowCheckoutModal(true)
  }
  */

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark via-dark to-dark-light text-text-primary">
      <div className="container py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8" />

        {/* Centered Home Icon Link */}
        <div className="mb-6 flex justify-center">
          <Link
            to="/"
            aria-label="Home"
            className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-dark-light text-text-secondary hover:text-primary hover:bg-dark-border transition-colors duration-300"
          >
            <HomeIcon size={22} />
          </Link>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl font-bold mb-4">
            The Days Grimm Shop
          </h1>
          <p className="text-xl text-text-secondary">
            Official merchandise for the darkest podcast around
          </p>
        </motion.div>

        {/* Coming Soon Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex items-center justify-center min-h-[60vh]"
        >
          <div className="text-center max-w-2xl mx-auto">
            <div className="mb-8">
              <ShoppingBag size={80} className="mx-auto text-primary mb-6" />
              <h2 className="text-4xl font-bold mb-4">Coming Soon</h2>
              <p className="text-xl text-text-secondary mb-6">
                We're working hard to bring you exclusive The Days Grimm merchandise. 
                Our shop will feature premium apparel and accessories for fans of the darkest stories.
              </p>
              <p className="text-lg text-text-muted mb-8">
                Stay tuned for quality hoodies, t-shirts, hats, and more - all designed to reflect 
                the essence of The Days Grimm podcast experience.
              </p>
              <div className="inline-flex items-center gap-2 text-primary">
                <Loader2 size={20} className="animate-spin" />
                <span>Launching Soon...</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* COMMENTED OUT - FULL ECOMMERCE IMPLEMENTATION */}
        {/*
        {/* API Configuration Notice */}
        {/*(!apiConfigured || apiError) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mb-8"
          >
            <div className="card p-6 max-w-2xl mx-auto bg-yellow-900/20 border-yellow-500/30">
              <div className="flex items-center gap-3 mb-3">
                <AlertCircle size={24} className="text-yellow-400" />
                <h3 className="text-lg font-semibold text-yellow-400">
                  {!apiConfigured ? 'Printful API Not Configured' : 'API Connection Issue'}
                </h3>
              </div>
              {!apiConfigured ? (
                <>
                  <p className="text-text-secondary mb-3">
                    To display real products, please set up your Printful API key in the .env file:
                  </p>
                  <code className="block bg-dark-light p-3 rounded text-sm text-yellow-300 mb-3">
                    VITE_PRINTFUL_API_KEY=your_api_key_here
                  </code>
                  <p className="text-text-secondary text-sm">
                    Get your API key from: <a href="https://www.printful.com/dashboard/api" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Printful Dashboard</a>
                  </p>
                </>
              ) : (
                <>
                  <p className="text-text-secondary mb-3">
                    {apiError}
                  </p>
                                     <p className="text-text-secondary text-sm">
                     <strong>Solution:</strong> Please start the backend server by running <code className="bg-dark-light px-2 py-1 rounded">npm run dev</code> in the <code className="bg-dark-light px-2 py-1 rounded">backend</code> directory.
                   </p>
                </>
              )}
            </div>
          </motion.div>
        )}

        {/* Category Filter */}
        {/*<motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex justify-center mb-12"
        >
          <div className="flex gap-4 bg-dark-light rounded-lg p-2">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-6 py-2 rounded-md transition-all duration-300 ${
                  selectedCategory === category.id
                    ? 'bg-primary text-white'
                    : 'text-text-secondary hover:text-primary'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Products Grid / Carousel */}
        {/*loading ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-center items-center py-20"
          >
            <div className="flex items-center gap-3">
              <Loader2 size={24} className="animate-spin text-primary" />
              <span className="text-text-secondary">Loading products...</span>
            </div>
          </motion.div>
        ) : (
          <>
            {/* Desktop: if >3 items, show horizontal slider; else static 3-col grid */}
            {/*filteredProducts.length > 3 ? (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="hidden lg:block"
              >
                <div className="overflow-hidden">
                  <div
                    className="flex transition-transform duration-500 ease-out"
                    style={{ transform: `translateX(-${currentIndex * (100 / 3)}%)` }}
                  >
                    {filteredProducts.map((product) => (
                      <div key={product.id} className="basis-1/3 shrink-0 px-2">
                        <div className="card overflow-hidden group h-full flex flex-col">
                          <div className="relative overflow-hidden">
                            <img
                              src={product.image}
                              alt={product.name}
                              className="w-full h-80 object-cover transition-transform duration-300 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                          </div>
                          <div className="p-6 flex flex-col flex-1">
                            <h3 className="text-xl font-bold mb-2">{product.name}</h3>
                            <p className="text-text-secondary mb-4">{product.description}</p>
                            <div className="flex items-center justify-between mb-4">
                              <span className="text-2xl font-bold text-primary">${product.price}</span>
                              <span className="text-sm text-text-muted">
                                {product.variants.length} variant{product.variants.length !== 1 ? 's' : ''}
                              </span>
                            </div>
                            <button 
                              onClick={() => handleAddToCart(product)}
                              className="mt-auto w-full btn btn-primary"
                            >
                              <ShoppingBag size={20} />
                              Add to Cart
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Slider Controls */}
                {/*<div className="mt-4 flex items-center justify-center gap-3">
                  <button
                    onClick={() => setCurrentIndex((prev) => (prev - 1 + (filteredProducts.length - 2)) % (filteredProducts.length - 2))}
                    className="px-4 py-2 rounded-md bg-dark-light text-text-secondary hover:text-primary hover:bg-dark-border transition-colors"
                  >
                    Prev
                  </button>
                  <div className="text-sm text-text-muted">
                    {currentIndex + 1} / {filteredProducts.length - 2}
                  </div>
                  <button
                    onClick={() => setCurrentIndex((prev) => (prev + 1) % (filteredProducts.length - 2))}
                    className="px-4 py-2 rounded-md bg-dark-light text-text-secondary hover:text-primary hover:bg-dark-border transition-colors"
                  >
                    Next
                  </button>
                </div>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="hidden lg:flex lg:justify-center gap-8"
              >
                {filteredProducts.map((product) => (
                  <div key={product.id} className="w-80 h-full">
                    <div className="card overflow-hidden group h-full flex flex-col">
                      <div className="relative overflow-hidden">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-80 object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      </div>
                      <div className="p-6 flex flex-col flex-1">
                        <h3 className="text-xl font-bold mb-2">{product.name}</h3>
                        <p className="text-text-secondary mb-4">{product.description}</p>
                        <div className="flex items-center justify-between mb-4">
                          <span className="text-2xl font-bold text-primary">${product.price}</span>
                          <span className="text-sm text-text-muted">
                            {product.variants.length} variant{product.variants.length !== 1 ? 's' : ''}
                          </span>
                        </div>
                        <button 
                          onClick={() => handleAddToCart(product)}
                          className="mt-auto w-full btn btn-primary"
                        >
                          <ShoppingBag size={20} />
                          Add to Cart
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </motion.div>
            )}

            {/* Mobile/Tablet: regular grid up to 2 columns */}
            {/*<motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:hidden"
            >
              {filteredProducts.map((product) => (
                <div key={product.id} className="w-full max-w-sm mx-auto h-full">
                  <div className="card overflow-hidden group h-full flex flex-col">
                    <div className="relative overflow-hidden">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-80 object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                    <div className="p-6 flex flex-col flex-1">
                      <h3 className="text-xl font-bold mb-2">{product.name}</h3>
                      <p className="text-text-secondary mb-4">{product.description}</p>
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-2xl font-bold text-primary">${product.price}</span>
                        <span className="text-sm text-text-muted">
                          {product.variants.length} variant{product.variants.length !== 1 ? 's' : ''}
                        </span>
                      </div>
                      <button 
                        onClick={() => handleAddToCart(product)}
                        className="mt-auto w-full btn btn-primary"
                      >
                        <ShoppingBag size={20} />
                        Add to Cart
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>
          </>
        )}

        {/* Coming Soon Notice */}
        {/*!apiConfigured && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="mt-16 text-center"
          >
            <div className="card p-8 max-w-2xl mx-auto">
              <h3 className="text-2xl font-bold mb-4">Printful Integration Ready</h3>
              <p className="text-text-secondary mb-4">
                The shop is ready for Printful integration. Once you add your API key, 
                real products will automatically load from your Printful store.
              </p>
              <p className="text-text-secondary">
                The products above are previews of what's coming!
              </p>
            </div>
          </motion.div>
        )}

        {/* Summary Section */}
        {/*<motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-20 text-center"
        >
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-6">Quality Merchandise for Dark Days</h2>
            <p className="text-xl text-text-secondary mb-4">
              Each piece in our collection is carefully crafted to reflect the essence of The Days Grimm. 
              From comfortable hoodies for those late-night listening sessions to stylish hats that showcase 
              your love for the darker side of storytelling.
            </p>
            <p className="text-lg text-text-muted">
              All products are printed on-demand with premium materials, ensuring quality and comfort 
              while supporting sustainable practices. Orders are processed and shipped through our 
              trusted fulfillment partners.
            </p>
          </div>
        </motion.div>
        */}
      </div>



      {/* Footer */}
      <Footer scrollToSection={() => {}} />
    </div>
  )
}

export default Shop
