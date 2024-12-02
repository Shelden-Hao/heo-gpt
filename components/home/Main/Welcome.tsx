import React from 'react';
import ModelSelect from "@/components/home/Main/ModelSelect";
import Example from "@/components/home/Main/Example";

function Welcome() {
    return (
        <div className='w-full max-w-4xl mx-auto flex flex-col items-center px-4 py-20'>
            <ModelSelect />
            <h1 className='mt-20 text-4xl font-bold'>
                ChatGPT免费使用 - GPT4 & GPT3.5-turo
            </h1>
            <Example />
        </div>
    );
}

export default Welcome;
