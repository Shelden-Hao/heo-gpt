"use client"
import React from 'react';
import Button from "@/components/common/Button";
import {useAppContext} from "@/components/AppContext";
import {MdDarkMode, MdInfo, MdLightMode} from "react-icons/md";

function Toolbar() {
    const {state: {themeMode}, setState} = useAppContext()
    return (
        <div className={`absolute left-0 right-0 bottom-0 dark:bg-gray-800 dark:border-gray-800 border-t-2 flex p-2 justify-between`}>
            <Button icon={themeMode === 'dark' ? MdDarkMode : MdLightMode} variant="text"
                    onClick={() => {
                        setState((prevState) => {
                            return {
                                ...prevState,
                                themeMode: prevState.themeMode === 'dark' ? 'light' : 'dark'
                            }
                        })
                    }}/>
            <Button icon={MdInfo} variant="text"/>
        </div>
    );
}

export default Toolbar;
