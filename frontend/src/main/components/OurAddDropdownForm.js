import React from 'react';
import { useState, useEffect } from 'react';
import { Form } from 'react-bootstrap';

function DropdownOption({ label, isSelected, onClickFunc, testid, rawKey, isGhost }) {
    const [isHovered, setIsHovered] = useState(false);
    const handleMouseEnter = () => {
        setIsHovered(true);
    };
    const handleMouseLeave = () => {
        setIsHovered(false);
    };
    // Stryker disable all
    const divStyle = {
        backgroundColor: isHovered ? 'lightgreen' : 'white',
        transition: 'background-color 0.25s ease',
        'paddingLeft': '2px',
        'paddingRight': '2px',
        'cursor': 'pointer',
    };
    // Stryker restore all
    let mainOption;
    if (!isSelected) {
        let altStyle = divStyle;
        if(isGhost){
            altStyle['backgroundColor'] = 'lightgreen';
        }
        mainOption = (
            <div
                key={rawKey}
                data-testid={testid}
                style={altStyle}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                onClick={onClickFunc}
            >
                {label}
            </div>
        );
    } else {
        // Stryker disable all
        let altStyle = divStyle;
        altStyle['backgroundColor'] = 'green';
        altStyle['color'] = 'white';
        // Stryker restore all
        mainOption = (
            <div key={rawKey} data-testid={testid} style={altStyle} onClick={onClickFunc}>
                {label}
            </div>
        );
    }
    return <div>{mainOption}</div>;
}

export default function OurAddDropdownForm({
    content,
    label,
    basis,
    testId = 'testid',
    onChangeFunc = null,
    register = null,
    htmlFor = "label"
}) {
    // Stryker disable all
    content.sort((a, b) => {
        if (a.label < b.label) {
            return -1;
        }
        if (a.label > b.label) {
            return 1;
        }
        return 0;
    });
    // Stryker restore all

    const [filteredContent, changeFilteredContent] = useState(content);

    // Stryker disable all
    useEffect(() => {
        const fixedContent = [];
        for (let i = 0; i < content.length; ++i) {
            if (!basis || content[i].label.startsWith(basis.label)) {
                fixedContent.push(content[i]);
            }
        }
        changeFilteredContent(fixedContent);
        if(fixedContent.length > 0){
            changeGhostContent(fixedContent[0]);
        }
    }, [content, basis]);
    // Stryker restore all

    const [selectedContent, changeSelectedContent] = useState(basis);
    const [userTypedContent, changeUserTypContent] = useState(basis ? basis.label : "");
    const [showingDropdown, changeShowingDropdown] = useState(false);
    const [validationStyle, changeValidationStyle] = useState({});
    // Stryker disable next-line all : there might be a good test for this but since showingDropdown doesn't render anything on fixedContent.length === 0 this might be harder to test
    const [ghostContent, changeGhostContent] = useState(filteredContent.length > 0 ? filteredContent[0] : null);

    // Stryker disable all
    const optionWrapperStyle = {
        position: 'absolute',
        left: '26px',
        'marginTop': '4px',
        'borderRadius': '2px',
        'overflowY': 'scroll',
        height: '200px',
    };
    // Stryker restore all

    let count = 0;
    const filterPrefix = (prefix) => {
        // filter the dropdown to only have the matching prefix options
        const prefixedContent = [];
        let isValidSelection = false;
        let overflow = true;
        let first = true;

        for(let i = 0; i < content.length; ++i){
            if(content[i].label.startsWith(prefix)){
                overflow = false;
                // the first element will be "semihovered" i.e. the user can press enter
                // autofill the text automatically
                if(first){
                    changeGhostContent(content[i]);
                    first = false;
                }
                // a direct match is found
                // NOTE: THIS ASSUMES THAT ALL CONTENT IS UNIQUE
                if(content[i].label === prefix){
                    changeSelectedContent(content[i]);
                    isValidSelection = true;
                }
                prefixedContent.push(content[i]);
            }
        }
        // if there was no direct match then there is no selectedContent
        if(!isValidSelection){
            changeSelectedContent(null);
        } 
        // no matches or prefix matches
        if(overflow){
            changeValidationStyle({color:"red"});
            changeGhostContent(null);
        } else {
            changeValidationStyle({});
        }
        changeFilteredContent(prefixedContent);
    };

    const internalOnChange = (event) => {
        // grab the userText 
        const newSelectedContent = event.target.value;
        changeUserTypContent(newSelectedContent);
        filterPrefix(newSelectedContent);
        if (onChangeFunc) {
            onChangeFunc(event);
        }
    };

    const fillGhost = (event) => {
        if(event.key === "Enter" && ghostContent !== null) {
            changeUserTypContent(ghostContent.label);
            filterPrefix(ghostContent.label);
            changeShowingDropdown(false);
        } else {
            changeShowingDropdown(true);
        }
    };
    return (
        <div>
            <Form.Label htmlFor={htmlFor}>{label}</Form.Label>
                {content.length !== 0 && register !== null  && (
                    <Form.Control
                        data-testid={`${testId}-test-dropdown-form`}
                        type="text"
                        value={userTypedContent}
                        onChange={internalOnChange}
                        style={validationStyle}
                        onFocus={() => {changeShowingDropdown(true);}}
                        onClick={() => {changeShowingDropdown(true);}}
                        onKeyDown={fillGhost}
                        {...register()}
                    />
                )}
                {content.length !== 0 && register === null && (
                    <Form.Control
                        data-testid={`${testId}-test-dropdown-form`}
                        type="text"
                        value={userTypedContent}
                        onChange={internalOnChange}
                        style={validationStyle}
                        onFocus={() => {changeShowingDropdown(true);}}
                        onClick={() => {changeShowingDropdown(true);}}
                        onKeyDown={fillGhost}
                    />
                )}
                {showingDropdown && (
                    <div data-testid = {`${testId}-wrapper`} style={optionWrapperStyle}>
                        {filteredContent.map((obj) => {
                            const key = obj.key;
                            const innerLabel = obj.label;
                            const select = () => {
                                changeSelectedContent(obj);
                                changeUserTypContent(innerLabel);
                                changeGhostContent(obj);
                                filterPrefix(innerLabel);
                                changeShowingDropdown(false);
                            };
                            return (
                                <DropdownOption
                                    testid={`${testId}-dropdown-form-option-${count++}`}
                                    label={innerLabel}
                                    isSelected={selectedContent && key === selectedContent.key}
                                    isGhost={ghostContent && key === ghostContent.key}
                                    rawKey = {key}
                                    // Stryker disable next-line all
                                    key ={`${key}-dropdown-option`}
                                    onClickFunc={select}
                                ></DropdownOption>
                            );
                        })}
                    </div>
                )}
                {content.length === 0 && register !== null && (
                    <Form.Control
                        data-testid={`${testId}-test-dropdown-form`}
                        type="text"
                        disabled={true}
                        style={{ cursor: 'not-allowed' }}
                        {...register()} // this would (intentionally) make a form impossible to submit as there are no schools in the system
                    />
                )}
                {content.length === 0 && register === null && (
                    <Form.Control
                        data-testid={`${testId}-test-dropdown-form`}
                        type="text"
                        disabled={true}
                        style={{ cursor: 'not-allowed' }}
                    />
                )}
        </div>
    );
}
