import { Dispatch } from '@reduxjs/toolkit';

import { API } from 'helpers';
import settings from 'settings';
import { 
    setBusinessEntities,
    setSpecializations,
    setAllProject,
    setProjectRoles,
    setProjectClients, 
    setError
} from './appServices.model';

import {
    IAllProjects,
    IBusinessEntity,
    ISpecialization,
    IProjectRoles,
    IProjectClients
} from './types';

const prefixProject = settings.PROJECT_PATH;
const prefixEmployee = settings.EMPLOYEE_PATH;

const getAllProjectsPrefix = `${prefixProject}/allProjects/search`;
const getBusinessEntitiesPrefix = `${prefixEmployee}/dictionary/employee_structure_units`;
const getSpecializationsPrefix = `${prefixEmployee}/dictionary/specializations`;
const getProjectRolesPrefix = `${prefixProject}/dictionary/projectRoles`;
const getClientsPrefix = `${prefixProject}/allClients/search`;

export const getBusinessEntities = () => async (dispatch: Dispatch) => {
    try {
        const response = await API.get<IBusinessEntity[]>(getBusinessEntitiesPrefix, {
            params: {
                type: 'BUSINESS_ENTITY'
            }
        });

        dispatch(setBusinessEntities(response));
    } catch(error) {
        if(error instanceof Error) {
            console.warn({ error, message: 'Не смог получить данные по бизнес подразделениям' });
            dispatch(setError(error.message));
        }
    }
};

export const getSpecializations = () => async (dispatch: Dispatch) => {
    try {
        const response = await API.get<ISpecialization[]>(getSpecializationsPrefix);

        dispatch(setSpecializations(response));
    } catch(error) {
        if(error instanceof Error) {
            console.warn({ error, message: 'Не смог получить данные по бизнес подразделениям' });
            dispatch(setError(error.message));
        }
    }
};

export const getAllProjects = () => async (dispatch: Dispatch) => {
    try {
        const response = await API.get<IAllProjects[]>(getAllProjectsPrefix);

        dispatch(setAllProject(response));
    } catch(error) {
        if(error instanceof Error) {
            console.warn({ error, message: 'Не смог получить данные по бизнес подразделениям' });
            dispatch(setError(error.message));
        }
    }
};

export const getProjectRoles = () => async (dispatch: Dispatch) => {
    try {
        const response = await API.get<IProjectRoles[]>(getProjectRolesPrefix);

        dispatch(setProjectRoles(response));
    } catch(error) {
        if(error instanceof Error) {
            console.warn({ error, message: 'Не смог получить данные по бизнес подразделениям' });
            dispatch(setError(error.message));
        }
    }
};

export const getProjectClients = () => async (dispatch: Dispatch) => {
    try {
        const response = await API.get<IProjectClients[]>(getClientsPrefix);

        dispatch(setProjectClients(response));
    } catch(error) {
        if(error instanceof Error) {
            console.warn({ error, message: 'Не смог получить данные по бизнес подразделениям' });
            dispatch(setError(error.message));
        }
    }
};
