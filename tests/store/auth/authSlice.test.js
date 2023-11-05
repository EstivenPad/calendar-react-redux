import { authSlice, cleanErrorMessage, onLogin, onLogout } from '../../../src/store/auth/authSlice';
import { authenticatedState, initialState } from '../../fixtures/authStates';
import { testUserCredentials } from '../../fixtures/testUser';

describe('test on authSlice', () => { 

    test('should return the initial state', () => { 
        
        expect( authSlice.getInitialState() ).toEqual( initialState );

    });

    test('should login', () => { 

        const state = authSlice.reducer(initialState, onLogin(testUserCredentials));
        expect(state).toEqual({
            status: 'authenticated',
            user: testUserCredentials,
            errorMessage: undefined
        });

     });

    test('should logout', () => { 
        
        const state = authSlice.reducer( authenticatedState, onLogout() );
        expect(state).toEqual({
            status: 'not-authenticated',
            user: {},
            errorMessage: undefined
        })

     });

     test('should logout with errorMessage', () => { 
        
        const error = 'Error with the credentials';
        const state = authSlice.reducer( authenticatedState, onLogout(error) );
        
        expect(state).toEqual({
            status: 'not-authenticated',
            user: {},
            errorMessage: error
        })

     });

     test('should clean up the errorMessage', () => { 

        const error = 'Error with the credentials';
        const state = authSlice.reducer(authenticatedState, onLogout(error));
        const newState = authSlice.reducer(state, cleanErrorMessage())

        expect(newState.errorMessage).toBe(undefined);

      });

});