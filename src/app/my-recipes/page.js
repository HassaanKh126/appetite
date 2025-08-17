'use client'

import React, { useEffect, useState } from "react";
import styles from "./myrecipes.module.css";
import { jwtDecode } from "jwt-decode";

const Ingredients = () => {
    const [username, setUsername] = useState('')
    const [recipes, setRecipes] = useState([])

    const getToken = async () => {
        const token = localStorage.getItem("appetite_token");
        if (token) {
            const decoded = jwtDecode(token)
            const response1 = await fetch(`${process.env.NEXT_PUBLIC_BURL}/get-user-info`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ userId: decoded.userId })
            });
            const data1 = await response1.json()
            setUsername(data1.user.username)

            const userId = decoded.userId;
            const response = await fetch(`${process.env.NEXT_PUBLIC_BURL}/get-my-recipes`, {
                method: "POST",
                headers: {
                    'Content-Type': "application/json"
                },
                body: JSON.stringify({ userId })
            })
            const data = await response.json();
            setRecipes(data.recipes)
        } else {
            window.location.href = "/"
        }
    }

    useEffect(() => {
        getToken()
    }, [])

    const handleUnlike = async (id) => {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BURL}/remove-from-my-recipes`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ id })
        })
        const data = await response.json()
        if (data.success) {
            setRecipes(prev => prev.filter(rec => rec._id !== id))
        }
    }


    const handleRecipePage = (recipe) => {
        sessionStorage.setItem('recipe-detail', JSON.stringify(recipe._id));
        window.location.href = "/recipe"
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
                <h1 className={styles.likedRecipes}>Liked Recipes</h1>
                <div className={styles.recipesContainer}>
                    {recipes.length > 0 ? recipes.map((recipe, index) => {
                        return (
                            <div key={index} className={styles.recipeContainer}>
                                <button className={styles.remBtn} onClick={() => { handleUnlike(recipe._id) }}>Remove</button>
                                <div style={{ display: "flex", flexDirection: "column", height: "100%", justifyContent: 'space-between' }} onClick={() => { handleRecipePage(recipe) }}>
                                    <div>
                                        <h1>{recipe.dish_name}</h1>
                                        <p className={styles.dishdes}>{recipe.dish_description}</p>
                                    </div>
                                    <div style={{ marginTop: 20 }}>
                                        <p className={styles.recipetime}><b>Estimated Time:</b> {recipe.estimated_time_to_make} minutes</p>
                                        <p className={styles.recipediff}><b>Cuisine:</b> {recipe.cuisine}</p>
                                        <p className={styles.recipediff}><b>Difficulty:</b> {`${recipe.difficulty[0].toUpperCase()}${recipe.difficulty.slice(1)}`}</p>
                                    </div>
                                </div>
                            </div>
                        )
                    }) : (
                        <h1 className={styles.nlr}>No Liked Recipes.</h1>
                    )}
                </div>
            </div>
        </div >
    );
}

export default Ingredients;