import React from "react";

interface AnswerTextProps {
    displayText: string;
}

const AnswerText: React.FC<AnswerTextProps> = ({ displayText: answer }) => (
    <p>{answer.split(/\n/)
        .map((item, index) => (
            <React.Fragment key={index}>
                {item}
                <br />
            </React.Fragment>
        ))
    }</p>
);

export default AnswerText;