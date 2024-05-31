import { render, screen } from "@testing-library/react";
import StaffIndexPage from "main/pages/StaffIndexPage";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter, Route, Routes } from "react-router-dom";

import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";

describe("PlaceholderIndexPage tests", () => {

    const axiosMock = new AxiosMockAdapter(axios);

    const setupUserOnly = () => {
        axiosMock.reset();
        axiosMock.resetHistory();
        axiosMock.onGet("/api/currentUser").reply(200, apiCurrentUserFixtures.userOnly);
        axiosMock.onGet("/api/systemInfo").reply(200, systemInfoFixtures.showingNeither);
    };

    const queryClient = new QueryClient();
    test("Renders expected content", () => {
        // arrange
        const courseId = "1";
        setupUserOnly();

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
        const regex = new RegExp(`Index page for course\\s+${courseId}\\s+staff not yet implemented`, 'i');
        expect(screen.getByText(regex)).toBeInTheDocument();
        expect(screen.getByText("Create")).toBeInTheDocument();
    });

});