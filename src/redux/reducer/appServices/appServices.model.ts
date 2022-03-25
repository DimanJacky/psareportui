import { createSlice } from '@reduxjs/toolkit';

import {
    IAllProjects,
    IBusinessEntity,
    ISpecialization,
    IProjectRoles,
    IProjectClients
} from './types';

const initialState: IServicesDataState = {
    loading: true,
    error: {
        status: false,
        message: '',
    },
    businessEntities: [],
    specializations: [],
    projects: [],
    projectRoles: [],
    projectClients: [],
};

const appServicesSlice = createSlice({
    name: 'appServices',
    initialState,
    reducers: {
        setBusinessEntities(state, action) {
            state.businessEntities = action.payload.map((entity: IBusinessEntity) => ({
                value: entity.id.toString(),
                label: entity.name
            }));
        },
        setSpecializations(state, action) {
            state.specializations = action.payload.map((entity: ISpecialization) => ({
                value: entity.id.toString(),
                label: entity.name
            }));
        },
        setAllProject(state, action) {
            state.projects = action.payload.map((entity: IAllProjects) => ({
                value: entity.id.toString(),
                label: entity.name
            }));
        },
        setProjectRoles(state, action) {
            state.projectRoles = action.payload.map((entity: IProjectRoles) => ({
                value: entity.id.toString(),
                label: entity.name
            }));
        },
        setProjectClients(state, action) {
            state.projectClients = action.payload.map((client: IProjectClients) => ({
                value: client.id.toString(),
                label: client.name
            }));
        },
        setError(state, action) {
            state.error = action.payload;
        },
        setLoading(state, action) {
            state.loading = action.payload;
        },
    },
});

export const appServicesReducer = appServicesSlice.reducer;

export const {
    setLoading,
    setError,
    setBusinessEntities,
    setSpecializations,
    setAllProject,
    setProjectRoles,
    setProjectClients
} = appServicesSlice.actions;

export interface IServicesDataState {
    loading: boolean,
    error: {
        status: boolean;
        message: string;
    };
    businessEntities: { value: string, label: string }[];
    specializations: { value: string, label: string }[];
    projects: { value: string, label: string }[];
    projectRoles: { value: string, label: string }[];
    projectClients: { value: string, label: string }[];
}
