import { configureStore } from '@reduxjs/toolkit';
import { useAuthStore } from '../../src/hooks/useAuthStore';
import { authSlice } from '../../src/store';
import { act, renderHook, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { initialState, authenticatedState, notAuthenticatedState } from '../fixtures/authStates';
import { testUserCredentials } from '../fixtures/testUser';
import { calendarApi } from '../../src/api';

const getMockStore = ( initialState ) => {
    return configureStore({
        reducer: {
            auth: authSlice.reducer
        },
        preloadedState: {
            auth: { ...initialState }
        }
    });
};

describe('test on useAuthStore', () => { 

    beforeEach(() => localStorage.clear() );

    test('should return the default values', () => { 

        const mockStore = getMockStore(initialState);

        const { result } = renderHook(() => useAuthStore(), {
            wrapper: ({children}) => <Provider store={mockStore}>{ children }</Provider>
        });
        
        expect(result.current).toEqual({
            status: 'checking',
            user: {},
            errorMessage: undefined,
            startLogin: expect.any(Function),
            startRegister: expect.any(Function),
            checkAuthToken: expect.any(Function),
            startLogout: expect.any(Function)
        });

    });

    test('startLogin should login correctly', async() => { 
        
        const mockStore = getMockStore({ ...notAuthenticatedState});
        const { result } = renderHook( () => useAuthStore(), {
            wrapper: ({children}) => <Provider store={mockStore}>{children}</Provider>
        });

        await act(async() => {
            await result.current.startLogin(testUserCredentials);
        });

        const { errorMessage, status, user } = result.current;
        expect({ errorMessage, status, user }).toEqual({
            errorMessage: undefined,
            status: 'authenticated',
            user: { name: 'Test', uid: '654856db9ba6b58f85330ab3' }
        });      

        expect(localStorage.getItem('token')).toEqual(expect.any(String));
        expect(localStorage.getItem('token-time')).toEqual(expect.any(String));
    });

    test('startLogin should fail the authentication', async() => { 

        const mockStore = getMockStore({ ...notAuthenticatedState});
        const { result } = renderHook( () => useAuthStore(), {
            wrapper: ({children}) => <Provider store={mockStore}>{children}</Provider>
        });

        await act(async() => {
            await result.current.startLogin({ email: 'whatever1@google.com', password: 'somethingggg'});
        });
        
        const { errorMessage, status, user } = result.current;

        expect(localStorage.getItem('token')).toBeNull();
        expect({errorMessage, status, user}).toEqual({
            status: 'not-authenticated',
            user: {},
            errorMessage: 'Incorrect credentials'
        });

        await waitFor( 
            () => expect( result.current.errorMessage).toBe(undefined)
        );

    });

    test('startRegister should register a user', async() => { 

        const newUser = { email: 'whatever@google.com', password: 'something', name: 'Something User'};
        const mockStore = getMockStore({ ...notAuthenticatedState});
        const { result } = renderHook( () => useAuthStore(), {
            wrapper: ({children}) => <Provider store={mockStore}>{children}</Provider>
        });

        const spy = jest.spyOn(calendarApi, 'post').mockReturnValue({
            data: {
                ok: true,
                uid: "TEST-UID",
                name: "TEST-NAME",
                token: "TEST-TOKEN"
            }
        })

        await act(async() => {
            await result.current.startRegister(newUser);
        });

        const { errorMessage, user, status } = result.current;

        expect({ errorMessage, user, status }).toEqual({
            errorMessage: undefined,
            user: { name: 'TEST-NAME', uid: 'TEST-UID' },
            status: 'authenticated',
        });

        spy.mockRestore();

    });

    test('startRegister should fail with the creation of user', async() => { 

        const mockStore = getMockStore({ ...notAuthenticatedState});
        const { result } = renderHook( () => useAuthStore(), {
            wrapper: ({children}) => <Provider store={mockStore}>{children}</Provider>
        });

        await act(async() => {
            await result.current.startRegister(testUserCredentials);
        });
        
        const { errorMessage, user, status } = result.current;

        expect({ errorMessage, user, status }).toEqual({
            errorMessage: 'There is a user with that email',
            status: 'not-authenticated',
            user: {}
        });
        
    });

    test('checkAuthToken should fail if there is not a token', async() => { 
        
        const mockStore = getMockStore({ ...authenticatedState});
        const { result } = renderHook( () => useAuthStore(), {
            wrapper: ({children}) => <Provider store={mockStore}>{children}</Provider>
        });

        await act(async() => {
            await result.current.checkAuthToken();
        });

        const { errorMessage, user, status } = result.current;

        expect({ errorMessage, user, status }).toEqual({
            status: 'not-authenticated',
            user: {},
            errorMessage: undefined
        });

    });

    test('checkAuthToken should validate the user', async() => { 

        const { data } = await calendarApi.post('/auth', testUserCredentials);
        localStorage.setItem('token', data.token);

        const mockStore = getMockStore({ ...authenticatedState});
        const { result } = renderHook( () => useAuthStore(), {
            wrapper: ({children}) => <Provider store={mockStore}>{children}</Provider>
        });

        await act(async() => {
            await result.current.checkAuthToken();
        });

        const { errorMessage, user, status } = result.current;
        
        expect({ errorMessage, user, status }).toEqual({
            errorMessage: undefined,
            user: { name: 'Test', uid: '654856db9ba6b58f85330ab3' },
            status: 'authenticated'
        });


    });

}); 