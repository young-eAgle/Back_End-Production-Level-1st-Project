import multer from  "multer"


const storage = multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,"./public/temp")
    },
    filename:function (req, file,cb){
        // const uniqueSuffix =Date.now()+'-'+Math.round(Math.random()* 1E9)
        // cb(null, file.fieldname + '-' + uniqueSuffix)
        cb(null,file.originalname)
        //Here cb is callback and if user want to change the name of file with random above given suffix he can do this
    }
})

export const upload = multer({storage:storage})
/*here we are using es6 so we can write the above code in a below given way because
if both name are same then we can write only one name.

export const upload = multer(

{storage,}
)
*/











// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//       cb(null, '/tmp/my-uploads')
//     },
//     filename: function (req, file, cb) {
//       const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
//       cb(null, file.fieldname + '-' + uniqueSuffix)
//     }
//   })
  
//   const upload = multer({ storage: storage })