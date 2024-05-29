import { fireEvent, render, waitFor, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import StaffIndexPage from "main/pages/StaffIndexPage";

import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import { staffFixture } from "fixtures/staffFixture";
import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";
import mockConsole from "jest-mock-console";

const mockToast = jest.fn();
jest.mock('react-toastify', () => {
    const originalModule = jest.requireActual('react-toastify');
    return {
        __esModule: true,
        ...originalModule,
        toast: (x) => mockToast(x)
    };
});

describe("StaffIndexPage tests", () => {

    const axiosMock = new AxiosMockAdapter(axios);

    const testId = "StaffTable";
    const courseId = "1";

    const setupAdminUser = () => {
        axiosMock.reset();
        axiosMock.resetHistory();
        axiosMock.onGet("/api/currentUser").reply(200, apiCurrentUserFixtures.adminUser);
        axiosMock.onGet("/api/systemInfo").reply(200, systemInfoFixtures.showingNeither);
    };

    const setupInstructorUser = () => {
        axiosMock.reset();
        axiosMock.resetHistory();
        axiosMock.onGet("/api/currentUser").reply(200, apiCurrentUserFixtures.instructorUser);
        axiosMock.onGet("/api/systemInfo").reply(200, systemInfoFixtures.showingNeither);
    }

    const setupUser = () => {
        axiosMock.reset();
        axiosMock.resetHistory();
        axiosMock.onGet("/api/currentUser").reply(200, apiCurrentUserFixtures.userOnly);
        axiosMock.onGet("/api/systemInfo").reply(200, systemInfoFixtures.showingNeither);
    }

    test("Renders with Create Button for admin user", async () => {
        // arrange
        setupAdminUser();
        const queryClient = new QueryClient();
        axiosMock.onGet(`/api/courses/${courseId}/staff`).reply(200, []);

        // act
        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter initialEntries={[`/courses/${courseId}/staff`]}>
                    <Routes>
                        <Route path="/courses/:courseId/staff" element={<StaffIndexPage />} />
                    </Routes>
                </MemoryRouter>
            </QueryClientProvider>
        );

        // assert
        await waitFor(() => {
            expect(screen.getByText(/Create Staff/)).toBeInTheDocument();
        });
        const button = screen.getByText(/Create Staff/);
        expect(button).toHaveAttribute("href", `/courses/${courseId}/staff/create`);
        expect(button).toHaveAttribute("style", "float: right;");
    });

    test("Renders with Create Button for instructor user", async () => {
        // arrange
        setupInstructorUser();
        const queryClient = new QueryClient();
        axiosMock.onGet(`/api/courses/${courseId}/staff`).reply(200, []);

        // act
        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter initialEntries={[`/courses/${courseId}/staff`]}>
                    <Routes>
                        <Route path="/courses/:courseId/staff" element={<StaffIndexPage />} />
                    </Routes>
                </MemoryRouter>
            </QueryClientProvider>
        );

        // assert
        await waitFor(() => {
            expect(screen.getByText(/Create Staff/)).toBeInTheDocument();
        });
        const button = screen.getByText(/Create Staff/);
        expect(button).toHaveAttribute("href", `/courses/${courseId}/staff/create`);
        expect(button).toHaveAttribute("style", "float: right;");
    });

    test("Renders without Create Button for non admin and non instructor user", async () => {
        // arrange
        setupUser();
        const queryClient = new QueryClient();
        axiosMock.onGet(`/api/courses/${courseId}/staff`).reply(200, []);

        // act
        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter initialEntries={[`/courses/${courseId}/staff`]}>
                    <Routes>
                        <Route path="/courses/:courseId/staff" element={<StaffIndexPage />} />
                    </Routes>
                </MemoryRouter>
            </QueryClientProvider>
        );

        // assert
        await waitFor(() => {
            expect(screen.queryByText(/Create Staff/)).not.toBeInTheDocument();
        });
    });

    test("renders three staff members correctly for admin", async () => {
        // arrange
        setupAdminUser();
        const queryClient = new QueryClient();
        axiosMock.onGet(`/api/courses/${courseId}/staff`).reply(200, staffFixture.threeStaff);

        // act
        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter initialEntries={[`/courses/${courseId}/staff`]}>
                    <Routes>
                        <Route path="/courses/:courseId/staff" element={<StaffIndexPage />} />
                    </Routes>
                </MemoryRouter>
            </QueryClientProvider>
        );

        // assert
        await waitFor(() => { expect(screen.getByTestId(`${testId}-cell-row-0-col-id`)).toHaveTextContent("1"); });
        expect(screen.getByTestId(`${testId}-cell-row-1-col-id`)).toHaveTextContent("2");
        expect(screen.getByTestId(`${testId}-cell-row-2-col-id`)).toHaveTextContent("3");
    });

    test("renders three staff members correctly for instructor", async () => {
        // arrange
        setupInstructorUser();
        const queryClient = new QueryClient();
        axiosMock.onGet(`/api/courses/${courseId}/staff`).reply(200, staffFixture.threeStaff);

        // act
        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter initialEntries={[`/courses/${courseId}/staff`]}>
                    <Routes>
                        <Route path="/courses/:courseId/staff" element={<StaffIndexPage />} />
                    </Routes>
                </MemoryRouter>
            </QueryClientProvider>
        );

        // assert
        await waitFor(() => { expect(screen.getByTestId(`${testId}-cell-row-0-col-id`)).toHaveTextContent("1"); });
        expect(screen.getByTestId(`${testId}-cell-row-1-col-id`)).toHaveTextContent("2");
        expect(screen.getByTestId(`${testId}-cell-row-2-col-id`)).toHaveTextContent("3");
    });

    test("renders empty table when backend unavailable, admin", async () => {
        // arrange
        setupAdminUser();
        const queryClient = new QueryClient();
        axiosMock.onGet(`/api/courses/${courseId}/staff`).timeout();
        const restoreConsole = mockConsole();

        // act
        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter initialEntries={[`/courses/${courseId}/staff`]}>
                    <Routes>
                        <Route path="/courses/:courseId/staff" element={<StaffIndexPage />} />
                    </Routes>
                </MemoryRouter>
            </QueryClientProvider>
        );

        // assert
        await waitFor(() => { expect(axiosMock.history.get.length).toBeGreaterThanOrEqual(1); });

        restoreConsole();

        expect(screen.queryByTestId(`${testId}-cell-row-0-col-id`)).not.toBeInTheDocument();
    });

    test("renders empty table when backend unavailable, instructor", async () => {
        // arrange
        setupInstructorUser();
        const queryClient = new QueryClient();
        axiosMock.onGet(`/api/courses/${courseId}/staff`).timeout();
        const restoreConsole = mockConsole();

        // act
        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter initialEntries={[`/courses/${courseId}/staff`]}>
                    <Routes>
                        <Route path="/courses/:courseId/staff" element={<StaffIndexPage />} />
                    </Routes>
                </MemoryRouter>
            </QueryClientProvider>
        );

        // assert
        await waitFor(() => { expect(axiosMock.history.get.length).toBeGreaterThanOrEqual(1); });

        restoreConsole();

        expect(screen.queryByTestId(`${testId}-cell-row-0-col-id`)).not.toBeInTheDocument();
    });

    test("what happens when you click delete, admin", async () => {
        // arrange
        setupAdminUser();
        const queryClient = new QueryClient();
        axiosMock.onGet(`/api/courses/${courseId}/staff`).reply(200, staffFixture.threeStaff);
        axiosMock.onDelete("/api/staff/delete").reply(200, "Staff member with id 1 was deleted");

        // act
        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter initialEntries={[`/courses/${courseId}/staff`]}>
                    <Routes>
                        <Route path="/courses/:courseId/staff" element={<StaffIndexPage />} />
                    </Routes>
                </MemoryRouter>
            </QueryClientProvider>
        );

        // assert
        await waitFor(() => { expect(screen.getByTestId(`${testId}-cell-row-0-col-id`)).toBeInTheDocument(); });

        expect(screen.getByTestId(`${testId}-cell-row-0-col-id`)).toHaveTextContent("1");

        const deleteButton = screen.getByTestId(`${testId}-cell-row-0-col-Delete-button`);
        expect(deleteButton).toBeInTheDocument();

        // act
        fireEvent.click(deleteButton);

        // assert
        await waitFor(() => { expect(mockToast).toBeCalledWith("Staff member with id 1 was deleted") });

    });

    test("what happens when you click delete, instructor", async () => {
        // arrange
        setupInstructorUser();
        const queryClient = new QueryClient();
        axiosMock.onGet(`/api/courses/${courseId}/staff`).reply(200, staffFixture.threeStaff);
        axiosMock.onDelete("/api/staff/delete").reply(200, "Staff member with id 1 was deleted");

        // act
        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter initialEntries={[`/courses/${courseId}/staff`]}>
                    <Routes>
                        <Route path="/courses/:courseId/staff" element={<StaffIndexPage />} />
                    </Routes>
                </MemoryRouter>
            </QueryClientProvider>
        );

        // assert
        await waitFor(() => { expect(screen.getByTestId(`${testId}-cell-row-0-col-id`)).toBeInTheDocument(); });

        expect(screen.getByTestId(`${testId}-cell-row-0-col-id`)).toHaveTextContent("1");

        const deleteButton = screen.getByTestId(`${testId}-cell-row-0-col-Delete-button`);
        expect(deleteButton).toBeInTheDocument();

        // act
        fireEvent.click(deleteButton);

        // assert
        await waitFor(() => { expect(mockToast).toBeCalledWith("Staff member with id 1 was deleted") });

    });

    test("tests buttons for editing do not show up for user", async () => {
        // arrange
        setupUser();
        const queryClient = new QueryClient();
        axiosMock.onGet(`/api/courses/${courseId}/staff`).reply(200, staffFixture.threeStaff);

        // act
        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter initialEntries={[`/courses/${courseId}/staff`]}>
                    <Routes>
                        <Route path="/courses/:courseId/staff" element={<StaffIndexPage />} />
                    </Routes>
                </MemoryRouter>
            </QueryClientProvider>
        );

        // assert
        await waitFor(() => { expect(screen.getByTestId(`${testId}-cell-row-0-col-id`)).toBeInTheDocument(); });

        expect(screen.getByTestId(`${testId}-cell-row-0-col-id`)).toHaveTextContent("1");

        const deleteButton = screen.queryByTestId(`${testId}-cell-row-0-col-Delete-button`);
        expect(deleteButton).not.toBeInTheDocument();
        expect(screen.queryByText(/Create Staff/)).not.toBeInTheDocument();
    });

});
