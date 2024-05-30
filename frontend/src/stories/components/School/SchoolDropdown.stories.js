import { schoolsFixtures } from "fixtures/schoolsFixtures";
import SchoolDropdown from "main/components/School/SchoolDropdown";
import React from "react";
import { rest } from "msw";

export default {
    title: 'components/School/SchoolDropdown',
    component: SchoolDropdown
};

const Template = () => <SchoolDropdown register={null}/>;

export const Empty = Template.bind({});
Empty.parameters = {
    msw: [
        rest.get('/api/schools/all', (_req, res, ctx) => {
            return res(ctx.json([]));
        })
    ]
}

export const OneSchool = Template.bind({});
OneSchool.parameters = {
    msw: [
        rest.get('/api/schools/all', (_req, res, ctx) => {
            return res(ctx.json([schoolsFixtures.oneSchool]));
        })
    ]
}

export const ThreeSchools = Template.bind({});
ThreeSchools.parameters = {
    msw: [
        rest.get('/api/schools/all', (_req, res, ctx) => {
            return res(ctx.json(schoolsFixtures.threeSchools));
        })
    ]
}