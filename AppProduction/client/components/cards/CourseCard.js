import { Card } from "@mui/material";
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { Button, CardActionArea, CardActions } from '@mui/material';
import Badge from '@mui/material/Badge';

import Link from "next/link";

import { currencyFormatter } from "../../../server/utills/helpers";

const CourseCard = ({course}) => {
    const { title, instructor, price, image, slug, paid, category, description} = course;
    return <Link href={"/course/"+slug}>
        <a>
        <Card sx={{ maxWidth: 345 }}>
            <CardActionArea>
                <CardMedia
                component="img"
                height="160"
                image={image && image.Location ? image.Location  : 'course.png'}
                alt={title}
                />
                <CardContent>
                <Typography gutterBottom variant="h5">
                    {title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    {description}
                </Typography>
                </CardContent>
            </CardActionArea>
            <CardActions
                sx={{
                    color: '#03a9f4',
                    paddingBottom: '2rem',
                    paddingLeft: '2rem',
                }}
                >
            
                <Button size="small" color="primary">
                    <Badge color="primary" badgeContent={category} 

                    ></Badge>
                </Button>
                <Button size="small">

                    <Typography gutterBottom variant="h5">
                        {paid ? currencyFormatter({
                            amount: price,
                            currency: 'usd'
                        }) : 'Free'}
                    </Typography>
                </Button>

            </CardActions>
        </Card>

        </a>
    </Link>
}

export default CourseCard;