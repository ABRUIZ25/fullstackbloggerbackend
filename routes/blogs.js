var express = require('express');
const { post } = require('.');


const { blogsDB } = require('../mongo');
var router = express.Router();


router.get('/hello-blogs', function (req, res, next) {

    res.json({ message: "hello from express" })

});

router.get('/all-blogs', async function (req, res, next) {
    try {
        const limit = Number(req.query.limit)
        const skip = Number(req.query.limit) * (Number(req.query.page) - 1)
        const sortField = req.query.sortField
        const sortOrder = req.query.sortOrder
        const filterField = req.query.filterField
        const filterValue = req.query.filterValue
        const collection = await blogsDB().collection('posts')

        console.log(filterField)
        console.log(filterValue)

        let filterObject = {}
        if (filterField && filterValue) {
            filterObject = { [filterField]: filterValue }
        }
        let sortObject = {}
        if (sortField && sortOrder) {
            sortObject = { [sortField]: sortOrder }
        }
        let dbLimit = limit
        if (!limit) {
            dbLimit = 100
        }

        let dbSkip = skip
        if (!skip) {
            dbSkip = 0
        }
        const posts = await collection
            .find(filterObject)
            .sort(sortObject)
            .limit(dbLimit)
            .skip(dbSkip)
            .toArray()
        res.json({ message: posts })
    } catch (e) {
        res.statusCode(e).send('error :' + e)
        console.log(e)
    }


})

router.post('/blog-submit', async function (req, res, next) {
    const title = req.body.title
    const text = req.body.text
    const author = req.body.author

    const collection = await blogsDB().collection("posts")
    const count = await collection.count()

    const newBlogPost = {
        title,
        text,
        author,
        createdAt: new Date(),
        lastModified: new Date(),
        id: count + 1
    }

    await collection.insertOne(newBlogPost)
    res.json({ success: true })
})

router.get('/blogs/single-blog/:blogId', async function (req, res, send) {
    const blogId = Number(req.params.blogId);
    const collection = await blogsDB().collection("posts")
    const blogPost = await collection.findOne({ id: blogId })
    res.json(blogPost)

})




module.exports = router;



// router.get('/', function (req, res, next) {
//     console.log('home')
//     res.render('index', { title: 'Express' });
//   });


// router.get('/blogs/hello-blogs') function (req, res, next) {
//     console.log('hello')
//     res.json({ message: "hello from express" })
// }