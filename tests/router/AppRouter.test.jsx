import { render, screen } from '@testing-library/react';
import { AppRouter } from '../../src/router/AppRouter';
import { useAuthStore } from '../../src/hooks/useAuthStore';

jest.mock('../../src/hooks/useAuthStore');

describe('test on <AppRouter/>', () => { 
    
    const mockCheckAuthToken = jest.fn();

    beforeEach( () => jest.clearAllMocks() );

    test('should display the loading and call the checkAuthToken', () => { 
    
        useAuthStore.mockReturnValue({
            status: 'checking',
            checkAuthToken: mockCheckAuthToken
        });

        render(<AppRouter/>);

        expect(screen.getByText('Loading...')).toBeTruthy();
        expect(mockCheckAuthToken).toHaveBeenCalled();
    });

 });