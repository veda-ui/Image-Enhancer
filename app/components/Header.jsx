"use client"; 

import Link from "next/link";
import { logout } from "../../actions/Usercontrolls";
import { useEffect, useState } from "react";
import { redirect } from "next/navigation";

export default function Header() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  async function checkAuth() {
    try {
      const response = await fetch("/api/auth-status");  
      const data = await response.json();
      setIsAuthenticated(data.isAuthenticated);
    } catch (error) {
      console.error("Error checking authentication:", error);
    }
  }

  useEffect(() => {
   
    checkAuth();
  }, []);
  useEffect(()=>{
    const interval  = setInterval( ()=>{
        checkAuth()},1000
        )
        return ()=>{
            clearInterval(interval)
        }


},[])

  const handleLogout = async () => {
    await logout();
    setIsAuthenticated(false);
    redirect("/")

  };

  return (
    <header>
      <div className="navbar bg-white shadow-md
">
        <div className="Container mx-auto">
          <Link href="/" className="btn btn-ghost ml-20 mx-auto text-xl">
            ImageEnhancer
          </Link>
        </div>
        {!isAuthenticated && (
          <>
            <div className="flex-none">
              <Link href="/register" className="btn btn-square btn-neutral w-20 ">Register</Link>
            </div>
            <div className="flex-none">
              <Link href="/login" className="btn btn-square btn-neutral w-20 ml-7">Login</Link>
            </div>
          </>
        )} 
        
        {isAuthenticated && (
          <div className="flex-none">
            <button onClick={handleLogout} className="btn btn-neutral">
              Logout
            </button>
          </div>
        )
      }
      </div>
    </header>
  );
}
