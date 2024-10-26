import React from "react";
import { useAuth0 } from "@auth0/auth0-react";

const TicketHeader = () => {
    
    const { loginWithRedirect, logout, isAuthenticated, user } = useAuth0();

    return(
        <div className="header">
            {isAuthenticated ? (
                <>
                    <button onClick={() => window.location.href = '/'}>Home</button>
                    <span>User: {user.email}</span>
                    <button onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}>Log Out</button>
                </>
            ) : (
                <button className="logButton" onClick={async () => await loginWithRedirect()}>Log In</button>
            )}
        </div>
    )
}

export default TicketHeader;