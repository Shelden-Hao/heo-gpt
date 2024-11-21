import React, {ComponentPropsWithRef} from 'react';

function Button({children, className, ...props}: ComponentPropsWithRef<'button'>) {
    return (
        <button className={`border border-gray-600 rounded px-3 py-1.5 hover:bg-gray-800 active:bg-gray-700 ${className}`} {...props}>{children}</button>
    );
}

export default Button;
