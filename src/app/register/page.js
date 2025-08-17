'use client';

import React, { useEffect, useState } from "react";
import styles from "./register.module.css";

const Register = () => {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const getToken = () => {
        const token = localStorage.getItem("appetite_token");
        if (token) {
            window.location.href = "/"
        }
    }

    useEffect(() => {
        getToken()
    }, [])

    const handleSignup = async (e) => {
        e.preventDefault()

        if (password.length < 8) {
            alert("Password must consist of atleast 8 characters.")
            return;
        }

        setLoading(true)
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BURL}/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, email, password }),
            });

            if (response.ok) {
                window.location.href = '/login';
            } else {
                console.error("Signup failed");
                const data = await response.json()
                if (data.error === "Username already exists") {
                    alert("Username already exists!")
                }
                if (data.error === "Email already exists") {
                    alert("An account with this email already exists!")
                }
            }

        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false)
        }
    };

    return (
        <div className={styles.lpage}>
            <div className={styles.lhero}>
                <div className={styles.container}>
                    <h1 className={styles.ltitle}>Appetite AI</h1>
                    <h2 className={styles.ldescription}>Sign Up</h2>
                    <form onSubmit={handleSignup}>
                        <input id="username" className={styles.input} type="text" placeholder="Username" value={username} onChange={(e) => { setUsername(e.target.value) }} />
                        <input id="email" className={styles.input} type="email" placeholder="Email" value={email} onChange={(e) => { setEmail(e.target.value) }} />
                        <input id="password" className={styles.input} type="password" placeholder="Password" value={password} onChange={(e) => { setPassword(e.target.value) }} />
                        <button className={styles.lbutton} type="submit" disabled={loading}>{loading ? ("Loading...") : ("Sign Up")}</button>
                    </form>
                    <a className={styles.bottomText} href="/register">Already have an account? Login.</a>
                </div>
                <img className={styles.chefimage} src="/appetite-ai.png" alt="Appetite AI Logo" />
            </div>
        </div>
    );
}

export default Register;