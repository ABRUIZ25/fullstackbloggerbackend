var express = require("express");
var router = express.Router();
const { blogsDB } = require("../mongo");

router.get('/hello-admin', function (req, res, next) {

    res.json({ message: "hello from express" })

});

router.get('/blog-list', async function (req, res, next) {
    const collection = await blogsDB().collection("posts")
    const dbResults = await collection.find({}).project({ text: 0 })
        .toArray()
    res.json(dbResults)
})


router.put('/edit-blog', async function (req, res, next) {

    const blogId = req.body.blogId
    const title = req.body.title
    const text = req.body.text
    const author = req.body.author

    const newBlogPost = {
        title,
        text,
        author,
        createdAt: new Date(),
        lastModified: new Date(),
    }

    try {
        const collection = await blogsDB().collection("posts")
        await collection.updateOne({
            id: blogId
        }, {
            $set: {
                ...newBlogPost
            }
        })
        res.json({ success: true })
    } catch (e) {
        console.error(e)
        res.json({ success: false })
    }
})

router.delete('/delete-blog/:blogId', async function (req, res, next) {

    try {
        const collection = await blogsDB().collection("posts")
        await collection.deleteOne({
            id: blogId
        })
        res.json({ success: true })
    } catch (e) {
        console.error(e)
        res.json({ success: false })
    }

    const deleteBlog = async (blogId) => {
        setAdminBlogsLoading(true)
        const url = `${urlEndpoint}/admin/delete-blog/${blogId}`
        const response = await fetch(url, {
            method: 'DELETE'
        });
        const responseJSON = await response.json();
        setAdminBlogsLoading(false)
        res.json({ success: true })
    }

})

module.exports = router