import React from 'react';
import { useParams, Navigate } from 'react-router-dom';
import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import StaffForm from "main/components/Staff/StaffForm";
import { useBackendMutation } from "main/utils/useBackend";
import { toast } from "react-toastify";

export default function StaffCreatePage({storybook=false}) {
    const { courseId } = useParams();

    const objectToAxiosParams = (staff) => ({
        url: `/api/courses/${courseId}/staff/post`, // Updated URL to include courseId
        method: "POST",
        params: {
            githubId: staff.githubId
        }
    });

    const onSuccess = (staff) => {
        toast(`New staff created - id: ${staff.id} courseId: ${courseId}`);
    }

    const mutation = useBackendMutation(
        objectToAxiosParams,
        { onSuccess }, 
        // Stryker disable next-line all : hard to set up test for caching
        [`/api/courses/${courseId}/staff`] // Updated to reflect course-specific endpoint
    );

    const { isSuccess } = mutation;

    const onSubmit = async (data) => {
        mutation.mutate(data);
    }
    
    if (isSuccess && !storybook) {
        return <Navigate to={`/courses/${courseId}/staff`} />
    }

    return (
        <BasicLayout>
            <div className="pt-2">
                <h1>Create New Staff</h1>
                <StaffForm submitAction={onSubmit} />
            </div>
        </BasicLayout>
    )
}
