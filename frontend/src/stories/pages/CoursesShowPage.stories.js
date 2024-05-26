import React from 'react';
import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import { coursesFixtures } from "fixtures/coursesFixtures";
import { rest } from "msw";

import CoursesShowPage from "main/pages/CoursesShowPage";

export default {
    title: 'pages/Courses/CoursesShowPage',
    component: CoursesShowPage
};

const Template = () => <CoursesShowPage/>;

export const Default = Template.bind({});
Default.parameters = {
    msw: [
        rest.get('/api/currentUser', (_req, res, ctx) => {
            return res( ctx.json(apiCurrentUserFixtures.adminUser));
        }),
        rest.get('/api/systemInfo', (_req, res, ctx) => {
            return res(ctx.json(systemInfoFixtures.showingNeither));
        }),
        rest.get('/api/courses/get', (_req, res, ctx) => {
            return res(ctx.json(coursesFixtures.threeCourses[0]));
        }),
    ],
}