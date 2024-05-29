import React from 'react';
import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import { staffFixture } from "fixtures/staffFixture";
import { rest } from "msw";

import StaffIndexPage from "main/pages/StaffIndexPage";

export default {
    title: 'pages/Staff/StaffIndexPage',
    component: StaffIndexPage
};

const Template = () => <StaffIndexPage storybook={true}/>;

export const Empty = Template.bind({});
Empty.parameters = {
    msw: [
        rest.get('/api/currentUser', (_req, res, ctx) => {
            return res(ctx.json(apiCurrentUserFixtures.adminUser));
        }),
        rest.get('/api/systemInfo', (_req, res, ctx) => {
            return res(ctx.json(systemInfoFixtures.showingNeither));
        }),
        rest.get('/api/courses/1/staff', (_req, res, ctx) => {
            return res(ctx.json([]));
        }),
        rest.delete('/api/staff/delete', (req, res, ctx) => {
            window.alert("DELETE: " + JSON.stringify(req.url));
            return res(ctx.status(200), ctx.json({}));
        }),
    ]
};

export const ThreeItemsInstructorUser = Template.bind({});

ThreeItemsInstructorUser.parameters = {
    msw: [
        rest.get('/api/currentUser', (_req, res, ctx) => {
            return res(ctx.json(apiCurrentUserFixtures.instructorUser));
        }),
        rest.get('/api/systemInfo', (_req, res, ctx) => {
            return res(ctx.json(systemInfoFixtures.showingNeither));
        }),
        rest.get('/api/courses/1/staff', (_req, res, ctx) => {
            return res(ctx.json(staffFixture.threeStaff));
        }),
        rest.delete('/api/staff/delete', (req, res, ctx) => {
            window.alert("DELETE: " + JSON.stringify(req.url));
            return res(ctx.status(200), ctx.json({}));
        }),
    ],
};

export const ThreeItemsAdminUser = Template.bind({});

ThreeItemsAdminUser.parameters = {
    msw: [
        rest.get('/api/currentUser', (_req, res, ctx) => {
            return res(ctx.json(apiCurrentUserFixtures.adminUser));
        }),
        rest.get('/api/systemInfo', (_req, res, ctx) => {
            return res(ctx.json(systemInfoFixtures.showingNeither));
        }),
        rest.get('/api/courses/1/staff', (_req, res, ctx) => {
            return res(ctx.json(staffFixture.threeStaff));
        }),
        rest.delete('/api/staff/delete', (req, res, ctx) => {
            window.alert("DELETE: " + JSON.stringify(req.url));
            return res(ctx.status(200), ctx.json({}));
        }),
    ],
};
