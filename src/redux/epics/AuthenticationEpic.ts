import { map, mergeMap, catchError } from 'rxjs/operators'
import { of } from 'rxjs'

import {ActionsObservable, combineEpics, ofType} from 'redux-observable'
import _ from 'lodash';

import { actions } from '../actions/AuthenticationAction';
import GHNAPI from '../api/AuthenticationApi';
import { Login, LoginType } from "../types/Authentication";

const loginUserT62Epic= (action$: ActionsObservable<any>)=>
    action$.pipe(
        ofType<Login>(LoginType.start),
        map(action => action.payload),
        mergeMap(({ authorcode }) => 
            GHNAPI.loginApi(authorcode).pipe(
                map( ({data}) => {
                    const response = data;
                    switch (response.status) {
                        case 'OK':{
                            const { userInfo, session = '', hubId = [] } = response.data[0]
                            if(userInfo.hasOwnProperty('roles')){
                                let roles = userInfo.roles
                                let isDriverPermission = true
                                const { 
                                    profile = {
                                        email: '',
                                        fullname: '',
                                        phone:'',
                                    },
                                    ssoId = ''
                                } = userInfo
                                if(isDriverPermission) {
                                    return actions.loginSuccess({ 
                                        email: profile.email,
                                        hubId: "2294", 
                                        token: session ?? '', 
                                        username: profile.fullname,
                                        roles: roles?.[0]?.permissionList ?? [],
                                        ssoId: ssoId
                                })
                                } else return actions.loginError('Bạn không có quyền thao tác')

                            } else return actions.loginError('Bạn không có quyền thao tác');}
                        case 'NOT_FOUND':
                            return actions.loginError('SERVICE NOT FOUND')
                        default:
                            return actions.loginError(response.message);
                    }
                }),
                catchError(error => 
                    of(actions.loginError(error.message))
                )
            )
        )
    )

export default combineEpics(
    // loginUserT62Epic,
);
