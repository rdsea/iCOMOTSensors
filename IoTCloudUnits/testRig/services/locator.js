import { testLocator } from '../data/testData';

var locator = testLocator

export function getLocator(){
    return locator;
}

export function turn(radian){
    radian = parseInt(radian);
    locator = locator + radian;
    return locator;
}