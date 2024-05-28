import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import CoursesTable from 'main/components/Courses/CoursesTable';
import { useBackend, useBackendMutation } from 'main/utils/useBackend';
import { useCurrentUser } from 'main/utils/currentUser';
import { toast } from 'react-toastify';

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

        const [file, setFile] = useState(null);

        const handleFileChange = (event) => {
            setFile(event.target.files[0]);
        };

        const { mutate: uploadRoster } = useBackendMutation(
            (data) => ({
                url: "/api/students/upload/egrades",
                method: "POST",
                data: data,
                params: { courseId: id },
            }),
            {
                onSuccess: () => {
                    toast.success("Roster uploaded successfully!");
                },
                onError: () => {
                    toast.error("Error uploading roster. Please try again.");
                },
            }
        );

        const handleUpload = () => {
            if (file) {
                const formData = new FormData();
                formData.append("file", file);
                uploadRoster(formData);
            } else {
                toast.error("Please select a file to upload.");
            }
        };    

    return (
            <BasicLayout>
                <div className="pt-2">
                    <h1>Individual Course Details</h1>
                    <CoursesTable courses={allowed} currentUser={currentUser} />
                    <div className="mt-4">
                        <input type="file" onChange={handleFileChange} aria-label="Upload a file" data-testid="file-input" />
                        <button className="btn btn-primary mt-2" onClick={handleUpload}>Upload Roster</button>
                    </div>
                </div>
            </BasicLayout>
    );
}