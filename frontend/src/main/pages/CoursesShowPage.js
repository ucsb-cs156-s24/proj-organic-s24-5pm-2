import React from 'react';
import { useParams } from 'react-router-dom';
import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import CoursesTable from 'main/components/Courses/CoursesTable';
import { useBackend } from 'main/utils/useBackend';
import { useCurrentUser } from 'main/utils/currentUser';

export default function CoursesShowPage() {
    let { id } = useParams();
    const { data: currentUser } = useCurrentUser();

    const { data: courses, error: _error, status: _status } =
        useBackend(
            // Stryker disable next-line all : don't test internal caching of React Query
            [`/api/courses?id=${id}`],

            { // Stryker disable next-line all : GET is the default
                method: "GET", url: "/api/courses/get",
                params: {
                    id
                },
            },
    []
        );
    let allowed;
        if(courses.length !== 0){
            allowed = [courses]
        }
        else{
            allowed = courses;
        }

    return (
        <BasicLayout>
            <div className="pt-2">
                <h1>Individual Course Details</h1>
                <CoursesTable courses={allowed} currentUser={currentUser} />
            </div>
        </BasicLayout>
    );
}