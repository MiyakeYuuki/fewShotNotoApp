import React, { FormEventHandler } from "react";
import { MyButton } from '../styles/styles';
import {
    CardActions,
} from "@mui/material";

type ButtonProps = {
    buttonDisplayName: string,
    formHandler: FormEventHandler<HTMLFormElement>,
}

const Buttton: React.FC<ButtonProps> = ({
    buttonDisplayName,
    formHandler,
}) => {
    return (
        <form onSubmit={formHandler}>
            <CardActions>
                <MyButton
                    type="submit"
                    color="primary"
                    variant="contained"
                >
                    {buttonDisplayName}
                </MyButton>
            </CardActions>
        </form>
    )
}

export default Buttton;