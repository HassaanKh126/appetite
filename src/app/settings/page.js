'use client'

import React, { useEffect, useState } from "react";
import styles from "./settings.module.css";
import { jwtDecode } from "jwt-decode";

const Settings = () => {
  const [username, setUsername] = useState("")
  const [theusername, settheUsername] = useState("")
  const [userId, setUserId] = useState("")
  const [userData, setUserData] = useState()
  const [theBio, setTheBio] = useState("")
  const [loading, setLoading] = useState(false)

  const getToken = async () => {
    const token = localStorage.getItem("appetite_token")
    if (token) {
      const decoded = jwtDecode(token)
      setUserId(decoded.userId)
      const response = await fetch(`${process.env.NEXT_PUBLIC_BURL}/get-user-info`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ userId: decoded.userId })
      });
      const data = await response.json()
      setUserData(data.user)
      setTheBio(data.user.bio)
      setUsername(data.user.username)
      settheUsername(data.user.username)
    } else {
      window.location.href = "/";
    }
  }

  useEffect(() => {
    getToken()
  }, [])

  const handleLogout = () => {
    localStorage.removeItem("appetite_token");
    window.location.href = "/"
  }

  const handleDeleteIngredients = () => {
    localStorage.removeItem('appetite_ingredients')
    alert("Ingredients Deleted.")
  }

  const handleDeleteRecipes = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BURL}/remove-all-recipes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId })
      })
      const data = await response.json();
      if (data.success) {
        alert("Recipes deleted successfully.")
      }
    } catch (error) {
      console.log(error);
    }
  }

  const handleDeleteAllData = async () => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BURL}/delete-all-data`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId })
    })
    const data = await response.json()
    if (data.success) {
      localStorage.removeItem("appetite_token")
      localStorage.removeItem("appetite_ingredients")
      window.location.href = "/"
    }
  }

  const handleSave = async () => {
    setLoading(true)
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BURL}/edit-data`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ bio: theBio, username: theusername, userId: userId })
      })
      const data = await response.json()
      if(data.success){
        setUsername(theusername)
      }
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
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
          <h1 className={styles.settingsHead}>Settings</h1>
          {userData &&
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <input className={styles.input} type="text" placeholder="Username..." value={theusername} onChange={(e) => { settheUsername(e.target.value) }} />
              <textarea className={styles.input} placeholder="Bio..." value={theBio} onChange={(e) => { setTheBio(e.target.value) }}></textarea>
              <button className={styles.settingbtn} onClick={handleSave} disabled={loading}>Save</button>
              <div style={{ marginTop: 40 }}></div>
              <button className={styles.settingbtn} onClick={handleDeleteRecipes}>Delete My Recipes</button>
              <button className={styles.settingbtn} onClick={handleDeleteIngredients}>Delete All Ingredients</button>
              <button className={styles.settingbtn} onClick={handleDeleteAllData}>Delete Account and Data</button>
              <button className={styles.settingbtn} onClick={handleLogout}>Logout</button>
            </div>
          }
        </div>
        <img className={styles.image} src="/appetite-ai.png" alt="Appetite AI Logo" />
      </div>
    </div>
  );
}

export default Settings;