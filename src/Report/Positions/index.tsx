import React, { useState } from 'react';
import Container from 'components/Container';
import SearchForm from './SearchForm';
import Results from './Results';
import { FormProvider } from '../FormProvider';

export default () => {
    const [searchData, setSearchData] = useState({});

    return (
        <Container>
            <FormProvider setSearchData={setSearchData} searchData={searchData}>
                <SearchForm />
                <Results />
            </FormProvider>
        </Container>
    );
};
