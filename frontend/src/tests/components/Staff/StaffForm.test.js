import { render, screen, waitFor,fireEvent } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import StaffForm from "main/components/Staff/StaffForm";
import { staffFixture } from "fixtures/staffFixture";

const mockedNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedNavigate
}));

describe("StaffForm tests", () => {

    test("renders correctly", async () => {
        render(
            <Router  >
                <StaffForm/>
            </Router>
        );
        await screen.findByText(/Github ID/);
        await screen.findByText(/Create/);
    });

    test("renders correctly when passing in a Staff", async () => {
        render(
            <Router  >
                <StaffForm initialContents={staffFixture.oneStaff} />
            </Router>
        );
        await screen.findByTestId(/StaffForm-id/);
        expect(screen.getByText(/Id/)).toBeInTheDocument();
        expect(screen.getByTestId(/StaffForm-id/)).toHaveValue("1");
        expect(screen.getByTestId(/StaffForm-courseId/)).toHaveValue("1");
    });

    test("Correct Error messsages on missing input", async () => {
        render(
            <Router  >
                <StaffForm/>
            </Router>
        );
        await screen.findByTestId("StaffForm-submit");
        const submitButton = screen.getByTestId("StaffForm-submit");

        fireEvent.click(submitButton);
        await waitFor(() => {
            expect(screen.getByText(/GithubId is required./)).toBeInTheDocument();
        });
    });

    test("No Error messsages on good input", async () => {
        const mockSubmitAction = jest.fn();
        render(
            <Router  >
                <StaffForm submitAction={mockSubmitAction} />
            </Router>
        );
        await screen.findByTestId("StaffForm-githubId");

        const githubIdField = screen.getByTestId("StaffForm-githubId");
        const submitButton = screen.getByTestId("StaffForm-submit");

        fireEvent.change(githubIdField, { target: { value: 'richardfang999' } });
        fireEvent.click(submitButton);

        await waitFor(() => expect(mockSubmitAction).toHaveBeenCalled());
        expect(screen.queryByText(/GithubId is required./)).not.toBeInTheDocument();
    });

    test("that navigate(-1) is called when Cancel is clicked", async () => {
        render(
            <Router  >
                <StaffForm/>
            </Router>
        );
        await screen.findByTestId("StaffForm-cancel");
        const cancelButton = screen.getByTestId("StaffForm-cancel");

        fireEvent.click(cancelButton);

        await waitFor(() => expect(mockedNavigate).toHaveBeenCalledWith(-1));
    });
});