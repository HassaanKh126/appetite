'use client'

import React, { useEffect, useState } from "react";
import styles from "./recipe.module.css";
import "../fade.css"
import { jwtDecode } from "jwt-decode";

const Recipe = () => {
    const [username, setUsername] = useState('')
    const [id, setId] = useState('')
    const [recipe, setRecipe] = useState()

    const getToken = async () => {
        const token = localStorage.getItem("appetite_token");
        const recipeId = sessionStorage.getItem("recipe-detail")

        if (recipeId) {
            const id = JSON.parse(recipeId)
            const response = await fetch(`${process.env.NEXT_PUBLIC_BURL}/get-recipe`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ id })
            })
            const data = await response.json();
            setRecipe(data.recipe)
        } else {
            window.location.href = "/"
        }
        if (token) {
            const decoded = jwtDecode(token)
            setUsername(decoded.username)
            setId(decoded.userId)
        }
    }

    useEffect(() => {
        getToken()
    }, [])

    const handleRecipeVisibility = async () => {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BURL}/change-recipe-visibility`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ recipeId: recipe._id })
        });
        const data = await response.json();
        if (data.success) {
            setRecipe(prev => {
                return {
                    ...prev,
                    public: !prev.public
                };
            });
        }
    }

    return (
        <div className={styles.page}>
            <nav className={styles.navbar}>
                <div className={styles.logo} onClick={() => { window.location.href = "/" }}>
                    Appetite AI
                </div>
                <ul className={styles.navLinks}>
                    {username ? (
                        <>
                            <a href="/explore">Explore</a>
                            <a href="/my-recipes">My Recipes</a>
                            <a href="/ingredients">Ingredients</a>
                            <a href="/account"><b>{username}</b></a>
                        </>
                    ) : (
                        <a href="/login">Login</a>
                    )}
                </ul>
            </nav>

            <div className={styles.hero}>
                <div style={{ display: "flex", flexDirection: "row", backgroundColor: "#faebd7", alignItems: 'baseline', justifyContent: "center", margin: 20, gap: 40, position: 'relative' }}>
                    <div>
                        {recipe?.dish_name && (
                            <h1 className={styles.recipehead}><span style={{ fontSize: "2.5rem", textDecoration: "underline", marginLeft: 5, textUnderlineOffset: 5, textDecorationThickness: 3 }}>{recipe.dish_name}</span></h1>
                        )}
                        {recipe?.dish_description && (
                            <h1 className={styles.dishdes}>{recipe.dish_description}</h1>
                        )}
                        {recipe?.estimated_time_to_make && (
                            <p className={styles.recipetime}><b>Estimated Time:</b> {recipe.estimated_time_to_make} minutes</p>
                        )}
                        {recipe?.difficulty && (
                            <p className={styles.recipediff}><b>Difficulty:</b> {`${recipe.difficulty[0].toUpperCase()}${recipe.difficulty.slice(1)}`}</p>
                        )}
                        {recipe?.cuisine && (
                            <p className={styles.recipediff}><b>Cuisine:</b> {`${recipe.cuisine[0].toUpperCase()}${recipe.cuisine.slice(1)}`}</p>
                        )}
                        {recipe?.nutrition && (
                            <>
                                <p className={styles.recipenut}><b><u style={{ textDecorationThickness: 3, textUnderlineOffset: 5 }}>Nutrition</u></b></p>
                                <p className={styles.recipenutdet}><b>Calories:</b> ~{recipe.nutrition.calories}</p>
                                <p className={styles.recipenutdet}><b>Proteins:</b> ~{recipe.nutrition.protein}</p>
                                <p className={styles.recipenutdet}><b>Fats:</b> ~{recipe.nutrition.fat}</p>
                                <p className={styles.recipenutdet}><b>Carbohydrates:</b> ~{recipe.nutrition.carbohydrates}</p>
                            </>
                        )}
                    </div>
                    <div style={{ display: 'flex', flexDirection: "column", justifyContent: 'space-between', height: "100%" }}>
                        <div>
                            {recipe?.dish_ingredients && (
                                <p className={styles.recipeinshead}><b><u style={{ textDecorationThickness: 3, textUnderlineOffset: 5 }}>Ingredients:</u></b></p>
                            )}
                            {recipe?.dish_ingredients?.map((ingredient, index) => {
                                return (
                                    <p className={styles.recipeinstruction} key={index}><span style={{ marginRight: "5px" }}><b><u style={{ textDecorationThickness: 2, textUnderlineOffset: 5 }}>{index + 1}.</u></b> </span>{ingredient.ingredient} - {ingredient.amount}.</p>
                                )
                            })}
                        </div>
                        <div>
                            {recipe?.instructions && (
                                <p className={styles.recipeinshead}><b><u style={{ textDecorationThickness: 3, textUnderlineOffset: 5 }}>Instructions:</u></b></p>
                            )}
                            {recipe?.instructions?.map((instruction, index) => {
                                return (
                                    <p className={styles.recipeinstruction} key={index}><span style={{ marginRight: "5px" }}><b><u style={{ textDecorationThickness: 2, textUnderlineOffset: 5 }}>{index + 1}.</u> </b></span>{instruction}</p>
                                )
                            })}
                        </div>
                    </div>
                </div>
                {recipe && recipe.userId === id && (
                    <div style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: 40, justifyContent: "flex-start", marginTop: 10 }}>
                        <h1 className={styles.visibility}><b style={{ marginRight: 5 }}>Visibility:</b> {recipe.public ? ("Public") : ("Private")}</h1>
                        <button className={styles.visibilityBtn} onClick={handleRecipeVisibility}>{recipe.public ? ("Make it Private") : ("Make it Public")}</button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Recipe;