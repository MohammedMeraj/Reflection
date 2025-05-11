
"use client"
import { LoginLink, LogoutLink, RegisterLink } from '@kinde-oss/kinde-auth-nextjs/components'
import React from 'react'

const Login = () => {
  return (
    <div>
       
     <LoginLink>Login</LoginLink>

     <RegisterLink>Register</RegisterLink>
     <LogoutLink>LogOut</LogoutLink>


    </div>
  )
}

export default Login