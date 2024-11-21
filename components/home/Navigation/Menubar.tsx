import React from 'react';
import Button from "@/components/common/Button";
import {HiPlus} from "react-icons/hi";
import {LuPanelLeft} from "react-icons/lu";
import {useAppContext} from "@/components/AppContext";

function Menubar() {
    const {setState} = useAppContext()
    return (
        <div className="flex space-x-3">
            <Button icon={HiPlus} variant="outline" className="flex-1">新建对话</Button>
            <Button icon={LuPanelLeft} variant="outline" onClick={() => setState((prevState) => {
                return {
                    ...prevState,
                    displayNavigation: false
                }
            })} />
        </div>
    );
}

export default Menubar;
