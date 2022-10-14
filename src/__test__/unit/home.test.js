import React from 'react';
import {shallow, configure} from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import Home from '../../routes/home-page/home';


configure({
    adapter: new Adapter()
})


describe('Unit Home page.', () => {
    test('Home page unit test', () => {
        shallow(<Home/>);
    });
})
