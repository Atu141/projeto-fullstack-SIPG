import { AppBar, Toolbar, Typography } from "@mui/material";

type Props = {
  title: string;
};

export default function Header({ title }: Props) {
  return (
    <AppBar>
      <Toolbar>
        <Typography variant="h6" component="div">
          {title}
        </Typography>
      </Toolbar>
    </AppBar>
  );
}
