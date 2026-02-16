import { FaSearch } from 'react-icons/fa'
import { useState } from 'react'
import { Routes, Route, useNavigate } from 'react-router-dom'
import MealDetail from './MealDetail'

interface Meal {
  strMeal: string
  strMealThumb: string
  strInstructions: string
}

export function Home() {
  const [search, setSearch] = useState("")
  const [meals, setMeals] = useState<Meal[]>([])
  const navigate = useNavigate()

  const handlerSearch = async () => {
    if (!search) return;

    try {
      const response = await fetch(
        `https://www.themealdb.com/api/json/v1/1/search.php?s=${search}`
      )

      const data = await response.json()
      setMeals(data.meals ?? [])
    } catch (error) {
      console.log("Error:", error)
    }
  }

  return (
    <>
      <h1>Meal Finder</h1>

      <div className="search-container">
        <input
          type="text"
          value={search}
          placeholder="Search..."
          onChange={(e) => setSearch(e.target.value)}
        />

        <button className="search-btn" onClick={handlerSearch}>
          <FaSearch />
        </button>
      </div>

      <div className='div-inf'>
         <h3>puedes buscar</h3>
          <p>✔ "chicken", "beef", "pork", "salmon", "soup", "rice", "cake", "pasta",
            "taco", "pizza", "salad"</p>
      </div>

      <div className="meals-container">
        {meals.map((meal, index) => (
          <div
            key={index}
            className="meal-card"
            onClick={() => navigate("/meal", { state: meal })}
          >
            <img src={meal.strMealThumb} alt={meal.strMeal} />
            <h3>{meal.strMeal}</h3>
          </div>
        ))}
      </div>
    </>
  )
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/meal" element={<MealDetail />} />
    </Routes>
  )
}

export default App




