import React from 'react';
import ReactDOM from 'react-dom/client';
import App from '~/App';
import { AuthProvider } from '~/context/AuthProvider';
import GlobalStyles from '~/components/GlobalStyles';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    // <React.StrictMode>
    <GlobalStyles>
        <AuthProvider>
            <App />
        </AuthProvider>
    </GlobalStyles>,
    // </React.StrictMode>,
);
