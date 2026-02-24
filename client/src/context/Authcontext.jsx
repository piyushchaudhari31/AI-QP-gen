import { createContext } from "react";

export const authcontext =  createContext(null);


const Authcontext = (props) => {

  const url = "https://ai-qp-gen-backend.onrender.com"

  const module = {
    url
  }
  return (
    <div>
      <authcontext.Provider value={module}>
        {props.children}    
      </authcontext.Provider>
    </div>
  )
}

export default Authcontext
