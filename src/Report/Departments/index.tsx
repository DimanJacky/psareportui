import React, { useState } from 'react';
import Container from 'components/Container';
import { FormProvider } from '../FormProvider';
import Results from './Results';

export default () => {
    const [searchData, setSearchData] = useState({});

    return (
        <Container>
            <FormProvider setSearchData={setSearchData} searchData={searchData}>
                <Results />
            </FormProvider>
        </Container>
    );
};
