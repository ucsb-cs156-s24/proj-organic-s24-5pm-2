import React from "react";
import OurTable from "main/components/OurTable";
import { Button } from "react-bootstrap";
import { useCurrentUser, hasRole } from "main/utils/currentUser";

export default function StaffTable({ staff, onDelete }) {
    const { data: currentUser } = useCurrentUser();

    const columns = [
        {
            Header: 'id',
            accessor: 'id',
        },
        {
            Header: 'courseId',
            accessor: 'courseId',
        },
        {
            Header: 'githubId',
            accessor: 'githubId',
        },
        {
            Header: 'Actions',
            Cell: ({ row }) => (
                (hasRole(currentUser, "ROLE_ADMIN") || hasRole(currentUser, "ROLE_INSTRUCTOR")) && (
                    <Button
                        data-testid={`StaffTable-cell-row-${row.index}-col-Delete-button`}
                        onClick={() => onDelete(row.original.id)}
                    >
                        Delete
                    </Button>
                )
            )
        }
    ];

    return <OurTable
        data={staff}
        columns={columns}
        testid={"StaffTable"} />;
}
