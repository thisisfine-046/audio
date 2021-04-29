import { useState, useEffect } from "react"
import axios from "axios"

export default function useAuth(code) {
  const [accessToken, setAccessToken] = useState()
  const [refreshToken, setRefreshToken] = useState()
  const [expiresIn, setExpiresIn] = useState()

  useEffect(() => {
    axios
        .post("http://127.0.0.1:8000/login", {
        code,
    })
        .then(res => {
            console.log(res.data)
        })
        .catch(() => {
    })
  }, [code])
}