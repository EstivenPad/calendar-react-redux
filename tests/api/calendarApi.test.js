import calendarApi from '../../src/api/calendarApi';

describe('test on CalendarApi', () => { 
    
    test('should have the default configuration', () => { 
        // console.log(calendarApi);
        // console.log(process.env);
        expect(calendarApi.defaults.baseURL ).toBe( process.env.VITE_API_URL );
    
    });


    test('should have the x-token in the header of every request', async () => { 
       
        localStorage.setItem('token','ABC-123-XYZ');
        const res = await calendarApi.post('/auth', { email: 'estiven@gmail.com', password: '123456'});

        expect(res.config.headers['x-token']).toBe('ABC-123-XYZ');
    });
 });