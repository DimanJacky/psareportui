import React, { ComponentProps } from 'react';

const Container = (props: ComponentProps<any>) => {

    return (
        <div className="page-body">
            {props.children}
        </div>
    );
};

export default Container;
