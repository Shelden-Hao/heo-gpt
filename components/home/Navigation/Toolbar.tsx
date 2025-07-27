"use client"
import React from 'react';
import Button from "@/components/common/Button";
import {useAppContext} from "@/components/AppContext";
import {MdDarkMode, MdInfo, MdLightMode, MdScience} from "react-icons/md";
import {ActionType} from "@/reducers/AppReducers";

function Toolbar() {
    const {state: {themeMode}, dispatch} = useAppContext()
    return (
        <div className={`absolute left-0 right-0 bottom-0 bg-gray-50 dark:bg-gray-800 dark:border-gray-800 border-t-2 flex p-2 justify-between`}>
            <div className="flex space-x-1">
                <Button icon={themeMode === 'dark' ? MdDarkMode : MdLightMode} variant="text"
                        onClick={() => {
                            dispatch({
                                type: ActionType.UPDATE,
                                field: "themeMode",
                                value: themeMode === 'dark' ? 'light' : 'dark'
                            })
                        }}/>
                <a href="/test-openai" target="_blank" rel="noopener noreferrer">
                    <Button icon={MdScience} variant="text" title="测试SILICONFLOW API"/>
                </a>
            </div>
            <Button icon={MdInfo} variant="text"/>
        </div>
    );
}

export default Toolbar;
