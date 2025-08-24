'use client'

import React, { useCallback, useEffect, useState } from "react";
import styles from "./page.module.css";
import "./fade.css"
import { jwtDecode } from "jwt-decode";
import confetti from "canvas-confetti";

const Home = () => {
  // const [username, setUsername] = useState('')
  // const [cooktext, setCooktext] = useState('')
  // const [cooking, setCooking] = useState(false)
  // const [showSec1, setshowsec1] = useState(true)
  // const [showSecLoading, setshowsecloading] = useState(false)
  // const [showSecRecipes, setshowsecRecipes] = useState(false)
  // const [ingredients, setIngredients] = useState([])
  // const [id, setId] = useState("")
  // const [savedList, setSavedList] = useState([])
  // const [loading, setLoading] = useState(false)
  // const [btnIndex, setBtnIndex] = useState(null)

  // const [recipes, setRecipes] = useState([])

  // const getToken = async () => {
  //   const token = localStorage.getItem("appetite_token");
  //   const storedingredients = localStorage.getItem("appetite_ingredients")
  //   const savedIng = JSON.parse(storedingredients)
  //   if (token) {
  //     const decoded = jwtDecode(token)
  //     setId(decoded.userId)
  //     const response = await fetch(`${process.env.NEXT_PUBLIC_BURL}/get-user-info`, {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json"
  //       },
  //       body: JSON.stringify({ userId: decoded.userId })
  //     });
  //     const data = await response.json()
  //     setUsername(data.user.username)
  //   }
  //   if (storedingredients) {
  //     setIngredients(savedIng)
  //   }
  // }

  // useEffect(() => {
  //   getToken()
  // }, [])

  useEffect(() => {
    window.location.href = "https://play.google.com/store/apps/details?id=com.byte9962.appetite"
  }, [])

  return (null)

  // const handleCooking = async (e) => {
  //   e.preventDefault()
  //   setCooking(true)
  //   setTimeout(() => {
  //     setshowsec1(false);
  //   }, 200)
  //   setTimeout(() => {
  //     setshowsecloading(true)
  //   }, 200)
  //   try {
  //     if (username) {
  //       const response = await fetch(`${process.env.NEXT_PUBLIC_BURL}/cook`, {
  //         method: "POST",
  //         headers: {
  //           'Content-Type': 'application/json',
  //         },
  //         body: JSON.stringify({ cookText: cooktext, ingredients: ingredients }),
  //       });
  //       const data = await response.json();
  //       console.log(data);

  //       setRecipes(data.recipes)
  //       setTimeout(() => {
  //         setshowsecRecipes(true)
  //       }, 300)
  //     } else {
  //       window.location.href = "/login"
  //     }
  //   } catch (error) {
  //     console.log(error)
  //   } finally {
  //     setCooking(false)
  //     setTimeout(() => {
  //       setshowsecloading(false)
  //     }, 300);
  //   }
  // }

  // const handleSave = async (recipe_index) => {
  //   setLoading(true)
  //   setBtnIndex(recipe_index)
  //   try {
  //     const response = await fetch(`${process.env.NEXT_PUBLIC_BURL}/save-recipe`, {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json"
  //       },
  //       body: JSON.stringify({ recipe: recipes[recipe_index], userId: id })
  //     })

  //     const data = await response.json();
  //     if (data.success === true) {
  //       const newList = savedList.concat(recipe_index)
  //       setSavedList(newList)
  //     }
  //   } catch (error) {
  //     console.log(error);
  //   } finally {
  //     setBtnIndex(null)
  //     setLoading(false)
  //   }
  // }

  // const fireFromElement = useCallback((el) => {
  //   if (!el) return;

  //   const rect = el.getBoundingClientRect();
  //   const originX = (rect.left + rect.width / 2) / window.innerWidth;
  //   const originY = (rect.top + rect.height / 2) / window.innerHeight;

  //   confetti({
  //     particleCount: 40,
  //     startVelocity: 30,
  //     spread: 50,
  //     origin: { x: originX, y: originY },
  //     colors: ["#413426", "#ffffff", "#000000", "#564533"]
  //   });
  // }, []);

  // return (
  //   <div className={styles.page}>
  //     <nav className={styles.navbar}>
  //       <div className={styles.logo} onClick={() => { window.location.href = "/" }}>
  //         Appetite AI
  //       </div>
  //       <ul className={styles.navLinks}>
  //         {username ? (
  //           <>
  //             <a href="/explore">Explore</a>
  //             <a href="/my-recipes">My Recipes</a>
  //             <a href="/ingredients">Ingredients</a>
  //             <a href="/account"><b>{username}</b></a>
  //           </>
  //         ) : (
  //           <a href="/login">Login</a>
  //         )}
  //       </ul>
  //     </nav>
  //     <div className={styles.hero}>
  //       {showSec1 && (
  //         <div className={`fade ${cooking ? "fade-out" : "fade-in"}`}>
  //           <div className={styles.container}>
  //             <h1 className={styles.title}>Welcome to Appetite AI !</h1>
  //             <h2 className={styles.description}>
  //               How may I satisfy your appetite today?
  //             </h2>
  //             <form onSubmit={handleCooking}>
  //               <input
  //                 id="cooktext"
  //                 value={cooktext}
  //                 onChange={(e) => { setCooktext(e.target.value) }}
  //                 type="text"
  //                 className={styles.input}
  //                 placeholder="I want to eat something that I can make quickly..."
  //               />
  //               <p className={styles.subdescription}><b>Suggestion:</b> Italian Food, Chinese Food, Indian Food, Spicy Food, Veg or Non Veg etc.</p>
  //               <button type="submit" className={styles.button} disabled={cooktext.trim() === "" ? (true) : (false)}>{"Let's get cooking!"}</button>
  //             </form>
  //           </div>
  //         </div>
  //       )}
  //       {showSecLoading && (
  //         <div className={`fade ${cooking ? "fade-in" : "fade-out"}`}>
  //           <div className={styles.container}>
  //             <h1 className={styles.title}>Cooking...!</h1>
  //           </div>
  //         </div>
  //       )}
  //       {showSecRecipes && (
  //         <div className={`fade ${showSecRecipes ? "fade-in" : "fade-out"}`}>
  //           <div className={styles.recipesContainer}>
  //             {recipes.map((recipe, index) => {
  //               return (
  //                 <div key={index} className={styles.recipeContainer}>
  //                   <div style={{ display: "flex", flexDirection: "column", height: "100%", justifyContent: 'space-between' }}>
  //                     <div>
  //                       <h1>{recipe.dish_name}</h1>
  //                       <p className={styles.dishdes}>{recipe.dish_description}</p>
  //                     </div>
  //                     <div style={{ marginTop: 20 }}>
  //                       <p className={styles.recipetime}><b>Estimated Time:</b> {recipe.estimated_time_to_make} minutes</p>
  //                       <p className={styles.recipediff}><b>Difficulty:</b> {`${recipe.difficulty[0].toUpperCase()}${recipe.difficulty.slice(1)}`}</p>
  //                       <p className={styles.recipediff}><b>Cuisine:</b> {`${recipe.cuisine[0].toUpperCase()}${recipe.cuisine.slice(1)}`}</p>
  //                       <p className={styles.recipenut}><b>Nutrition</b></p>
  //                       <p className={styles.recipenutdet}><b>Calories:</b> ~{recipe.nutrition.calories}</p>
  //                       <p className={styles.recipenutdet}><b>Proteins:</b> ~{recipe.nutrition.protein}</p>
  //                       <p className={styles.recipenutdet}><b>Fats:</b> ~{recipe.nutrition.fat}</p>
  //                       <p className={styles.recipenutdet}><b>Carbohydrates:</b> ~{recipe.nutrition.carbohydrates}</p>
  //                     </div>
  //                   </div>
  //                   <div>
  //                     <button className={styles.recipebutton} onClick={(e) => { handleSave(index); fireFromElement(e.currentTarget) }} disabled={savedList.includes(index) || (loading && btnIndex === index)}>Save ♥</button>
  //                   </div>
  //                 </div>
  //               )
  //             })}
  //           </div>
  //         </div>
  //       )}
  //       <img className={styles.image} src="/appetite-ai.png" alt="Appetite AI Logo" />
  //     </div>
  //   </div >
  // );
}

export default Home;