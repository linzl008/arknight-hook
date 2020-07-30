import React, {    useEffect } from 'react';
import { withRouter, Redirect } from 'react-router-dom'
import { Route, Switch } from 'react-router-dom'
import { routeList  } from '@/routes/routeList';

const MyLayout = (/*props: any*/)=>{
    let route = routeList[0]
    useEffect(()=>{
        // console.log(props);
    },[])
    return (
        <div>
            <Switch>
                <Route path={route.path} exact strict component={route.component} />
                <Redirect from="/" to="/character"/>
            </Switch>
        </div>
    )
}
export default withRouter(MyLayout);
