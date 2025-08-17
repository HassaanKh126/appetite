'use client'

import React, { useEffect, useState } from "react";
import styles from "./account.module.css";
import { jwtDecode } from "jwt-decode";

const Account = () => {
  const [username, setUsername] = useState('')
  const [userId, setUserId] = useState('')
  const [selectedType, setSelectedType] = useState("MY RECIPES")
  const [recipes, setRecipes] = useState()
  const [myrecipes, setMyRecipes] = useState()
  const [userData, setUserData] = useState()
  const [selected, setSelected] = useState("")

  const getToken = async () => {
    const token = localStorage.getItem("appetite_token");

    if (token) {
      const decoded = jwtDecode(token)
      setUserId(decoded.userId)
      const response = await fetch(`${process.env.NEXT_PUBLIC_BURL}/get-user-info`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ userId: decoded.userId })
      })
      const data = await response.json()
      setUserData(data.user);
      setUsername(data.user.username)
    } else {
      window.location.href = "/";
    }
  }

  useEffect(() => {
    getToken()
  }, [])

  useEffect(() => {
    if (userId) {
      setRecipes(null)
      if (selectedType === "MY RECIPES") {
        getRecipes()
      }
      if (selectedType === "LIKED RECIPES") {
        getLikedRecipes()
      }
    }
  }, [selectedType, userId])

  const getRecipes = async () => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BURL}/get-my-recipes`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId })
    })
    const data = await response.json()
    setRecipes(data.recipes);
    setMyRecipes(data.recipes)
  }

  const getLikedRecipes = async () => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BURL}/get-my-liked-recipes`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username })
    })
    const data = await response.json()
    setRecipes(data.recipes);
  }

  const handleMyRecipes = () => {
    setSelectedType("MY RECIPES")
  }

  const handleLikedRecipes = () => {
    setSelectedType("LIKED RECIPES")
  }

  const handleRecipePage = (recipe) => {
    sessionStorage.setItem('recipe-detail', JSON.stringify(recipe._id));
    window.location.href = "/recipe"
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
          <a href="/explore">Explore</a>
          <a href="/my-recipes">My Recipes</a>
          <a href="/ingredients">Ingredients</a>
          <a href="/account"><b>{username}</b></a>
        </ul>
      </nav>

      <div className={styles.hero}>
        <div className={styles.container}>
          {username && (
            <div className={styles.usernameContainer}>
              <button onClick={() => { window.location.href = "/settings" }}>☰</button>
              <h1>{username}</h1>
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'row', alignItems: "center", justifyContent: "space-between", marginTop: 10, width: "90%", justifySelf: "center" }}>
            {myrecipes && (
              <h1 className={styles.details}><span style={{ fontFamily: "Chewy" }}>{myrecipes.length}</span> {myrecipes.length === 1 ? ("Recipe") : ("Recipes")}</h1>
            )}
            {userData && (
              <>
                <h1 className={styles.details} onClick={() => { setSelected("FOLLOWING") }}><span style={{ fontFamily: "Chewy" }}>{userData.following.length}</span> <span className={styles.detailsh}>Following</span></h1>
                <h1 className={styles.details} onClick={() => { setSelected("FOLLOWERS") }}><span style={{ fontFamily: "Chewy" }}>{userData.followers.length}</span> <span className={styles.detailsh}>{userData.followers.length === 1 ? ("Follower") : ("Followers")}</span></h1>
              </>
            )}
          </div>

          {userData && (
            <div className={styles.bio}>
              <p style={{ whiteSpace: "pre-line" }}>{userData.bio}</p>
            </div>
          )}

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

          <div className={styles.recipeType}>
            {selectedType === "MY RECIPES" ? (
              <h1 onClick={handleMyRecipes}><u style={{ textUnderlineOffset: 2, textDecorationThickness: 2 }}>My Recipes</u></h1>
            ) : (
              <h1 onClick={handleMyRecipes}>My Recipes</h1>
            )}
            {selectedType === "LIKED RECIPES" ? (
              <h1 onClick={handleLikedRecipes}><u style={{ textUnderlineOffset: 2, textDecorationThickness: 2 }}>Liked Recipes</u></h1>
            ) : (
              <h1 onClick={handleLikedRecipes}>Liked Recipes</h1>
            )}
          </div>

          {recipes && recipes.length === 0 ? (
            <>
              <p className={styles.norec}>No recipes here yet.</p>
            </>
          ) : (
            recipes?.map((recipe, index) => {
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
        <img className={styles.image} src="/appetite-ai.png" alt="Appetite AI Logo" />
      </div>
    </div>
  );
}

export default Account;