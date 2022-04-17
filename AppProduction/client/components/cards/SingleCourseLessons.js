import { Typography, Grid, Divider } from "@mui/material";
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Avatar from "@mui/material/Avatar";
import { Button } from "@mui/material";
import VisibilityIcon from '@mui/icons-material/Visibility';

const SingleCourseLessons = ({
    lessons,
    handlePreviewDialog,
}) => {
    let freeLesson = 0;
    return <>
    <Grid container direction="row" sx={{
        padding: '1rem 8rem'
    }}>
        <Grid item >
                {lessons && <Typography variant="h4"> {lessons.length} Lessons </Typography>}
        </Grid>
        <Divider />
        <Grid item container direction="column">
            <List>
                {lessons && lessons.map((item, index) => (
                    <ListItem
                        key={item.slug+'-'+index}
                        secondaryAction= {item.video && item.video.Location !== undefined && item.free_preview && (
                            <Button data-free-lesson={freeLesson++} onClick={(event) => {
                                    handlePreviewDialog(event);
                                }}
                                startIcon={<VisibilityIcon color="primary" />}>
                            Preview
                            </Button>
                            )}
                    >
                    <ListItemAvatar>
                        <Avatar>
                            {index+1}
                        </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                        primary={item.title}
                    />
                   
                    </ListItem>
                ))}
            </List>
        </Grid>
    </Grid>
    
    </>
};

export default SingleCourseLessons;