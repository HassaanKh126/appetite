'use client'

import React, { useEffect, useState } from "react";
import styles from "./explore.module.css";
import { jwtDecode } from "jwt-decode";

const Explore = () => {
    const [username, setUsername] = useState('')
    const [userId, setUserId] = useState('')
    const [recipes, setRecipes] = useState([])
    const [selectedRecipe, setSelectedRecipe] = useState()
    const [selectedRecipeforC, setSelectedRecipeforC] = useState()
    const [selectedType, setSelectedType] = useState("FOR YOU")
    const [loaded, setLoaded] = useState(false)
    const [comment, setComment] = useState("")

    const getToken = async () => {
        const token = localStorage.getItem("appetite_token");
        if (token) {
            const decoded = jwtDecode(token);
            const response = await fetch(`${process.env.NEXT_PUBLIC_BURL}/get-user-info`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ userId: decoded.userId })
            });
            const data = await response.json()
            setUsername(data.user.username)
            setUserId(decoded.userId)
        } else {
            window.location.href = "/";
        }
    }

    const getRecipes = async () => {
        setRecipes([])
        const response = await fetch(`${process.env.NEXT_PUBLIC_BURL}/get-public-recipes`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            }
        })

        const data = await response.json();
        setRecipes(data.recipes);
        setLoaded(true)
    }

    const getFollowingRecipes = async () => {
        setRecipes([])
        const response = await fetch(`${process.env.NEXT_PUBLIC_BURL}/get-following-recipes`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ userId: userId })
        })

        const data = await response.json();
        setRecipes(data.recipes);
        setLoaded(true)
    }

    useEffect(() => {
        getToken()
    }, [])

    useEffect(() => {
        if (selectedType === "FOR YOU") {
            getRecipes()
        }
        if (selectedType === "FOLLOWING") {
            getFollowingRecipes()
        }
    }, [selectedType])


    function timeAgo(dateString) {
        const date = new Date(dateString);
        const now = new Date();
        const seconds = Math.floor((now - date) / 1000);

        const intervals = {
            year: 31536000,
            month: 2592000,
            week: 604800,
            day: 86400,
            hour: 3600,
            minute: 60,
            second: 1,
        };

        for (const [unit, value] of Object.entries(intervals)) {
            const diff = Math.floor(seconds / value);
            if (diff >= 1) {
                const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });
                return rtf.format(-diff, unit);
            }
        }

        return 'just now';
    }

    const handleLike = async (recipe) => {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BURL}/handle-recipe-like`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ id: recipe._id, userId: username })
        })

        const data = await response.json()
        if (data.success) {
            if (recipe.likes.includes(username)) {
                setRecipes((prevRecipes) => {
                    return prevRecipes.map((rec) => {
                        if (rec._id === recipe._id) {
                            return {
                                ...rec,
                                likes: rec.likes.filter((like) => like !== username),
                            };
                        }
                        return rec;
                    });
                });
            } else {
                setRecipes((prevRecipes) => {
                    return prevRecipes.map((rec) => {
                        if (rec._id === recipe._id) {
                            return {
                                ...rec,
                                likes: [...recipe.likes, username],
                            };
                        }
                        return rec;
                    });
                });
            }
        }
    }

    const handleShowLikes = (recipe) => {
        setSelectedRecipe(recipe)
    }

    const handleUsernameClick = (uname) => {
        window.location.href = `/u/${uname}`
    }

    const handleShowComments = (recipe) => {
        setSelectedRecipeforC(recipe)
    }

    const handleCommentSubmit = async (e, recipeId) => {
        e.preventDefault()
        if (comment.trim() === "") {
            alert('Add a comment before submitting.')
            return;
        }
        const response = await fetch(`${process.env.NEXT_PUBLIC_BURL}/add-comment`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ rid: recipeId, username: username, comment: comment })
        })
        const data = await response.json()
        if (data.success === true) {
            setSelectedRecipeforC(prev => ({
                ...prev,
                comments: [...prev.comments, data.comment]
            }));
            setComment("")
        }

    }

    const handleRemoveComment = async (rid, cid) => {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BURL}/remove-comment`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ rid, cid })
        })
        const data = await response.json()
        if (data.success === true) {
            setSelectedRecipeforC(prev => ({
                ...prev,
                comments: prev.comments.filter(comment => comment._id !== cid)
            }));
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
                <div className={styles.hideScrollbar} style={{ overflowY: "scroll", zIndex: 10, width: "100%" }}>
                    <div style={{ marginTop: 20 }}></div>
                    {loaded && (
                        <div className={styles.recipeType}>
                            {selectedType === "FOR YOU" ? (
                                <h1><u>For You</u></h1>
                            ) : (
                                <h1 onClick={() => { setSelectedType("FOR YOU") }}>For You</h1>
                            )}
                            {selectedType === "FOLLOWING" ? (
                                <h1><u>Following</u></h1>
                            ) : (
                                <h1 onClick={() => { setSelectedType("FOLLOWING") }}>Following</h1>
                            )}
                        </div>
                    )}
                    {loaded && recipes && recipes.length === 0 ? (
                        <>
                            <p className={styles.norec}>No Recipes Here.</p>
                        </>
                    ) : (
                        recipes.map((recipe, index) => {
                            return (
                                <div key={index} className={styles.postContainer}>
                                    <div style={{ display: "flex", flexDirection: "row", alignItems: 'center', gap: 10 }}>
                                        <div className={styles.postprofilepic} style={{ fontFamily: "Chewy", display: "flex", flexDirection: "column", justifyContent: "center" }}>{recipe.username[0].toUpperCase()}</div>
                                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                                            <h1 className={styles.postUsername} onClick={() => { handleUsernameClick(recipe.username) }}>{recipe.username}</h1>
                                            <p className={styles.postTime}>{timeAgo(recipe.createdAt)}</p>
                                        </div>
                                    </div>
                                    <div className={styles.dishContainer}>
                                        <h1 className={styles.dishContainerName}>{recipe.dish_name}</h1>
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'row', alignItems: "flex-start", justifyContent: "space-between", marginTop: "20px" }}>
                                        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
                                            <h1 className={styles.postIngredient}>Ingredients:</h1>
                                            {recipe.dish_ingredients.map((ingredient, index) => {
                                                return (
                                                    <div key={index}>
                                                        <h1 className={styles.postIngredients}>{ingredient.ingredient}</h1>
                                                    </div>
                                                )
                                            })}
                                        </div>
                                        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
                                            <h1 className={styles.postNutrition}>Nutrition:</h1>
                                            <h1 className={styles.postIngredients}>Calories ~{recipe.nutrition.calories}</h1>
                                            <h1 className={styles.postIngredients}>Protein ~{recipe.nutrition.protein}</h1>
                                            <h1 className={styles.postIngredients}>Fat ~{recipe.nutrition.fat}</h1>
                                            <h1 className={styles.postIngredients}>Carbohydrates ~{recipe.nutrition.carbohydrates}</h1>
                                        </div>
                                    </div>
                                    <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", marginTop: "10px" }}>
                                        <h1 className={styles.postInstruction}>Instructions:</h1>
                                        {recipe.instructions.map((instruction, index) => {
                                            return (
                                                <div key={index}>
                                                    <h1 className={styles.postInstructions}><u style={{ textDecorationThickness: 2, textUnderlineOffset: 2, marginRight: 4 }}>{index + 1}.</u> {instruction}</h1>
                                                </div>
                                            )
                                        })}
                                    </div>
                                    <div className={styles.likesContainer}>
                                        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                                            <p className={styles.comments} onClick={() => { handleShowComments(recipe) }}>Comments</p>
                                            <button className={styles.commentsText}>{recipe.comments?.length || 0}</button>
                                        </div>
                                        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                                            <button className={styles.likeShareText} onClick={() => { handleShowLikes(recipe) }}>Likes</button>
                                            <button className={styles.likeShare} onClick={() => { handleLike(recipe) }}>{recipe.likes.includes(username) ? ("♥") : ("♡")} {recipe.likes.length}</button>
                                        </div>
                                    </div>
                                </div>
                            )
                        })
                    )}
                </div>
                {selectedRecipe && (
                    <div className={styles.modalOverlay}>
                        <div className={styles.modal}>
                            <h3>Likes</h3>
                            <ul style={{ marginTop: 10 }}>
                                {selectedRecipe.likes.length > 0 ? (
                                    selectedRecipe.likes.map((userId, index) => (
                                        <li key={index} style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: 10 }}>
                                            <div className={styles.postprofilepic} style={{ fontFamily: "Chewy", display: "flex", flexDirection: "column", justifyContent: "center" }}>{userId[0].toUpperCase()}</div>
                                            <button onClick={() => { handleUsernameClick(userId) }}>{userId}</button>
                                        </li>
                                    ))
                                ) : (
                                    <li>No likes yet</li>
                                )}
                            </ul>
                            <button className={styles.closeBtn} onClick={() => setSelectedRecipe(null)}>Close</button>
                        </div>
                    </div>
                )}
                {selectedRecipeforC && (
                    <div className={styles.modalOverlay}>
                        <div className={styles.modal}>
                            <h3>Comments</h3>
                            <ul style={{ marginTop: 10 }}>
                                {selectedRecipeforC.comments && selectedRecipeforC.comments.length > 0 ? (
                                    selectedRecipeforC.comments.map((comment, index) => (
                                        <li key={index} style={{ display: "flex", flexDirection: "row", alignItems: "center", backgroundColor: "#f5e5d1", padding: 10, borderRadius: 10, marginTop: 10, justifyContent: 'space-between' }}>
                                            <div style={{ display: "flex", flexDirection: 'row', alignItems: "center", gap: 10 }}>
                                                <div className={styles.postprofilepic} style={{ fontFamily: "Chewy", display: "flex", flexDirection: "column", justifyContent: "center" }}>{comment.username[0].toUpperCase()}</div>
                                                <button onClick={() => { handleUsernameClick(userId) }}><b>{comment.username}</b>:</button>
                                                <p>{comment.comment}</p>
                                            </div>
                                            <div>
                                                <button onClick={() => { handleRemoveComment(selectedRecipeforC._id, comment._id) }}>Remove</button>
                                            </div>
                                        </li>
                                    ))
                                ) : (
                                    <li>No comments yet</li>
                                )}
                            </ul>
                            <form onSubmit={(e) => { handleCommentSubmit(e, selectedRecipeforC._id) }} className={styles.commentdiv}>
                                <input className={styles.input} type="text" placeholder="Add a comment..." value={comment} onChange={(e) => { setComment(e.target.value) }} />
                                <button type="submit" className={styles.closeBtn2}>Add Comment</button>
                            </form>
                            <button className={styles.closeBtn} onClick={() => setSelectedRecipeforC(null)}>Close</button>
                        </div>
                    </div>
                )}
                {!loaded && (
                    <>
                        <p className={styles.norec}>Loading...</p>
                    </>
                )}
                <img className={styles.image} src="/appetite-ai.png" alt="Appetite AI Logo" />
            </div>
        </div >
    )
}

export default Explore;