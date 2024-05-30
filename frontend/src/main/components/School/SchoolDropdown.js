import { useBackend } from 'main/utils/useBackend';
import React from "react";
import OurAddDropdownForm from '../OurAddDropdownForm';

export default function SchoolDropdown({register}){
    const { data: schools, error: _error, status: _status } =
    useBackend(
      // Stryker disable next-line all : don't test internal caching of React Query
      ["/api/schools/all"],
      // Stryker disable next-line all : GET is the default
      { method: "GET", url: "/api/schools/all" },
      []
    );

    const fixedSchools = [];
    for(let i = 0; i < schools.length; ++i){
        fixedSchools.push({
            label: schools[i].name,
            key: schools[i].name,
        });
    }

    return (
        <OurAddDropdownForm
            content={fixedSchools}
            label="Name"
            testId="school-dropdown"
            basis={null}
            register={register}
            htmlFor="name"
            autocomplete={true}
        />
    )
}

