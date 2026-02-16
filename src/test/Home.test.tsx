import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { Home } from '../App'

// Mock de fetch
global.fetch = vi.fn()

describe('Home Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('debe renderizar el título correctamente', () => {
    render(
      <BrowserRouter>
        <Home />
      </BrowserRouter>
    )
    
    expect(screen.getByText('Meal Finder')).toBeInTheDocument()
  })

  it('debe renderizar el input de búsqueda', () => {
    render(
      <BrowserRouter>
        <Home />
      </BrowserRouter>
    )
    
    const input = screen.getByPlaceholderText('Search...')
    expect(input).toBeInTheDocument()
  })

  it('debe actualizar el valor del input al escribir', () => {
    render(
      <BrowserRouter>
        <Home />
      </BrowserRouter>
    )
    
    const input = screen.getByPlaceholderText('Search...') as HTMLInputElement
    fireEvent.change(input, { target: { value: 'chicken' } })
    
    expect(input.value).toBe('chicken')
  })

  it('debe mostrar las sugerencias de búsqueda', () => {
    render(
      <BrowserRouter>
        <Home />
      </BrowserRouter>
    )
    
    expect(screen.getByText(/puedes buscar/i)).toBeInTheDocument()
    expect(screen.getByText(/chicken/i)).toBeInTheDocument()
  })

  it('debe hacer fetch cuando se hace clic en buscar', async () => {
    const mockMeals = {
      meals: [
        {
          strMeal: 'Chicken Curry',
          strMealThumb: 'https://example.com/chicken.jpg',
          strInstructions: 'Cook the chicken...'
        }
      ]
    }

    ;(global.fetch as any).mockResolvedValueOnce({
      json: async () => mockMeals
    })

    render(
      <BrowserRouter>
        <Home />
      </BrowserRouter>
    )
    
    const input = screen.getByPlaceholderText('Search...')
    const searchBtn = screen.getByRole('button')
    
    fireEvent.change(input, { target: { value: 'chicken' } })
    fireEvent.click(searchBtn)

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        'https://www.themealdb.com/api/json/v1/1/search.php?s=chicken'
      )
    })
  })

  it('debe mostrar las comidas después de la búsqueda', async () => {
    const mockMeals = {
      meals: [
        {
          strMeal: 'Chicken Curry',
          strMealThumb: 'https://example.com/chicken.jpg',
          strInstructions: 'Cook the chicken...'
        },
        {
          strMeal: 'Chicken Soup',
          strMealThumb: 'https://example.com/soup.jpg',
          strInstructions: 'Make the soup...'
        }
      ]
    }

    ;(global.fetch as any).mockResolvedValueOnce({
      json: async () => mockMeals
    })

    render(
      <BrowserRouter>
        <Home />
      </BrowserRouter>
    )
    
    const input = screen.getByPlaceholderText('Search...')
    const searchBtn = screen.getByRole('button')
    
    fireEvent.change(input, { target: { value: 'chicken' } })
    fireEvent.click(searchBtn)

    await waitFor(() => {
      expect(screen.getByText('Chicken Curry')).toBeInTheDocument()
      expect(screen.getByText('Chicken Soup')).toBeInTheDocument()
    })
  })

  it('no debe hacer fetch si el input está vacío', async () => {
    render(
      <BrowserRouter>
        <Home />
      </BrowserRouter>
    )
    
    const searchBtn = screen.getByRole('button')
    fireEvent.click(searchBtn)

    expect(global.fetch).not.toHaveBeenCalled()
  })

  it('debe manejar errores en el fetch', async () => {
    const consoleLogSpy = vi.spyOn(console, 'log').mockImplementation(() => {})
    
    ;(global.fetch as any).mockRejectedValueOnce(new Error('Network error'))

    render(
      <BrowserRouter>
        <Home />
      </BrowserRouter>
    )
    
    const input = screen.getByPlaceholderText('Search...')
    const searchBtn = screen.getByRole('button')
    
    fireEvent.change(input, { target: { value: 'chicken' } })
    fireEvent.click(searchBtn)

    await waitFor(() => {
      expect(consoleLogSpy).toHaveBeenCalledWith('Error:', expect.any(Error))
    })

    consoleLogSpy.mockRestore()
  })
})