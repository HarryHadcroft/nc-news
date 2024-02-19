const app = require("./app")

app.listen(9090, (error) => {
    if(error) console.log("error connecting to server")
    else console.log("listening on 9090")
})