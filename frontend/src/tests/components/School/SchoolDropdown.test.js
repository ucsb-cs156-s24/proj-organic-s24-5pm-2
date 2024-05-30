import { render, fireEvent, screen } from "@testing-library/react";
import SchoolDropdown from "main/components/School/SchoolDropdown";
import { QueryClient, QueryClientProvider } from "react-query";
import AxiosMockAdapter from "axios-mock-adapter";
import axios from "axios";
import { MemoryRouter } from "react-router-dom";

describe("SchoolDropdown", () => {

    const axiosMock = new AxiosMockAdapter(axios);

    const sampleSchools = [
        { 
            "abbrev": "ucsb",
            "name": "UC Santa Barbara",
            "termRegex": "[WSMF]\\d\\d",
            "termDescription": "Enter quarter, e.g. F23, W24, S24, M24",
            "termError": "Quarter must be entered in the correct format"
        },
        {
            "abbrev": "umn",
            "name": "University of Minnesota",
            "termRegex": "[WSMF]\\d\\d",
            "termDescription": "Enter quarter, e.g. F23, W24, S24, M24",
            "termError": "Quarter must be entered in the correct format"
        },
        {
            "abbrev": "ucsd",
            "name": "UC San Diego",
            "termRegex": "[WSMF]\\d\\d",
            "termDescription": "Enter quarter, e.g. F23, W24, S24, M24",
            "termError": "Quarter must be entered in the correct format"
        }
    ];

    test("renders correctly with empty", async () => {
        const queryClient = new QueryClient();
        axiosMock.onGet("/api/schools/all").reply(200, []);

        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <SchoolDropdown />
                </MemoryRouter>
            </QueryClientProvider>
        );
        await screen.findByText(/Name/);
    });

    test("doesn't crash on nonempty api get schools", async () => {
        const queryClient = new QueryClient();
        axiosMock.onGet("/api/schools/all").reply(200, sampleSchools);

        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <SchoolDropdown />
                </MemoryRouter>
            </QueryClientProvider>
        );
        await screen.findByText(/Name/);
    });

    test("renders three schools correctly", async () => {
        const queryClient = new QueryClient();
        axiosMock.onGet("/api/schools/all").reply(200, sampleSchools);

        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <SchoolDropdown />
                </MemoryRouter>
            </QueryClientProvider>
        );

        await screen.findByText(/Name/);
        expect(await screen.findByTestId('school-dropdown-test-dropdown-form')).toBeInTheDocument();
        //selection so the dropdown appears
        const submitField = screen.getByTestId('school-dropdown-test-dropdown-form');
        fireEvent.select(submitField);
        expect(await screen.findByTestId('school-dropdown-wrapper')).toBeInTheDocument();
        expect(await screen.findByTestId('school-dropdown-dropdown-form-option-0')).toBeInTheDocument();
        expect(await screen.findByTestId('school-dropdown-dropdown-form-option-1')).toBeInTheDocument();
        expect(await screen.findByTestId('school-dropdown-dropdown-form-option-2')).toBeInTheDocument();
        expect(screen.queryByTestId('school-dropdown-dropdown-form-option-3')).not.toBeInTheDocument();

        expect(await screen.findByTestId('school-dropdown-dropdown-form-option-0')).toHaveTextContent("UC San Diego");
        expect(await screen.findByTestId('school-dropdown-dropdown-form-option-1')).toHaveTextContent("UC Santa Barbara");
        expect(await screen.findByTestId('school-dropdown-dropdown-form-option-2')).toHaveTextContent("University of Minnesota");
    });

    test("renders three schools correctly after selecting an option", async () => {
        const queryClient = new QueryClient();
        axiosMock.onGet("/api/schools/all").reply(200, sampleSchools);

        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <SchoolDropdown />
                </MemoryRouter>
            </QueryClientProvider>
        );

        await screen.findByText(/Name/);
        expect(await screen.findByTestId('school-dropdown-test-dropdown-form')).toBeInTheDocument();
        //selection so the dropdown appears
        const submitField = screen.getByTestId('school-dropdown-test-dropdown-form');
        fireEvent.select(submitField);
        expect(await screen.findByTestId('school-dropdown-wrapper')).toBeInTheDocument();
        expect(await screen.findByTestId('school-dropdown-dropdown-form-option-0')).toBeInTheDocument();
        expect(await screen.findByTestId('school-dropdown-dropdown-form-option-1')).toBeInTheDocument();
        expect(await screen.findByTestId('school-dropdown-dropdown-form-option-2')).toBeInTheDocument();
        expect(screen.queryByTestId('school-dropdown-dropdown-form-option-3')).not.toBeInTheDocument();

        const optionOne = screen.getByTestId('school-dropdown-dropdown-form-option-1');
        fireEvent.click(optionOne);
        fireEvent.click(submitField);

        expect(await screen.findByTestId('school-dropdown-dropdown-form-option-0')).toHaveTextContent("UC Santa Barbara");
        expect(screen.queryByTestId('school-dropdown-dropdown-form-option-1')).not.toBeInTheDocument();
        expect(screen.queryByTestId('school-dropdown-dropdown-form-option-2')).not.toBeInTheDocument();
    });

    test("renders nothing on empty server response", async () => {
        const queryClient = new QueryClient();
        axiosMock.onGet("/api/schools/all").reply(500);

        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <SchoolDropdown />
                </MemoryRouter>
            </QueryClientProvider>
        );

        await screen.findByText(/Name/);
        expect(
            await screen.findByTestId('school-dropdown-test-dropdown-form')
        ).toBeInTheDocument();
        //selection so the dropdown appears
        const submitField = screen.getByTestId('school-dropdown-test-dropdown-form');
        fireEvent.select(submitField);

        expect(submitField).toHaveAttribute("disabled");

    });
});