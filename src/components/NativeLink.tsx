import React, { ComponentProps } from 'react';


export default (props: ComponentProps<any>) => {
    const { to, ...rest } = props;

    const onClick = () => {
        // используем нативный редирект чтобы браузер запросил новые js файлики
        window.location.href = to;
    };

    return (
        <a href={to} {...rest} onClick={onClick}>{props.children}</a>
    );
};
