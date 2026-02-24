import { createContext } from "react";

export const authcontext =  createContext(null);


const Authcontext = (props) => {

  const url = "http://localhost:3000"

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
