import React from 'react';
import { HashRouter, Switch, Route } from "react-router-dom";
import loadable from "../utils/loadable";
const Layout = loadable(() => import("../pages/layout"));
export default function Routes() {
    return (
        <HashRouter>
            <Switch>
                <Route path="/"  component={Layout} />
            </Switch>
        </HashRouter>
    );
}
