import type { TFormDataType } from 'types';

export const serializer = (formData: TFormDataType) => {
    const object = Object.entries(formData);

    for(const [key, item] of object) {
        if(typeof item === 'object' && item) {
            formData[key] = item.join(',');
        }
    }

    return formData;
};
