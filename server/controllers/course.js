const AWS = require('aws-sdk');
import {nanoid} from 'nanoid';
import Course from '../models/course';
import slugify from 'slugify';
import {readFileSync} from 'fs';


const awsConfig = {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION,
    apiVersion: process.env.AWS_API_VERSION
};
 
const S3 = new AWS.S3(awsConfig);

export const uploadImage = async (req, res) => {
    // console.log(req.body);
    try {
        const {image} = req.body;
        if(!image) return res.status(400).send('No Image');

        // prepare the image
        const base64Data = new Buffer.from(image.replace(/^data:image\/\w+;base64,/, ''), "base64");
        const type = image.split(';')[0].split('/')[1];

        // image params
        const params = {
            Bucket: "eduflix-bucket",
            Key: `${nanoid()}.${type}`,
            Body: base64Data,
            ACL: 'public-read',
            ContentEncoding: "base64",
            ContentType: `image/${type}`,
        };

        // upload to S3
        S3.upload(params, (err, data) => {
            if(err) {
                console.log(err); 
                return res.sendStatus(400);
            }

            console.log(data);
            res.send(data);
        });

    } catch(err) {
        console.log(err);
    }
};


export const removeImage = async (req, res) => {
    // console.log(req.params);
    // console.log(req.user);
    // return;
    if( req.params.instructorId != req.user._id ) return res.status(400).send('Unauthorized');

    try {
        const {image} = req.body;
        if(!image) return res.status(400).send('No image');
        const params = {
            Bucket: image.Bucket,
            Key: image.Key,

        };

        // send remove request to s3
        S3.deleteObject(params, (err, data) => {
            if(err) {
                console.log(err);
                res.sendStatus(400);
            }
            res.send({ ok:true });
        });
    } catch(err) {
        console.log(err);
    }
};



export const create = async (req, res) => {
    // console.log("CREATE COURSE", req.body);
    // return;
    try {
        const alreadyExist = await Course.findOne({
            slug: slugify(req.body.title.toLowerCase()),
        });
        if(alreadyExist) return res.status(400).send("Title is taken");

        const course = await new Course({
            slug: slugify(req.body.title),
            instructor: req.user._id,
            ...req.body,
        }).save();
        res.json(course);

    } catch(err) {
        console.log(err);
        return res.status(400).send("Course create failed. Try again.")
    }
};


export const read = async (req, res) => {
    try {

        const course = await Course.findOne({slug: req.params.slug})
            .populate("instructor", "_id name").exec();
        res.json(course);



    } catch(err) {
        console.log(err);
    }
};

export const uploadVideo = async (req, res) => {
    // console.log('req.user._id', req.user._id);;
    // console.log('req.params.instructorId', req.params.instructorId);;
    if( req.params.instructorId != req.user._id ) return res.status(400).send('Unauthorized');
    try {
        const {video} = req.files;
        // console.log(video);

        if(!video) return res.status(400).send('No video');

        // video params
        const params = {
            Bucket: "eduflix-video-lessons",
            Key: `${nanoid()}.${video.type.split('/')[1]}`, // 
            Body: readFileSync(video.path),
            ACL: 'public-read',
            ContentEncoding: "base64",
            ContentType: video.type,
        };

        // upload to S3
        S3.upload(params, (err, data) => {
            if(err) {
                console.log(err);
                res.sendStatus(400);
            }

            console.log(data);
            return res.send(data);
        });

    } catch(err) {
        console.log(err);
    }
};



export const removeVideo = async (req, res) => {
    console.log(req);
    if( req.params.instructorId != req.user._id ) return res.status(400).send('Unauthorized');
    try {
        const {video} = req.body;
        if(!video) return res.status(400).send('No video');
        const params = {
            Bucket: video.Bucket,
            Key: video.Key,

        };

        // send remove request to s3
        S3.deleteObject(params, (err, data) => {
            if(err) {
                console.log(err);
                res.sendStatus(400);
            }
            res.send({ ok:true });
        });
    } catch(err) {
        console.log(err);
        return res.status(400).send("Remove video failed");
    }
};



export const addLesson = async (req, res) => {
    try {
        const { slug, instructorId } = req.params;
        const { title, content, video } = req.body;

        if(req.user._id != instructorId) {
            return res.status(400).send('Unauthorized');
        }

        const updated = await Course.findOneAndUpdate(
            {slug}, 
            {
            $push: {lessons: {title, content, video, slug: slugify(title)}}
            }, 
            {new: true}
        ).populate('instructor', "_id name").exec();
        
        res.json({...updated, ok: true});

    } catch(err) {
        console.log(err);
        return res.status(400).send("Add Lesson failed");
    };
};

export const update = async (req, res) => {
    try {
        const { slug } = req.params;
        const course = await Course.findOne({ slug }).exec();

        if(req.user._id != course.instructor) return res.status(400).send('Unauthorized');

        const updated = await Course.findOneAndUpdate(
            {slug},
            req.body,
            {
                new: true
            }

        ).exec();

        res.json({...updated, ok: true});

    } catch(err) {
        console.log(err);
        return res.status(400).send("Course update failed. Try again.")
    }
};


export const removeLesson = async (req, res) => {
    const { slug, lessonId } = req.params;

    const course = await Course.findOne({ slug }).exec();
    if(req.user._id != course.instructor) return res.status(400).send('Unauthorized');
    console.log(course);
    const deletedCourse = await Course.findOneAndUpdate({_id: course._id},{
            $pull: { lessons: { _id: lessonId } },
        }).exec();

    res.json({ ok: true });
};

export const updateLesson = async (req, res) => {
   try {
    const { slug} = req.params;
    const { title, content, video, free_preview, _id } = req.body;
    const course = await Course.findOne({slug}).select("instructor").exec();
    if(req.user._id != course.instructor._id) return res.status(400).send('Unauthorized');

    const updated = await Course.updateOne(
        {"lessons._id": _id},
        {
            $set: {
                "lessons.$.title": title,
                "lessons.$.content": content,
                "lessons.$.video": video,
                "lessons.$.free_preview": free_preview,
            }
        },
        { new: true }
    ).exec();
    // console.log('updated', updated);
    
    res.json({ok: true});
   } catch(err) {
       console.log(err);
       return res.status(400).send("Update lesson failed");
   }
    
};

export const publishCourse = async (req, res) => {
    try {
        const {courseId} = req.params;
        const course = await Course.findById(courseId).select("instructor").exec();
        if( req.user._id != course.instructor._id) {
            return res.status(400).send('Unauthorized');
        }

        const updated = await Course.findById(courseId, {published: true}, {new: true}).exec();

        res.json(updated);
        

    } catch (err) {
        console.log(err);
        return res.status(400).send('Publish course failed')
    }
};

export const unPublishCourse = async (req, res) => {
    try {
        const {courseId} = req.params;
        const course = await Course.findById(courseId).select("instructor").exec();
        if( req.user._id != course.instructor._id) {
            return res.status(400).send('Unauthorized');
        }

        const updated = await Course.findById(courseId, {published: false}, {new: true}).exec();

        res.json(updated);
    } catch (err) {
        console.log(err);
        return res.status(400).send('UnPublish course failed')
    }
}