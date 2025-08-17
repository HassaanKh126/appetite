'use client'

import React, { useEffect, useState } from "react";
import styles from "./ingredients.module.css";
import { jwtDecode } from "jwt-decode";


const Ingredients = () => {
    const [username, setUsername] = useState('')
    const [ingredient, setIngredient] = useState('')
    const [ingredients, setIngredients] = useState([])

    const getToken = async () => {
        const token = localStorage.getItem("appetite_token");
        const ingredients = localStorage.getItem("appetite_ingredients")
        const savedIngredients = JSON.parse(ingredients)

        if (token) {
            const decoded = jwtDecode(token)
            const response = await fetch(`${process.env.NEXT_PUBLIC_BURL}/get-user-info`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ userId: decoded.userId })
            });
            const data = await response.json()
            setUsername(data.user.username)
        } else {
            window.location.href = "/"
        }
        if (ingredients) {
            setIngredients(savedIngredients)
        }
    }

    useEffect(() => {
        getToken()
    }, [])

    useEffect(() => {
        localStorage.setItem("appetite_ingredients", JSON.stringify(ingredients))
    }, [ingredients])

    const handleAddIngredient = () => {
        if (ingredient.trim() === "") {
            return;
        }
        setIngredients(prev => [...prev, ingredient])
        setIngredient('')
    }

    const deleteIngredient = (i) => {
        setIngredients(prev => prev.filter((_, index) => index !== i));
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
                <h1 className={styles.ingredients}>Ingredients</h1>
                <p className={styles.ingredientsdes}>Enter your ingredients to be used for future recipes.<br />Providing no ingredients will generate recipes with <b>any</b> ingredients.</p>
                <div style={{ display: "flex", flexDirection: 'row', alignItems: "center", justifyContent: "flex-start", gap: "10px" }}>
                    <input value={ingredient} onChange={(e) => { setIngredient(e.target.value) }} type="text" className={styles.ingin} placeholder="Enter your Ingredients..." />
                    <button className={styles.ingbtn} onClick={handleAddIngredient} disabled={ingredient.trim() === "" ? (true) : (false)}>Add Ingredients</button>
                </div>
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(3, 1fr)',
                    gap: '1rem',
                    marginTop: 30,
                }}>
                    {ingredients.length > 0 ? ingredients.map((ingredient, index) => {
                        return (
                            <div key={index} className={styles.ingredientdiv}>
                                <h1 className={styles.ingredient}>{ingredient}</h1>
                                <button className={styles.ingredientdel} onClick={() => { deleteIngredient(index) }}>X</button>
                            </div>
                        )
                    }) : (
                        <h1 className={styles.nif}>No Ingredients Found.</h1>
                    )}
                </div>
            </div>
        </div >
    );
}

export default Ingredients;