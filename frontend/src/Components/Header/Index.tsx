/* eslint-disable @typescript-eslint/no-unused-vars */

import { AppBar, Box, Toolbar, Typography } from "@mui/material";
import Navbar from "../Navbar";

type Props = {
    title: string;
};

export default function Header ( {title}: Props ){

    return(
        <AppBar position="static">
            <Toolbar>
                <Typography 
                variant="h6" 
                noWrap
                component="div"
                sx={{display:{xs: 'none', sm:'block'}}}
                >
                    {title}
                </Typography>
                <Box sx={{flexGrow: 1}} />
                <Navbar />
            </Toolbar>
        </AppBar>
    )
}