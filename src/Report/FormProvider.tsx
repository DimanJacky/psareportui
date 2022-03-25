import React, { ComponentProps, createContext, useContext } from 'react';

import type { TFormDataType } from 'types';

const defaultContextValue = {
    searchData: {},
    setSearchData: (data: any) => (data),
    formDataFromParams: (allowedFields: TFormDataType, initialFormData: TFormDataType) => {
        const search = window.location.search;
        const searchParams = new URLSearchParams(search);

        for(const pair of searchParams.entries()) {
            const name = pair[0];
            const value = pair[1];

            const originalName = name.replace(/\[\d+\]/, '');

            if(allowedFields[originalName] !== undefined) {
                if(typeof allowedFields[name] === 'number')
                    initialFormData = { ...initialFormData, [name]: +value };
                else if(Array.isArray(allowedFields[originalName])) {
                    initialFormData = { ...initialFormData, [originalName]: value.toString().split(',').filter(v => !!v) };
                } else
                    initialFormData = { ...initialFormData, [name]: value };
            }
        }

        return initialFormData;
    }
};


const FormContext = createContext<ComponentProps<any>>(defaultContextValue);

const FormProvider = (props: ComponentProps<any>) => {
    return (
        <FormContext.Provider value={{ ...defaultContextValue, ...props }}>
            {props.children}
        </FormContext.Provider>
    );
};

const useForm = () => {
    return useContext(FormContext);
};


export { FormProvider, useForm, FormContext };
