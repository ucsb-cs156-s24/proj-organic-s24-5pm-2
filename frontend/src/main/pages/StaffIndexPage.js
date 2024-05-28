import React from 'react';
import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import { useParams } from 'react-router-dom';

export default function StaffIndexPage() {
  const { courseId } = useParams();

  // Stryker disable all : placeholder for future implementation
  return (
    <BasicLayout>
      <div className="pt-2">
        <h1>Index page not yet implemented</h1>
        <p><a href={`/courses/${courseId}/staff/create`}>Create</a></p>
        <p><a href={`/courses/${courseId}/staff/edit/1`}>Edit</a></p>
      </div>
    </BasicLayout>
  )
}
