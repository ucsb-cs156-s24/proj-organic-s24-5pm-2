import { render, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import StaffTable from "main/components/Staff/StaffTable";
import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { staffFixture } from "fixtures/staffFixture";
import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";
import { useCurrentUser } from "main/utils/currentUser";

jest.mock("main/utils/currentUser");

const mockToast = jest.fn();
jest.mock('react-toastify', () => {
    const originalModule = jest.requireActual('react-toastify');
    return {
        __esModule: true,
        ...originalModule,
        toast: (x) => mockToast(x)
    };
});

describe("StaffTable tests", () => {
    const axiosMock = new AxiosMockAdapter(axios);
    const testId = "StaffTable";

    beforeEach(() => {
        axiosMock.reset();
        axiosMock.resetHistory();
    });

    test("Has the expected column headers and content for ordinary user", async () => {
        useCurrentUser.mockReturnValue({ data: apiCurrentUserFixtures.userOnly });

        const queryClient = new QueryClient();

        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <StaffTable staff={staffFixture.threeStaff} />
                </MemoryRouter>
            </QueryClientProvider>
        );

        expect(screen.getByTestId(`${testId}-cell-row-0-col-id`)).toHaveTextContent("1");
        expect(screen.getByTestId(`${testId}-cell-row-1-col-id`)).toHaveTextContent("2");
        expect(screen.getByTestId(`${testId}-cell-row-2-col-id`)).toHaveTextContent("3");

        const deleteButton = screen.queryByTestId(`${testId}-cell-row-0-col-Delete-button`);
        expect(deleteButton).not.toBeInTheDocument();
    });

    test("Has the expected column headers and content for admin user", async () => {
        useCurrentUser.mockReturnValue({ data: apiCurrentUserFixtures.adminUser });

        const queryClient = new QueryClient();

        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <StaffTable staff={staffFixture.threeStaff} onDelete={jest.fn()} />
                </MemoryRouter>
            </QueryClientProvider>
        );

        expect(screen.getByTestId(`${testId}-cell-row-0-col-id`)).toHaveTextContent("1");
        expect(screen.getByTestId(`${testId}-cell-row-1-col-id`)).toHaveTextContent("2");
        expect(screen.getByTestId(`${testId}-cell-row-2-col-id`)).toHaveTextContent("3");

        const deleteButton = screen.getByTestId(`${testId}-cell-row-0-col-Delete-button`);
        expect(deleteButton).toBeInTheDocument();
    });

    test("Has the expected column headers and content for instructor user", async () => {
        useCurrentUser.mockReturnValue({ data: apiCurrentUserFixtures.instructorUser });

        const queryClient = new QueryClient();

        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <StaffTable staff={staffFixture.threeStaff} onDelete={jest.fn()} />
                </MemoryRouter>
            </QueryClientProvider>
        );

        expect(screen.getByTestId(`${testId}-cell-row-0-col-id`)).toHaveTextContent("1");
        expect(screen.getByTestId(`${testId}-cell-row-1-col-id`)).toHaveTextContent("2");
        expect(screen.getByTestId(`${testId}-cell-row-2-col-id`)).toHaveTextContent("3");

        const deleteButton = screen.getByTestId(`${testId}-cell-row-0-col-Delete-button`);
        expect(deleteButton).toBeInTheDocument();
    });
});
