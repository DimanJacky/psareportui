export default (businessEntity: string | undefined, department: string | undefined, group: string | undefined) => {
    return (businessEntity ? businessEntity : '') +
        (department ? ' / ' + department : '') +
        (group ? ' / ' + group : '');
};
