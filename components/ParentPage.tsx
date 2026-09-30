import React,{useEffect} from 'react';import {router} from 'expo-router';import {useAppStore} from '../store/useAppStore';import {Screen} from './ui';
export function ParentPage({children}:{children:React.ReactNode}){const allowed=useAppStore(s=>s.parentUnlocked);useEffect(()=>{if(!allowed)router.replace('/parent-gate')},[allowed]);return allowed?<Screen>{children}</Screen>:<Screen/>}
