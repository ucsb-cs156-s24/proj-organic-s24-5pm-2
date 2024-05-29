import React from "react";
import OurTable from "main/components/OurTable";
import { Button } from "react-bootstrap";

export default function StaffTable({ staff, onDelete }) {

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
                <Button
                    data-testid={`StaffTable-cell-row-${row.index}-col-Delete-button`}
                    onClick={() => onDelete(row.original.id)}
                >
                    Delete
                </Button>
            )
        }
    ];

    return <OurTable
        data={staff}
        columns={columns}
        testid={"StaffTable"} />;
}
