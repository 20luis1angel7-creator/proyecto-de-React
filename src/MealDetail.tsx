import { useLocation, useNavigate } from "react-router-dom";

interface Meal {
    strMeal: string;
    strMealThumb: string;
    strInstructions: string;
}

export function MealDetail() {
    const location = useLocation();
    const navigate = useNavigate();

    const meal = location.state as Meal | undefined;

    if (!meal) {
    return (
      <div className="detail-container">
        <h2>No hay datos</h2>
        <button
          className="back-btn"
          onClick={() => navigate("/")}
        >
          Volver al inicio
        </button>
      </div>
    )
  }
    
    return (
        <div className="detail-container">
            <button
            className="back-byn" 
            onClick={() => navigate(-1)}
            >
                Volver
            </button>

            <h2>{meal.strMeal}</h2>
            <img src={meal.strMealThumb} alt={meal.strMeal} />
            <p>{meal.strInstructions}</p>
        </div>
    )
}

export default MealDetail;





