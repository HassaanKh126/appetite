'use client'
import React, { useEffect, useState } from "react";
import styles from "./login.module.css";

const Login = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)

    const getToken = () => {
            const token = localStorage.getItem("appetite_token");
            if (token) {
                window.location.href = "/"
            }
        }
    
        useEffect(() => {
            getToken()
        }, [])
    

    const handleLogin = async (e) => {
        e.preventDefault()
        try {
            setLoading(true)
            const response = await fetch(`${process.env.NEXT_PUBLIC_BURL}/login`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            })

            const data = await response.json()
            if (data.message === "Login successful") {
                localStorage.setItem("appetite_token", data.token)
                window.location.href = '/'
            }
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className={styles.lpage}>
            <div className={styles.lhero}>
                <img className={styles.chefimage} src="/appetite-ai.png" alt="Appetite AI Logo" />
                <div className={styles.container}>
                    <h1 className={styles.ltitle}>Appetite AI</h1>
                    <h2 className={styles.ldescription}>Log In</h2>
                    <form onSubmit={handleLogin}>
                        <input id="email" value={email} onChange={(e) => { setEmail(e.target.value) }} className={styles.input} type="email" placeholder="Email" required />
                        <input id="password" value={password} onChange={(e) => { setPassword(e.target.value) }} className={styles.input} type="password" placeholder="Password" required />
                        <button type="submit" className={styles.lbutton} disabled={loading}>{loading ? ("Loading..."):("Log In")}</button>
                    </form>
                    <a className={styles.bottomText} href="/register">{"Don't have an account? Register."}</a>
                </div>
            </div>
        </div>
    );
}

export default Login;