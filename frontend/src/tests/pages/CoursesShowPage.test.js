import { fireEvent, render, waitFor, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import CoursesShowPage from "main/pages/CoursesShowPage";

import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import { coursesFixtures } from "fixtures/coursesFixtures";
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

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => {
    const originalModule = jest.requireActual('react-router-dom');
    return {
        __esModule: true,
        ...originalModule,
        useParams: () => ({
            id: 17
        }),
        Navigate: (x) => { mockNavigate(x); return null; }
    };
});

describe("CoursesShowPage tests", () => {

    const axiosMock = new AxiosMockAdapter(axios);

    const testId = "CoursesTable";

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

    test("renders course correctly for admin", async () => {
        setupAdminUser();
        const queryClient = new QueryClient();
        axiosMock.onGet("/api/courses/get", { params: { id: 17 } }).reply(200, coursesFixtures.threeCourses[0]);

        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <CoursesShowPage />
                </MemoryRouter>
            </QueryClientProvider>
        );

        await waitFor(() => { expect(screen.getByTestId(`${testId}-cell-row-0-col-id`)).toHaveTextContent("1"); });

    });

    test("renders course correctly for instructor", async () => {
        setupInstructorUser();
        const queryClient = new QueryClient();
        axiosMock.onGet("/api/courses/get", { params: { id: 17 } }).reply(200, coursesFixtures.threeCourses[0]);

        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <CoursesShowPage />
                </MemoryRouter>
            </QueryClientProvider>
        );

        await waitFor(() => { expect(screen.getByTestId(`${testId}-cell-row-0-col-id`)).toHaveTextContent("1"); });

    });

    test("renders empty table when backend unavailable, admin", async () => {
     
        setupAdminUser();
        const queryClient = new QueryClient();
        axiosMock.onGet("/api/courses/get", { params: { id: 17 } }).timeout();
        const restoreConsole = mockConsole();

        
        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <CoursesShowPage />
                </MemoryRouter>
            </QueryClientProvider>
        );

       
        await waitFor(() => { expect(axiosMock.history.get.length).toBeGreaterThanOrEqual(1); });

        restoreConsole();

        expect(screen.queryByTestId(`${testId}-cell-row-0-col-id`)).not.toBeInTheDocument();
    });

    test("renders empty table when backend unavailable, instructor", async () => {
       
        setupInstructorUser();
        const queryClient = new QueryClient();
        axiosMock.onGet("/api/courses/get", { params: { id: 17 } }).timeout();
        const restoreConsole = mockConsole();

       
        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <CoursesShowPage />
                </MemoryRouter>
            </QueryClientProvider>
        );

       
        await waitFor(() => { expect(axiosMock.history.get.length).toBeGreaterThanOrEqual(1); });

        restoreConsole();

        expect(screen.queryByTestId(`${testId}-cell-row-0-col-id`)).not.toBeInTheDocument();
    });

    test("what happens when you click delete, admin", async () => {
        
        setupAdminUser();
        const queryClient = new QueryClient();
        axiosMock.onGet("/api/courses/get", { params: { id: 17 } }).reply(200, coursesFixtures.threeCourses[0]);
        axiosMock.onDelete("/api/courses/delete").reply(200, "Course with id 1 was deleted");

        
        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <CoursesShowPage />
                </MemoryRouter>
            </QueryClientProvider>
        );

       
        await waitFor(() => { expect(screen.getByTestId(`${testId}-cell-row-0-col-id`)).toBeInTheDocument(); });

        expect(screen.getByTestId(`${testId}-cell-row-0-col-id`)).toHaveTextContent("1");

        const deleteButton = screen.getByTestId(`${testId}-cell-row-0-col-Delete-button`);
        expect(deleteButton).toBeInTheDocument();

       
        fireEvent.click(deleteButton);

       
        await waitFor(() => { expect(mockToast).toBeCalledWith("Course with id 1 was deleted") });

    });

    test("what happens when you click delete, instructor", async () => {
        
        setupInstructorUser();
        const queryClient = new QueryClient();
        axiosMock.onGet("/api/courses/get", { params: { id: 17 } }).reply(200, coursesFixtures.threeCourses[0]);
        axiosMock.onDelete("/api/courses/delete").reply(200, "Course with id 1 was deleted");

        
        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <CoursesShowPage />
                </MemoryRouter>
            </QueryClientProvider>
        );

       
        await waitFor(() => { expect(screen.getByTestId(`${testId}-cell-row-0-col-id`)).toBeInTheDocument(); });

        expect(screen.getByTestId(`${testId}-cell-row-0-col-id`)).toHaveTextContent("1");

        const deleteButton = screen.getByTestId(`${testId}-cell-row-0-col-Delete-button`);
        expect(deleteButton).toBeInTheDocument();

        
        fireEvent.click(deleteButton);

        
        await waitFor(() => { expect(mockToast).toBeCalledWith("Course with id 1 was deleted") });

    });

    test("tests buttons for editing do not show up for user", async () => {
        
        setupUser();
        const queryClient = new QueryClient();
        axiosMock.onGet("/api/courses/get", { params: { id: 17 } }).reply(200, coursesFixtures.threeCourses[0]);

        
        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <CoursesShowPage />
                </MemoryRouter>
            </QueryClientProvider>
        );

       
        await waitFor(() => { expect(screen.getByTestId(`${testId}-cell-row-0-col-id`)).toBeInTheDocument(); });

        expect(screen.getByTestId(`${testId}-cell-row-0-col-id`)).toHaveTextContent("1");

        const deleteButton = screen.queryByTestId(`${testId}-cell-row-0-col-Delete-button`);
        expect(deleteButton).not.toBeInTheDocument();

    });
    test('renders correctly', async () => {
        const queryClient = new QueryClient();
        setupUser();
        axiosMock.onGet("/api/courses/1").reply(200, coursesFixtures.threeCourses[0]);

        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter initialEntries={['/courses/1']}>
                    <CoursesShowPage />
                </MemoryRouter>
            </QueryClientProvider>
        );

        await waitFor(() => expect(screen.getByText('Individual Course Details')).toBeInTheDocument());
        expect(screen.getByText('CS156')).toBeInTheDocument();
        expect(screen.getByLabelText('Upload a file')).toBeInTheDocument();
        expect(screen.getByText('Upload Roster')).toBeInTheDocument();
    });

    test('sets file on change', async () => {
        const queryClient = new QueryClient();
        setupUser();
        axiosMock.onGet("/api/courses/1").reply(200, coursesFixtures.threeCourses[0]);

        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter initialEntries={['/courses/1']}>
                    <CoursesShowPage />
                </MemoryRouter>
            </QueryClientProvider>
        );

        const fileInput = await screen.findByTestId('file-input');
        const file = new File(['test'], 'test.csv', { type: 'text/csv' });

        fireEvent.change(fileInput, { target: { files: [file] } });

        expect(fileInput.files[0]).toBe(file);
    });

    test('calls mutation on upload click', async () => {
        const queryClient = new QueryClient();
        const mockMutate = jest.fn();
        setupUser();
        axiosMock.onGet("/api/courses/1").reply(200, coursesFixtures.threeCourses[0]);
        jest.spyOn(require('main/utils/useBackend'), 'useBackendMutation').mockReturnValue({
            mutate: mockMutate
        });

        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter initialEntries={['/courses/1']}>
                    <CoursesShowPage />
                </MemoryRouter>
            </QueryClientProvider>
        );

        const fileInput = await screen.findByTestId('file-input');
        const file = new File(['test'], 'test.csv', { type: 'text/csv' });

        fireEvent.change(fileInput, { target: { files: [file] } });

        const uploadButton = screen.getByText('Upload Roster');
        fireEvent.click(uploadButton);

        await waitFor(() => {
            expect(mockMutate).toHaveBeenCalledWith(expect.any(FormData));
        });
    });

    test('calls uploadRoster with correct parameters on file upload', async () => {
        const queryClient = new QueryClient();
        setupUser();
        axiosMock.onGet("/api/courses/1").reply(200, coursesFixtures.threeCourses[0]);

        const mockMutate = jest.fn();
        require('main/utils/useBackend').useBackendMutation.mockReturnValue({ mutate: mockMutate });

        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter initialEntries={['/courses/1']}>
                    <CoursesShowPage />
                </MemoryRouter>
            </QueryClientProvider>
        );

        const fileInput = await screen.findByTestId('file-input');
        const file = new File(['test'], 'test.csv', { type: 'text/csv' });

        fireEvent.change(fileInput, { target: { files: [file] } });

        const uploadButton = screen.getByText('Upload Roster');
        fireEvent.click(uploadButton);

        await waitFor(() => expect(mockMutate).toBeCalled());

        const formData = mockMutate.mock.calls[0][0];
        expect(formData).toBeInstanceOf(FormData);
        expect(formData.get('file')).toEqual(file);
        expect(mockMutate.mock.calls[0][0].get('file')).toEqual(file);
    });

});