import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';

const Hero = (props) => {

    const title = props.title;
    

    // console.log(props, theme);

    return (
        <Paper
        sx={{
          flexGrow: 1,
          backgroundColor: (theme) =>
            theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
            marginTop: -1
        }}
        >
            <Typography variant="h1"
                sx={{
                    height: "15rem",
                    backgroundImage: "linear-gradient(to right, #007bff, #000)",
                    color: "#fff",
                    width: "100%",
                    paddingTop: "3rem"
                }}
                align="center">
                {title}
            </Typography>
        </Paper>
    )
}

export default Hero;