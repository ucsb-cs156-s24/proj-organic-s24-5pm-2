import React from 'react';
import { useParams } from 'react-router-dom';
import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import CoursesTable from 'main/components/Courses/CoursesTable';
import { useBackend } from 'main/utils/useBackend';
import { useCurrentUser } from 'main/utils/currentUser';

export default function CoursesShowPage() {
    const { id } = useParams();
    const { data: currentUser } = useCurrentUser();
    const { data: course, isLoading, error } = useBackend(
        [`/api/courses/${id}`],
        { method: "GET", url: `/api/courses/${id}` },
        []
    );

    console.log(course); // Debug: Check what's being received

    if (isLoading) {
        return <BasicLayout><p>Loading...</p></BasicLayout>;
    }
    if (error) {
        return <BasicLayout><p>Error loading course: {error.message}</p></BasicLayout>;
    }
    if (!course) {
        return <BasicLayout><p>No course data found</p></BasicLayout>;
    }

    const courses = [course]; // Ensure data is in an array

    return (
        <BasicLayout>
            <div className="pt-2">
                <h1>Course Details</h1>
                <CoursesTable courses={courses} currentUser={currentUser} />
            </div>
        </BasicLayout>
    );
}