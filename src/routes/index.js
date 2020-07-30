import React from 'react';
import { HashRouter, Switch, Route } from "react-router-dom";
import AnimatedSwitch from "@/components/common/AnimatedSwitch"
const Layout =

export default function Routes() {
    return (
        <HashRouter>
            <AnimatedSwitch ></AnimatedSwitch>
            <Switch>
                <Route path="/" component={Layout} />
            </Switch>
        </HashRouter>
    );
}
