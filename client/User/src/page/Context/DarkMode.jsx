import React, { createContext, useState } from 'react'

export const contextDarkMode = createContext(0)
export default function DarkMode(props) {

    const [dark, setDark] = useState(false)


    function darkMode(){
        setDark(true)
    }

    function lightMode(){
        setDark(false)
    }

  return (<contextDarkMode.Provider value={{dark ,darkMode ,lightMode}}>
    {props.children}
  </contextDarkMode.Provider>
    
  )
}
