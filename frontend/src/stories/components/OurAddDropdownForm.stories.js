import React from 'react';
import OurAddDropdownForm from 'main/components/OurAddDropdownForm';
import { schoolsListFixtures } from 'fixtures/schoolsListFixtures';

export default {
    title: 'components/OurAddDropdownForm',
    component: OurAddDropdownForm,
};

const Template = (args) => {
    return <OurAddDropdownForm {...args} />;
};

export const Sample = Template.bind({});

Sample.args = {
    content: [
        { label: 'option 1', key: 'option 1' },
        { label: 'option 2', key: 'option 2' },
        { label: 'option 3', key: 'option 3' }
    ],
    label : "Sample Dropdown",
    basis : null,
    testId : "test-sample-dropdown",
    register : null,
    htmlFor : "sampleDropdown"
};

export const Empty = Template.bind({});

Empty.args = {
    content: [],
    label : "Sample Empty Dropdown",
    basis : null,
    testId : "test-sample-dropdown",
    register : null,
    htmlFor : "sampleEmptyDropdown"
};

export const OneSchoolRender = Template.bind({});

OneSchoolRender.args = {
    basis: null,
    content: schoolsListFixtures.oneSchool,
    testId : "test-sample-dropdown",
    label : "Sample One Dropdown",
    register : null,
    htmlFor : "sampleOneDropdown"
};

export const TenSchoolRender = Template.bind({});

TenSchoolRender.args = {
    basis: schoolsListFixtures.tenSchool[1],
    content: schoolsListFixtures.tenSchool,
    testId : "test-sample-dropdown",
    label : "Sample Ten Dropdown",
    autocomplete : true,
    register : null,
    htmlFor : "sampleTenDropdown",
}

export const OneSchoolRenderNoAuto = Template.bind({});

OneSchoolRenderNoAuto.args = {
    basis: null,
    content: schoolsListFixtures.oneSchool,
    testId : "test-sample-dropdown",
    label : "Sample One Dropdown",
    autocomplete : false,
    register : null,
    htmlFor : "sampleOneDropdownNoAuto"
};

export const TenSchoolRenderNoAuto = Template.bind({});

TenSchoolRenderNoAuto.args = {
    basis: schoolsListFixtures.tenSchool[1],
    content: schoolsListFixtures.tenSchool,
    testId : "test-sample-dropdown",
    label : "Sample Ten Dropdown",
    autocomplete : false,
    register : null,
    htmlFor : "sampleTenDropdownNoAuto"
}