import React, { createContext, useState } from 'react'

export const contextDarkMode = createContext(0)
export default function DarkMode(props) {

    const [dark, setDark] = useState(true)


    function darkMode(){
        setDark(false)
    }

    function lightMode(){
        setDark(true)
    }

  return (<contextDarkMode.Provider value={{dark ,darkMode ,lightMode}}>
    {props.children}
  </contextDarkMode.Provider>
    
  )
}
