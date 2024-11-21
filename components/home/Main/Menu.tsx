"use client";
import {LuPanelLeft} from "react-icons/lu";
import Button from "@/components/common/Button";
import {useAppContext} from "@/components/AppContext";

export default function Menu() {
    const {state: {displayNavigation}, setState} = useAppContext()
    return (
        <main
            className={`${displayNavigation ? "hidden" : ""} fixed left-2 top-2`}>
            <Button icon={LuPanelLeft} variant="outline" onClick={() => setState((prevState) => {
                return {
                    ...prevState,
                    displayNavigation: true
                }
            })}/>
        </main>
    );
}
