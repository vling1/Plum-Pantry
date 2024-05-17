import PageWrapper from "./../components/PageWrapper.jsx";
import { Button, Container, Row } from "react-bootstrap";
import RecipeTile from "./RecipeTileForBKND.jsx";
import api from "./axiosConifg.jsx"
import { useState , useEffect} from "react";


export default function MyTest() {
    const [recipes, setRecipes] = useState([]);

    const getRecipes = async () =>{
        try{
            const response = await api.get("/db/Recipes");
            if (response.data && Array.isArray(response.data)) {
                setRecipes(response.data);
                console.log(response.data)
            } else {
                console.error("Invalid response format:", response.data);
            }
        } catch(err){
            console.error("Error fetching recipes:", err);
        }
    }
    useEffect(()=> {
        const x = getRecipes();
    },[])
    
    return <PageWrapper>
                <Container>
                    <Row>
                    {recipes.map(recipe =>(
                        // <div key={recipe.id}>
                        //     {console.log("Recipe ID:", recipe.id)}
                        //     <h2>{recipe.recipeTitle}</h2>
                        //     <h1></h1>
                        //     <p>{recipe.cookTime}</p>

                        // </div>
                        <RecipeTile {...recipe} key={recipe.id}/>
                    ))}
                    </Row>
                </Container>
        </PageWrapper>;
}

