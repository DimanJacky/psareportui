import React, { ComponentProps } from 'react';
import classNames from 'classnames';
import css from './paper.module.scss';


export const Paper = (props: ComponentProps<any>) => {
    return (
        <div className={classNames(css.paper, props.className)}>
            {props.children}
        </div>
    );
};
