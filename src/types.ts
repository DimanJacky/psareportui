export type NotificationType = {
    type: string,
    title?: string,
    message?: string
};

export type TFormDataType = {
    [key: string]: string | number | number[] | string[]
};

export type IDate = {
    start: string | null;
    finish: string | null;
}

export type TOrderBy = {
    [key: string]: string
};
