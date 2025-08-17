'use client';

import { useParams } from 'next/navigation';
import styles from "./user.module.css"
import { jwtDecode } from 'jwt-decode';
import { useEffect, useState } from 'react';

const UserPage = () => {
    const { id } = useParams();
    const [username, setUsername] = useState("")
    const [userData, setUserData] = useState("")
    const [recipes, setRecipes] = useState("")
    const [recipesog, setRecipesog] = useState("")
    const [selectedType, setSelectedType] = useState("MY RECIPES")
    const [alreadyFollowed, setAlreadyFollowed] = useState(false)
    const [selected, setSelected] = useState("")
    const [loading, setLoading] = useState(false)
    const [userP, setuserP] = useState(true)

    const getToken = async () => {
        const token = localStorage.getItem("appetite_token");
        let usnm;
        if (token) {
            const decoded = jwtDecode(token);
            const response = await fetch(`${process.env.NEXT_PUBLIC_BURL}/get-user-info`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ userId: decoded.userId })
            })
            const data = await response.json()
            setUsername(data.user.username)
            usnm = data.user.username;
        } else {
            setuserP(false)
        }
        const response = await fetch(`${process.env.NEXT_PUBLIC_BURL}/get-id-info`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ id })
        })
        const data = await response.json();
        if (data.user) {
            setUserData(data.user);
            getFollowStatus(data.user.followers, usnm);
        } else {
            window.location.href = "/404"
        }
    }

    useEffect(() => {
        getToken()
    }, [])

    const getFollowStatus = (followers, usnm) => {
        if (followers.includes(usnm)) {
            setAlreadyFollowed(true)
        } else {
            setAlreadyFollowed(false)
        }
    }

    useEffect(() => {
        getRecipes()
    }, [userData, selectedType])

    const getRecipes = async () => {
        if (userData) {
            if (selectedType === "MY RECIPES") {
                const response = await fetch(`${process.env.NEXT_PUBLIC_BURL}/get-user-recipes`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ userId: userData._id })
                })
                const data = await response.json()
                setRecipesog(data.recipes)
                setRecipes(data.recipes)
            }
        }
    }

    const handleMyRecipes = () => {
        setSelectedType("MY RECIPES")
    }

    const handleRecipePage = (recipe) => {
        sessionStorage.setItem('recipe-detail', JSON.stringify(recipe._id));
        window.location.href = "/recipe"
    }

    const handleFollowClick = async () => {
        setLoading(true)
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BURL}/handle-follow`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ idtf: userData._id, username })
            })
            const data = await response.json()
            if (data.success) {
                getToken()
            }
        } catch (error) {
            console.log(error);
        } finally {
            setUserData(prev => ({
                ...prev,
                followers: [...prev.followers, username]
            }))
            setAlreadyFollowed(!alreadyFollowed)
            setLoading(false)
        }
    }

    const handleUnfollowClick = async () => {
        setLoading(true)
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BURL}/handle-unfollow`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ idtf: userData._id, username })
            })
            const data = await response.json()
            if (data.success) {
                getToken()
            }
        } catch (error) {
            console.log(error);
        } finally {
            setUserData(prev => ({
                ...prev,
                followers: [...prev.followers.filter(uname => uname !== username)]
            }))
            setAlreadyFollowed(!alreadyFollowed)
            setLoading(false)
        }
    }

    const handleUsernameClick = (uname) => {
        window.location.href = `/u/${uname}`
    }

    return (
        <div className={styles.page}>
            <nav className={styles.navbar}>
                <div className={styles.logo} onClick={() => { window.location.href = "/" }}>
                    Appetite AI
                </div>
                <ul className={styles.navLinks}>
                    {userP ? (
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
                <div className={styles.container}>
                    <div className={styles.idnameContainer}>
                        <h1>{id}</h1>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'row', alignItems: "center", justifyContent: "space-between", marginTop: 10, width: "90%", justifySelf: "center" }}>
                        {recipesog && (
                            <h1 className={styles.details} style={{cursor: "default"}}><span style={{ fontFamily: "Chewy" }}>{recipesog.length}</span> {recipesog.length === 1 ? ("Recipe") : ("Recipes")}</h1>
                        )}
                        {userData && (
                            <h1 className={styles.details} onClick={() => { setSelected("FOLLOWING") }}><span style={{ fontFamily: "Chewy" }} >{userData.following?.length}</span> <span className={styles.detailsh}>Following</span></h1>
                        )}
                        {userData && (
                            <h1 className={styles.details} onClick={() => { setSelected("FOLLOWERS") }}><span style={{ fontFamily: "Chewy" }} >{userData.followers?.length}</span> <span className={styles.detailsh}>{userData.followers?.length === 1 ? ("Follower") : ("Followers")}</span></h1>
                        )}
                    </div>
                    {username && id !== username && userP && (
                        <div className={styles.followdiv}>
                            <button onClick={() => { alreadyFollowed ? handleUnfollowClick() : handleFollowClick() }} disabled={loading}>{alreadyFollowed ? ("Unfollow") : ("Follow")}</button>
                        </div>
                    )}
                    {userData && (
                        <div className={styles.bio}>
                            <p style={{whiteSpace: "pre-line"}}>{userData.bio}</p>
                        </div>
                    )}

                    <div className={styles.recipeType}>
                        <h1 onClick={handleMyRecipes}><u style={{ textDecoration: 'underline', textDecorationThickness: 4, textUnderlineOffset: 4 }}>Recipes</u></h1>
                    </div>

                    {recipes && recipes.length === 0 ? (
                        <>
                            <p className={styles.norec}>No recipes here yet.</p>
                        </>
                    ) : (
                        recipes && recipes?.map((recipe, index) => {
                            return (
                                <div className={styles.recipeContainer} key={index}>
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
                        })
                    )}

                </div>
                {selected === "FOLLOWERS" && (
                    <div className={styles.modalOverlay}>
                        <div className={styles.modal}>
                            <h3>{selected}</h3>
                            <ul style={{ marginTop: 10 }}>
                                {userData.followers?.length > 0 ? (
                                    userData.followers?.map((userId, index) => (
                                        <li key={index} style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: 10 }}>
                                            <div className={styles.postprofilepic} style={{ fontFamily: "Chewy", display: "flex", flexDirection: "column", justifyContent: "center" }}>{userId[0].toUpperCase()}</div>
                                            <button onClick={() => { handleUsernameClick(userId) }}>{userId}</button>
                                        </li>
                                    ))
                                ) : (
                                    <li>No followers yet</li>
                                )}
                            </ul>
                            <button className={styles.closeBtn} onClick={() => setSelected(null)}>Close</button>
                        </div>
                    </div>
                )}
                {selected === "FOLLOWING" && (
                    <div className={styles.modalOverlay}>
                        <div className={styles.modal}>
                            <h3>{selected}</h3>
                            <ul style={{ marginTop: 10 }}>
                                {userData.following?.length > 0 ? (
                                    userData.following?.map((userId, index) => (
                                        <li key={index} style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: 10 }}>
                                            <div className={styles.postprofilepic} style={{ fontFamily: "Chewy", display: "flex", flexDirection: "column", justifyContent: "center" }}>{userId[0].toUpperCase()}</div>
                                            <button onClick={() => { handleUsernameClick(userId) }}>{userId}</button>
                                        </li>
                                    ))
                                ) : (
                                    <li>No following yet</li>
                                )}
                            </ul>
                            <button className={styles.closeBtn} onClick={() => setSelected(null)}>Close</button>
                        </div>
                    </div>
                )}
                <img className={styles.image} src="/appetite-ai.png" alt="Appetite AI Logo" />
            </div>
        </div>
    );
};

export default UserPage;
