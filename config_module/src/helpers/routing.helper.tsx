import React from 'react';
import { Route, Redirect, RouteProps } from 'react-router-dom';
import { userIsLogged } from '../helpers/session.helper';

interface AnyRouteProps extends RouteProps {
  component?: any;
  children?: any;
}

export function PublicRoute(props: AnyRouteProps) {
  const { component: Component, ...rest } = props;
  return <Route {...rest} render={props => (!userIsLogged() ? <Component {...props} /> : <Redirect to={{ pathname: '/websites' }} />)} />;
}

export function PrivateRoute(props: AnyRouteProps) {
  const { component: Component, ...rest } = props;
  return (
    <Route
      {...rest}
      render={props => (userIsLogged() ? <Component {...props} /> : <Redirect to={{ pathname: '/login', state: { from: props.location } }} />)}
    />
  );
}
