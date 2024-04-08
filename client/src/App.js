import { Fragment } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { publicRoutes, privateRoutes } from '~/routes';
import 'react-toastify/dist/ReactToastify.css';

import DefaultLayout from '~/layout/DefaultLayout';
import { RequireAuth, NoRequireAuth } from '~/components/RequireAuth';

function App() {
    return (
        <>
            <Router>
                <div className="App">
                    <Routes>
                        {publicRoutes.map((route, index) => {
                            const Layout = route.layout === null ? Fragment : DefaultLayout;
                            const Page = route.component;
                            return (
                                <Route key={index} element={<NoRequireAuth />}>
                                    <Route
                                        path={route.path}
                                        element={
                                            <Layout>
                                                <Page />
                                            </Layout>
                                        }
                                    />
                                </Route>
                            );
                        })}
                        {privateRoutes.map((route, index) => {
                            const Layout = route.layout === null ? Fragment : DefaultLayout;
                            const Page = route.component;
                            return (
                                <Route key={index} element={<RequireAuth allowedRoles={route.allowedRoles} />}>
                                    <Route
                                        path={route.path}
                                        element={
                                            <Layout>
                                                <Page />
                                            </Layout>
                                        }
                                    />
                                </Route>
                            );
                        })}
                    </Routes>
                </div>
            </Router>
            <ToastContainer />
        </>
    );
}

export default App;
