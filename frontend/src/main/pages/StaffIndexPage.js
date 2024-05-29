import React from 'react';
import { useBackend } from 'main/utils/useBackend';
import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import StaffTable from 'main/components/Staff/StaffTable';
import { useCurrentUser, hasRole } from 'main/utils/currentUser';
import { useParams } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import { toast } from 'react-toastify';

export default function StaffIndexPage() {
  const { courseId } = useParams();
  const { data: currentUser } = useCurrentUser();

  const createButton = () => {
    return (
      <Button
        variant="primary"
        href={`/courses/${courseId}/staff/create`}
        style={{ float: "right" }}
      >
        Create Staff
      </Button>
    );
  };

  const { data: staff, error: _error, status: _status } =
    useBackend(
      // Stryker disable next-line all : don't test internal caching of React Query
      [`/api/courses/${courseId}/staff`],
      // Stryker disable next-line all : GET is the default
      { method: "GET", url: `/api/courses/${courseId}/staff` },
      []
    );

  const onDelete = async (id) => {
    await axios.delete(`/api/staff/delete`, { params: { id } });
    toast(`Staff member with id ${id} was deleted`);
    refetch();
  };

  return (
    <BasicLayout>
      <div className="pt-2">
        {(hasRole(currentUser, "ROLE_ADMIN") || hasRole(currentUser, "ROLE_INSTRUCTOR")) && createButton()}
        <h1>Staff for Course {courseId}</h1>
        <StaffTable staff={staff} onDelete={onDelete} />
      </div>
    </BasicLayout>
  );
}
