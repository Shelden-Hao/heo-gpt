"use client";
import {LuPanelLeft} from "react-icons/lu";
import Button from "@/components/common/Button";
import {useAppContext} from "@/components/AppContext";
import {ActionType} from "@/reducers/AppReducers";

export default function Menu() {
    const {state: {displayNavigation}, dispatch} = useAppContext()
    return (
        <main
            className={`${displayNavigation ? "hidden" : ""} fixed left-2 top-2`}>
            <Button icon={LuPanelLeft} variant="outline" onClick={() => {
                dispatch({
                    type: ActionType.UPDATE,
                    field: "displayNavigation",
                    value: true
                })
            }}/>
        </main>
    );
}
