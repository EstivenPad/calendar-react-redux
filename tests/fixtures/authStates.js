export const initialState = {
    status: 'checking',//Authenticated, Not-authenticated, Checking
    user: {},
    errorMessage: undefined
};

export const authenticatedState = {
    status: 'authenticated',//Authenticated, Not-authenticated, Checking
    user: {
        ui: 'abc',
        name: 'test name'
    },
    errorMessage: undefined
};

export const notAuthenticatedState = {
    status: 'not-authenticated',//Authenticated, Not-authenticated, Checking
    user: {},
    errorMessage: undefined
};