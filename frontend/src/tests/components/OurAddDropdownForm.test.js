import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import OurAddDropdownForm from 'main/components/OurAddDropdownForm';
import { Button, Form } from 'react-bootstrap';

describe('OurAddDropdownForm Tests', () => {
    const threeOptions = [
        { label: 'choose me', key: 'choose me' },
        { label: 'pick me!', key: 'pick me!' },
        { label: 'click me', key: 'click me' },
    ];
    const twoOptions = [
        { label: 'c', key: 'c' },
        { label: 'b', key: 'b' },   
    ];
    const sameTwoOptions = [
        { label: 'a', key: 'a1' },
        { label: 'a', key: 'a2' },   
    ];
    const subsetThreeOptions = [
        { label: 'ab', key: 'ab' },
        { label: 'abba', key: 'abba' },
        { label: 'abba concert', key: 'abba concert' },
    ];

    test('renders an empty dropdown element without crashing', () => {
        render(
            <OurAddDropdownForm
                content={[]}
                label="empty"
                testId="test-dropdown"
            />
        );
    });

    test('renders an dropdown element without showing options if not selected', async () => {
        render(<OurAddDropdownForm content={threeOptions} label="empty" />);
        // load in element
        expect(await screen.findByTestId('testid-test-dropdown-form')).toBeInTheDocument();
        // verify that dropdown is not yet present
        expect(screen.queryByTestId('testid-wrapper')).not.toBeInTheDocument();
        expect(screen.queryByTestId('testid-dropdown-form-option-0')).not.toBeInTheDocument();
        expect(screen.queryByTestId('testid-dropdown-form-option-1')).not.toBeInTheDocument();
    });

    test('renders an correctly selected initialElement', async () => {
        render(
            <OurAddDropdownForm
                content={threeOptions}
                label="empty"
                basis={threeOptions[1]}
            />
        );
        // load in element
        expect(await screen.findByTestId('testid-test-dropdown-form')).toBeInTheDocument();
        // verify that there is an initial selection
        expect(screen.queryByTestId('testid-test-dropdown-form')).toHaveAttribute('value', 'click me');
        // load dropdown
        const submitField = screen.getByTestId('testid-test-dropdown-form');
        fireEvent.select(submitField);
        // verify that initial selection is highlighted
        expect(await screen.findByTestId('testid-wrapper')).toBeInTheDocument();
        expect(await screen.findByTestId('testid-dropdown-form-option-0')).toHaveStyle({backgroundColor: "green"});
        expect(screen.queryByTestId('testid-dropdown-form-option-1')).not.toBeInTheDocument();
        expect(screen.queryByTestId('testid-dropdown-form-option-2')).not.toBeInTheDocument();
    });

    test('renders on no inital selected element', async () => {
        render(<OurAddDropdownForm content={threeOptions} label="empty" />);

        expect(await screen.findByTestId('testid-test-dropdown-form')).toBeInTheDocument();

        expect(screen.queryByTestId('testid-test-dropdown-form')).toHaveAttribute('value', '');
    });

    test('renders an empty dropdown element with no options', async () => {
        render(<OurAddDropdownForm content={[]} label="empty" />);

        expect(await screen.findByTestId('testid-test-dropdown-form')).toBeInTheDocument();

        expect(screen.queryByTestId('testid-dropdown-form-option-0')).not.toBeInTheDocument();
    });

    test('default testid is testId', async () => {
        render(<OurAddDropdownForm content={threeOptions} label="empty" />);

        expect(await screen.findByTestId('testid-test-dropdown-form')).toBeInTheDocument();
    });

    test('testid is working', async () => {
        render(
            <OurAddDropdownForm
                content={threeOptions}
                label="empty"
                testId={'metronome'}
            />
        );
        expect(await screen.findByTestId('metronome-test-dropdown-form')).toBeInTheDocument();
    });

    test('onChangeFunc is called on typing', async () => {
        const changeFunc = jest.fn();
        render(
            <OurAddDropdownForm
                content={threeOptions}
                label="empty"
                onChangeFunc={changeFunc}
            ></OurAddDropdownForm>
        );

        expect(await screen.findByTestId('testid-test-dropdown-form')).toBeInTheDocument();
        // load changeFunc
        const submitField = screen.getByTestId('testid-test-dropdown-form');
        fireEvent.change(submitField, { target: { value: 'A' } });

        await waitFor(() => expect(changeFunc).toHaveBeenCalled());
    });

    test('renders correctly with null onChangeFunc', async () => {
        await waitFor(() =>
            expect(() => {
                render(
                    <OurAddDropdownForm
                        content={threeOptions}
                        label="empty"
                        onChangeFunc={null}
                    ></OurAddDropdownForm>
                );
            }).not.toThrow()
        );
        const submitField = screen.getByTestId('testid-test-dropdown-form');
        fireEvent.change(submitField, { target: { value: 'A' } });
    });

    test('options are rendered correctly', async () => {
        render(<OurAddDropdownForm content={threeOptions} label="empty" />);
        expect(
            await screen.findByTestId('testid-test-dropdown-form')
        ).toBeInTheDocument();
        //selection so the dropdown appears
        const submitField = screen.getByTestId('testid-test-dropdown-form');
        fireEvent.select(submitField);
        expect(await screen.findByTestId('testid-wrapper')).toBeInTheDocument();
        expect(await screen.findByTestId('testid-dropdown-form-option-0')).toBeInTheDocument();
        expect(await screen.findByTestId('testid-dropdown-form-option-1')).toBeInTheDocument();
        expect(await screen.findByTestId('testid-dropdown-form-option-2')).toBeInTheDocument();
    });

    test('options are not rendered after selection', async () => {
        render(<OurAddDropdownForm content={threeOptions} label="empty" />);
        expect(await screen.findByTestId('testid-test-dropdown-form')).toBeInTheDocument();

        const submitField = screen.getByTestId('testid-test-dropdown-form');
        fireEvent.select(submitField);

        expect(await screen.findByTestId('testid-dropdown-form-option-0')).toBeInTheDocument();
        expect(await screen.findByTestId('testid-dropdown-form-option-1')).toBeInTheDocument();
        expect(await screen.findByTestId('testid-dropdown-form-option-2')).toBeInTheDocument();

        const selectOption = screen.getByTestId('testid-dropdown-form-option-1');
        fireEvent.click(selectOption);

        expect(screen.queryByTestId('testid-wrapper')).not.toBeInTheDocument();
        expect(screen.queryByTestId('testid-dropdown-form-option-0')).not.toBeInTheDocument();
        expect(screen.queryByTestId('testid-dropdown-form-option-1')).not.toBeInTheDocument();
        expect(screen.queryByTestId('testid-dropdown-form-option-2')).not.toBeInTheDocument();
    });

    test('selection changes after clicking on an option', async () => {
        render(<OurAddDropdownForm content={threeOptions} label="empty" />);

        expect(await screen.findByTestId('testid-test-dropdown-form')).toBeInTheDocument();

        const submitField = screen.getByTestId('testid-test-dropdown-form');
        fireEvent.select(submitField);

        expect(await screen.findByTestId('testid-dropdown-form-option-0')).toBeInTheDocument();
        expect(await screen.findByTestId('testid-dropdown-form-option-1')).toBeInTheDocument();
        expect(await screen.findByTestId('testid-dropdown-form-option-2')).toBeInTheDocument();

        const selectOption = screen.getByTestId('testid-dropdown-form-option-1');

        fireEvent.click(selectOption);
        expect(await screen.findByTestId('testid-test-dropdown-form')).toBeInTheDocument();
        fireEvent.click(submitField);

        expect(await screen.findByTestId('testid-wrapper')).toBeInTheDocument();
        expect(await screen.findByTestId('testid-dropdown-form-option-0')).toHaveStyle({backgroundColor: "green"});
        expect(screen.queryByTestId('testid-dropdown-form-option-1')).not.toBeInTheDocument();
        expect(screen.queryByTestId('testid-dropdown-form-option-2')).not.toBeInTheDocument();
    });

    test("selection color changes over hovering", async () => {
        render(<OurAddDropdownForm content={threeOptions} label="empty" />);

        expect(await screen.findByTestId('testid-test-dropdown-form')).toBeInTheDocument();

        const submitField = screen.getByTestId('testid-test-dropdown-form');
        fireEvent.select(submitField);
        

        expect(await screen.findByTestId('testid-dropdown-form-option-0')).toBeInTheDocument();
        expect(await screen.findByTestId('testid-dropdown-form-option-1')).toBeInTheDocument();
        expect(await screen.findByTestId('testid-dropdown-form-option-2')).toBeInTheDocument();

        const selectOption = screen.getByTestId('testid-dropdown-form-option-2');
        fireEvent.mouseOver(selectOption);

        expect(await screen.findByTestId('testid-dropdown-form-option-0')).toHaveStyle({backgroundColor: "lightgreen"}); // ghost
        expect(await screen.findByTestId('testid-dropdown-form-option-1')).toHaveStyle({backgroundColor: "white"});
        expect(await screen.findByTestId('testid-dropdown-form-option-2')).toHaveStyle({backgroundColor: "lightgreen"});

        fireEvent.mouseOut(selectOption);
        expect(await screen.findByTestId('testid-dropdown-form-option-0')).toHaveStyle({backgroundColor: "lightgreen"}); // ghost
        expect(await screen.findByTestId('testid-dropdown-form-option-1')).toHaveStyle({backgroundColor: "white"});
        expect(await screen.findByTestId('testid-dropdown-form-option-2')).toHaveStyle({backgroundColor: "white"});
    });

    test("options are rendered in alphabetical order", async () => {
        render(<OurAddDropdownForm content={twoOptions} label="empty" />);

        expect(await screen.findByTestId('testid-test-dropdown-form')).toBeInTheDocument();
        const submitField = screen.getByTestId('testid-test-dropdown-form');
        fireEvent.select(submitField);
        
        expect(await screen.findByTestId('testid-dropdown-form-option-0')).toHaveTextContent("b");
        expect(await screen.findByTestId('testid-dropdown-form-option-1')).toHaveTextContent("c");
    });


    test("same label options are rendered", async () => {
        render(<OurAddDropdownForm content={sameTwoOptions} label="empty" />);

        expect(await screen.findByTestId('testid-test-dropdown-form')).toBeInTheDocument();
        const submitField = screen.getByTestId('testid-test-dropdown-form');
        fireEvent.select(submitField);
        
        expect(await screen.findByTestId('testid-dropdown-form-option-0')).toHaveTextContent("a");
        expect(await screen.findByTestId('testid-dropdown-form-option-1')).toHaveTextContent("a");
    });

    test("empty content list is properly disabled", async () => {
        render(<OurAddDropdownForm content={[]} label="empty" />);
        
        expect(await screen.findByTestId('testid-test-dropdown-form')).toBeInTheDocument();
        expect(screen.getByTestId('testid-test-dropdown-form')).toHaveAttribute("disabled");
        expect(screen.getByTestId('testid-test-dropdown-form')).toHaveStyle({"cursor" : "not-allowed"});
    });

    test("prefix renders only a portion of options", async () => {
        render(<OurAddDropdownForm content={threeOptions} label="empty" />);

        expect(await screen.findByTestId('testid-test-dropdown-form')).toBeInTheDocument();
        const submitField = screen.getByTestId('testid-test-dropdown-form');
        fireEvent.change(submitField, { target: { value : 'c'} });
        fireEvent.select(submitField);

        expect(await screen.findByTestId('testid-dropdown-form-option-0')).toBeInTheDocument();
        expect(await screen.findByTestId('testid-dropdown-form-option-1')).toBeInTheDocument();
        expect(screen.queryByTestId('testid-dropdown-form-option-2')).not.toBeInTheDocument();

        expect(screen.getByTestId('testid-dropdown-form-option-0')).toHaveTextContent("choose me");
        expect(screen.getByTestId('testid-dropdown-form-option-1')).toHaveTextContent("click me");
        expect(screen.getByTestId('testid-dropdown-form-option-0')).toHaveStyle({backgroundColor:"lightgreen"}); // ghost
        expect(screen.getByTestId('testid-dropdown-form-option-1')).toHaveStyle({backgroundColor:"white"});
    });

    test("prefix renders only a portion of options 2", async () => {
        render(<OurAddDropdownForm content={threeOptions} label="empty" />);

        expect(await screen.findByTestId('testid-test-dropdown-form')).toBeInTheDocument();
        const submitField = screen.getByTestId('testid-test-dropdown-form');
        fireEvent.change(submitField, { target: { value : 'p'} });
        fireEvent.select(submitField);

        expect(await screen.findByTestId('testid-dropdown-form-option-0')).toBeInTheDocument();
        expect(screen.queryByTestId('testid-dropdown-form-option-1')).not.toBeInTheDocument();
        expect(screen.queryByTestId('testid-dropdown-form-option-2')).not.toBeInTheDocument();

        expect(screen.getByTestId('testid-dropdown-form-option-0')).toHaveTextContent("pick me");
        expect(screen.getByTestId('testid-dropdown-form-option-0')).toHaveStyle({backgroundColor:"lightgreen"});
    });

    test("prefix renders only a portion of options with an initial selection", async () => {
        render(<OurAddDropdownForm content={subsetThreeOptions} label="empty" basis={subsetThreeOptions[1]}/>);

        expect(await screen.findByTestId('testid-test-dropdown-form')).toBeInTheDocument();
        const submitField = screen.getByTestId('testid-test-dropdown-form');
        fireEvent.select(submitField);

        expect(await screen.findByTestId('testid-dropdown-form-option-0')).toBeInTheDocument();
        expect(screen.getByTestId('testid-dropdown-form-option-1')).toBeInTheDocument();
        expect(screen.queryByTestId('testid-dropdown-form-option-2')).not.toBeInTheDocument();

        expect(screen.getByTestId('testid-dropdown-form-option-0')).toHaveTextContent("abba");
        expect(screen.getByTestId('testid-dropdown-form-option-0')).toHaveStyle({backgroundColor:"green"});
        expect(screen.getByTestId('testid-dropdown-form-option-1')).toHaveTextContent("abba concert");
        expect(screen.getByTestId('testid-dropdown-form-option-1')).toHaveStyle({backgroundColor:"white"});
    });

    test("prefix renders only a portion of options with an initial selection 2", async () => {
        render(<OurAddDropdownForm content={subsetThreeOptions} label="empty" basis={subsetThreeOptions[0]}/>);

        expect(await screen.findByTestId('testid-test-dropdown-form')).toBeInTheDocument();
        const submitField = screen.getByTestId('testid-test-dropdown-form');
        fireEvent.select(submitField);

        expect(await screen.findByTestId('testid-dropdown-form-option-0')).toBeInTheDocument();
        expect(screen.getByTestId('testid-dropdown-form-option-1')).toBeInTheDocument();
        expect(screen.getByTestId('testid-dropdown-form-option-2')).toBeInTheDocument();

        expect(screen.getByTestId('testid-dropdown-form-option-0')).toHaveTextContent("ab");
        expect(screen.getByTestId('testid-dropdown-form-option-0')).toHaveStyle({backgroundColor:"green"});
        expect(screen.getByTestId('testid-dropdown-form-option-1')).toHaveTextContent("abba");
        expect(screen.getByTestId('testid-dropdown-form-option-1')).toHaveStyle({backgroundColor:"white"});
        expect(screen.getByTestId('testid-dropdown-form-option-2')).toHaveTextContent("abba concert");
        expect(screen.getByTestId('testid-dropdown-form-option-2')).toHaveStyle({backgroundColor:"white"});
    });

    test("prefix renders only a portion of options 3", async () => {
        render(<OurAddDropdownForm content={subsetThreeOptions} label="empty"/>);

        expect(await screen.findByTestId('testid-test-dropdown-form')).toBeInTheDocument();
        const submitField = screen.getByTestId('testid-test-dropdown-form');
        fireEvent.change(submitField, { target: { value : 'a'} });
        fireEvent.select(submitField);

        expect(await screen.findByTestId('testid-dropdown-form-option-0')).toBeInTheDocument();
        expect(screen.getByTestId('testid-dropdown-form-option-1')).toBeInTheDocument();
        expect(screen.getByTestId('testid-dropdown-form-option-2')).toBeInTheDocument();

        expect(screen.getByTestId('testid-dropdown-form-option-0')).toHaveTextContent("a");
        expect(screen.getByTestId('testid-dropdown-form-option-0')).toHaveStyle({backgroundColor:"lightgreen"});
        expect(screen.getByTestId('testid-dropdown-form-option-1')).toHaveTextContent("abba");
        expect(screen.getByTestId('testid-dropdown-form-option-1')).toHaveStyle({backgroundColor:"white"});
        expect(screen.getByTestId('testid-dropdown-form-option-2')).toHaveTextContent("abba concert");
        expect(screen.getByTestId('testid-dropdown-form-option-2')).toHaveStyle({backgroundColor:"white"});
    });

    test("prefix renders only a portion of options after changing prefix and the initialElement is no longer selected", async () => {
        render(<OurAddDropdownForm content={subsetThreeOptions} label="empty" basis={subsetThreeOptions[0]}/>);

        expect(await screen.findByTestId('testid-test-dropdown-form')).toBeInTheDocument();
        const submitField = screen.getByTestId('testid-test-dropdown-form');
        fireEvent.select(submitField);

        expect(await screen.findByTestId('testid-dropdown-form-option-0')).toBeInTheDocument();
        expect(screen.getByTestId('testid-dropdown-form-option-1')).toBeInTheDocument();
        expect(screen.getByTestId('testid-dropdown-form-option-2')).toBeInTheDocument();

        expect(screen.getByTestId('testid-dropdown-form-option-0')).toHaveTextContent("ab");
        expect(screen.getByTestId('testid-dropdown-form-option-0')).toHaveStyle({backgroundColor:"green"});
        expect(screen.getByTestId('testid-dropdown-form-option-1')).toHaveTextContent("abba");
        expect(screen.getByTestId('testid-dropdown-form-option-1')).toHaveStyle({backgroundColor:"white"});
        expect(screen.getByTestId('testid-dropdown-form-option-2')).toHaveTextContent("abba concert");
        expect(screen.getByTestId('testid-dropdown-form-option-2')).toHaveStyle({backgroundColor:"white"});

        fireEvent.change(submitField, { target: { value : 'a'} });
        fireEvent.click(submitField); // select doesn't work for some reason?

        expect(await screen.findByTestId('testid-dropdown-form-option-0')).toBeInTheDocument();
        expect(screen.getByTestId('testid-dropdown-form-option-1')).toBeInTheDocument();
        expect(screen.getByTestId('testid-dropdown-form-option-2')).toBeInTheDocument();

        expect(screen.getByTestId('testid-dropdown-form-option-0')).toHaveTextContent("ab");
        expect(screen.getByTestId('testid-dropdown-form-option-0')).toHaveStyle({backgroundColor:"lightgreen"});
        expect(screen.getByTestId('testid-dropdown-form-option-1')).toHaveTextContent("abba");
        expect(screen.getByTestId('testid-dropdown-form-option-1')).toHaveStyle({backgroundColor:"white"});
        expect(screen.getByTestId('testid-dropdown-form-option-2')).toHaveTextContent("abba concert");
        expect(screen.getByTestId('testid-dropdown-form-option-2')).toHaveStyle({backgroundColor:"white"});
    });

    test("too long option removes all options and causes red text", async () => {
        render(<OurAddDropdownForm content={threeOptions} label="empty" />);

        expect(await screen.findByTestId('testid-test-dropdown-form')).toBeInTheDocument();
        const submitField = screen.getByTestId('testid-test-dropdown-form');
        fireEvent.change(submitField, { target: { value : 'cheese'} });
        fireEvent.select(submitField);

        expect(await screen.findByTestId('testid-wrapper')).toBeInTheDocument();
        expect(screen.queryByTestId('testid-dropdown-form-option-0')).not.toBeInTheDocument();
        expect(screen.queryByTestId('testid-dropdown-form-option-1')).not.toBeInTheDocument();
        expect(screen.queryByTestId('testid-dropdown-form-option-2')).not.toBeInTheDocument();

        expect(submitField).toHaveStyle({color:"red"});
    });

    test("red text removed on proper prefix", async () => {
        render(<OurAddDropdownForm content={threeOptions} label="empty" />);

        expect(await screen.findByTestId('testid-test-dropdown-form')).toBeInTheDocument();
        const submitField = screen.getByTestId('testid-test-dropdown-form');
        fireEvent.change(submitField, { target: { value : 'cheese'} });
        fireEvent.select(submitField);

        expect(await screen.findByTestId('testid-wrapper')).toBeInTheDocument();
        expect(screen.queryByTestId('testid-dropdown-form-option-0')).not.toBeInTheDocument();
        expect(screen.queryByTestId('testid-dropdown-form-option-1')).not.toBeInTheDocument();
        expect(screen.queryByTestId('testid-dropdown-form-option-2')).not.toBeInTheDocument();

        expect(submitField).toHaveStyle({color:"red"});

        fireEvent.change(submitField, { target: { value : 'choose'} });
        fireEvent.select(submitField);

        expect(await screen.findByTestId('testid-wrapper')).toBeInTheDocument();
        expect(screen.getByTestId('testid-dropdown-form-option-0')).toBeInTheDocument();
        expect(screen.queryByTestId('testid-dropdown-form-option-1')).not.toBeInTheDocument();
        expect(screen.queryByTestId('testid-dropdown-form-option-2')).not.toBeInTheDocument();

        expect(submitField).not.toHaveStyle({color:"red"});
    });

    test("enter autocompletes and chooses first selection", async () => {
        render(<OurAddDropdownForm content={threeOptions} label="empty" />);

        expect(await screen.findByTestId('testid-test-dropdown-form')).toBeInTheDocument();
        const submitField = screen.getByTestId('testid-test-dropdown-form');
        fireEvent.change(submitField, { target: { value : 'choose'} });
        fireEvent.select(submitField);

        expect(await screen.findByTestId('testid-wrapper')).toBeInTheDocument();
        fireEvent.keyDown(submitField, {key: 'Enter', code: 'Enter'});

        expect(await screen.findByTestId('testid-test-dropdown-form')).toBeInTheDocument();
        expect(submitField).toHaveAttribute("value", "choose me");
        expect(screen.queryByTestId('testid-wrapper')).not.toBeInTheDocument();
    });

    test("dropdown still shows on keyboard input aside from Enter", async () => {
        render(<OurAddDropdownForm content={threeOptions} label="empty" />);

        expect(await screen.findByTestId('testid-test-dropdown-form')).toBeInTheDocument();
        const submitField = screen.getByTestId('testid-test-dropdown-form');
        fireEvent.change(submitField, { target: { value : ''} });
        fireEvent.select(submitField);

        expect(await screen.findByTestId('testid-wrapper')).toBeInTheDocument();
        fireEvent.keyDown(submitField, {key: 'c', code: 'c'});

        expect(await screen.findByTestId('testid-wrapper')).toBeInTheDocument();
    });

    test("dropdown still shows on autocomplete attempt with no valid options", async () => {
        render(<OurAddDropdownForm content={threeOptions} label="empty" />);

        expect(await screen.findByTestId('testid-test-dropdown-form')).toBeInTheDocument();
        const submitField = screen.getByTestId('testid-test-dropdown-form');
        fireEvent.change(submitField, { target: { value : 'I SEE FIRE'} });
        fireEvent.select(submitField);

        expect(await screen.findByTestId('testid-wrapper')).toBeInTheDocument();
        fireEvent.keyDown(submitField, {key: 'Enter', code: 'Enter'});

        expect(await screen.findByTestId('testid-wrapper')).toBeInTheDocument();
    });

    test("dropdown rerenders after autocomplete and nonEnterKey", async () => {
        render(<OurAddDropdownForm content={threeOptions} label="empty" />);

        expect(await screen.findByTestId('testid-test-dropdown-form')).toBeInTheDocument();
        const submitField = screen.getByTestId('testid-test-dropdown-form');
        fireEvent.change(submitField, { target: { value : 'c'} });
        fireEvent.select(submitField);

        expect(await screen.findByTestId('testid-wrapper')).toBeInTheDocument();
        fireEvent.keyDown(submitField, {key: 'Enter', code: 'Enter'});

        expect(screen.queryByTestId('testid-wrapper')).not.toBeInTheDocument();
        fireEvent.keyDown(submitField, {key: 'Esc', code: 'Esc'});

        expect(await screen.findByTestId('testid-wrapper')).toBeInTheDocument();
    });

    // test("form is invalid on only prefix match", async () => {
    //     render(
    //     <Form>
    //         <Form.Group >
    //             <OurAddDropdownForm content={threeOptions} label="empty" />
    //             <Form.Control.Feedback type="invalid">
    //                 {"error message unique"}
    //             </Form.Control.Feedback>
    //         </Form.Group>
    //         <Button type="submit" data-testid="submit-me"/>
    //     </Form>
    //     );

    //     expect(await screen.findByTestId('testid-test-dropdown-form')).toBeInTheDocument();
    //     const submitField = screen.getByTestId('testid-test-dropdown-form');
    //     fireEvent.change(submitField, { target: { value : 'c'} });
    //     fireEvent.select(submitField);

    //     const submitButton = screen.getByTestId("submit-me");
    //     fireEvent.click(submitButton);

    //     expect(await screen.findByText("error message unique")).toBeInTheDocument();

    // });

    // test("form is not invalid on match", async () => {
    //     const {
    //         register,
    //         formState: { errors },
    //         handleSubmit,
    //     } = useForm(
    //         { defaultValues: initialContents || {}, }
    //     );

    //     render(
    //     <Form onSubmit={handleSubmit()}>
    //         <Form.Group >
    //             <OurAddDropdownForm content={threeOptions} label="empty" />
    //             <Form.Control.Feedback type="invalid">
    //                 {"error message unique"}
    //             </Form.Control.Feedback>
    //         </Form.Group>
    //         <Button type="submit" data-testid="submit-me"/>
    //     </Form>
    //     );

    //     expect(await screen.findByTestId('testid-test-dropdown-form')).toBeInTheDocument();
    //     const submitField = screen.getByTestId('testid-test-dropdown-form');
    //     fireEvent.change(submitField, { target: { value : 'choose me'} });
    //     fireEvent.select(submitField);

    //     expect(await screen.findByTestId('testid-wrapper')).toBeInTheDocument();
    //     fireEvent.keyDown(submitField, {key: 'Enter', code: 'Enter'});

    //     const submitButton = screen.getByTestId("submit-me");
    //     fireEvent.click(submitButton);

    //     expect(screen.queryByText("error message unique")).not.toBeInTheDocument();

    // });

});
