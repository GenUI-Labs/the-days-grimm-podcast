// Printful API Service - Updated to use backend proxy
// Environment variables should be set in .env file
// VITE_PRINTFUL_API_KEY=your_api_key_here

// Backend API base URL
const BACKEND_API_URL = 'http://localhost:5000/api'

interface PrintfulProduct {
  id: number
  name: string
  description: string
  retail_price: string
  image: string
  variants: PrintfulVariant[]
}

interface PrintfulVariant {
  id: number
  name: string
  retail_price: string
  color?: string
  size?: string
}

class PrintfulService {
  private async makeRequest(endpoint: string, options: RequestInit = {}) {
    const url = `${BACKEND_API_URL}${endpoint}`
    
    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || `API error: ${response.status} ${response.statusText}`)
      }

      return response.json()
    } catch (error) {
      console.error('Printful service error:', error)
      throw error
    }
  }

  async getProducts(): Promise<PrintfulProduct[]> {
    try {
      const response = await this.makeRequest('/printful/products')
      return response.result || []
    } catch (error) {
      console.error('Error fetching Printful products:', error)
      // Return empty array instead of throwing to allow fallback to mock data
      return []
    }
  }

  async getProduct(productId: number): Promise<PrintfulProduct | null> {
    try {
      const response = await this.makeRequest(`/printful/products/${productId}`)
      return response.result || null
    } catch (error) {
      console.error('Error fetching Printful product:', error)
      return null
    }
  }

  async createProduct(productData: any): Promise<any> {
    try {
      const response = await this.makeRequest('/printful/products', {
        method: 'POST',
        body: JSON.stringify(productData),
      })
      return response.result
    } catch (error) {
      console.error('Error creating Printful product:', error)
      throw error
    }
  }

  async updateProduct(productId: number, productData: any): Promise<any> {
    try {
      const response = await this.makeRequest(`/printful/products/${productId}`, {
        method: 'PUT',
        body: JSON.stringify(productData),
      })
      return response.result
    } catch (error) {
      console.error('Error updating Printful product:', error)
      throw error
    }
  }

  async deleteProduct(productId: number): Promise<boolean> {
    try {
      await this.makeRequest(`/printful/products/${productId}`, {
        method: 'DELETE',
      })
      return true
    } catch (error) {
      console.error('Error deleting Printful product:', error)
      return false
    }
  }

  // Helper method to sync products from Printful catalog
  async syncCatalogProduct(catalogProductId: number, productData: any): Promise<any> {
    try {
      const response = await this.makeRequest('/printful/products', {
        method: 'POST',
        body: JSON.stringify({
          sync_product: {
            name: productData.name,
            thumbnail: productData.thumbnail,
            variants: productData.variants,
          },
          sync_variants: productData.sync_variants,
        }),
      })
      return response.result
    } catch (error) {
      console.error('Error syncing catalog product:', error)
      throw error
    }
  }

  // Check if backend is available
  async isBackendAvailable(): Promise<boolean> {
    try {
      const response = await fetch(`${BACKEND_API_URL}/health`)
      return response.ok
    } catch (error) {
      console.error('Backend health check failed:', error)
      return false
    }
  }

  // Check if API key is configured (now handled by backend)
  isConfigured(): boolean {
    // The backend will handle the API key validation
    return true
  }

  // Test connection to backend
  async testConnection(): Promise<boolean> {
    try {
      const isBackendUp = await this.isBackendAvailable()
      if (!isBackendUp) {
        throw new Error('Backend server is not available. Please start the backend server.')
      }
      
      // Try to fetch products to test the full flow
      await this.getProducts()
      return true
    } catch (error) {
      console.error('Printful API connection test failed:', error)
      return false
    }
  }
}

export const printfulService = new PrintfulService()

// Example usage:
// const products = await printfulService.getProducts()
// const product = await printfulService.getProduct(123)
// const newProduct = await printfulService.createProduct(productData)
