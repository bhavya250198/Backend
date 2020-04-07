const app = require("express")();
const bodyParser = require('body-parser');
const {Pool} = require("pg");
// var app=express();
var cors = require('cors')
const pool = new Pool({
    "host": "localhost",
    "port": 5432,
    "user":"postgres",
    "password" : "postgres",
    "database" : "Delta",
    "max": 20,
    "connectionTimeoutMillis" : 0,
    "idleTimeoutMillis": 0
})
app.use(cors())
app.use(bodyParser.json());
const main = require('./server')


app.get("/songs", async (req, res) => {
    const fromDate = new Date();

    //return all rows
    const results = await pool.query("select s.sid, s.song,s.dor,s.rate,array_to_string(array_agg(a.name),',') as artist from songs s Left join art ar on s.sid=ar.sid left join artists a on ar.aid=a.aid group by s.sid, s.song order by s.rate desc limit 10")
    console.table(results.rows)
    console.log(new Date())
    const toDate = new Date();
    const elapsed = toDate.getTime() - fromDate.getTime();

    //send it to the wire
    res.send({"rows": results.rows, "elapsed": elapsed, "method": "pool"})
})
app.get("/artists", async (req, res) => {
    const fromDate = new Date();

    //return all rows
    const results = await pool.query("select a.name,a.dob,a.rate, array_to_string(array_agg(s.song),',') as song from artists a Left join art ar on a.aid=ar.aid left join songs s on ar.sid=s.sid group by a.aid, a.name order by a.rate desc limit 10")
    console.table(results.rows)
    console.log(new Date())
    const toDate = new Date();
    const elapsed = toDate.getTime() - fromDate.getTime();

    //send it to the wire
    res.send({"rows": results.rows, "elapsed": elapsed, "method": "pool"})
})
app.post("/add", async (req, response) => {
    const fromDate = new Date();
    const results = await  pool.query('INSERT INTO artists(name, dob, rate,bio)values($1,$2,$3,$4)',[req.body.name,req.body.dob,req.body.rate,req.body.bio], (error, results) => {
        if (error) {
          throw error
        }
        response.status(201).send(`User added`)
      }) 
})
app.post("/addusers", async (req, response) => {
    const fromDate = new Date();
    const results = await  pool.query('INSERT INTO users(uname, uemail)values($1,$2)',[req.body.uname,req.body.uemail], (error, results) => {
        if (error) {
          throw error
        }
        response.status(201).send(`User added`)
      }) 
})
app.post("/songs/rate", async (req, response) => {
    console.log(req.body.newrating,req.body.sid);
    const results = await  pool.query('UPDATE songs set rate=(rate*counting+$1)/(counting+1),counting=counting+1 where sid=$2',[req.body.newrating,req.body.sid], (error, results) => {
        if (error) {
          throw error
        }
        response.status(201).send(`Rating added`)
      }) 
    //   const results1 = await  pool.query('UPDATE songs set counting=counting+1 where sid=$2',[req.body.newrating,req.body.sid], (error, results1) => {
    //     if (error) {
    //       throw error
    //     }
    //     response.status(201).send(`User added`)
    //   }) 
})
app.get("/getartist", async (req, res) => {
    const fromDate = new Date();

    //return all rows
    const results = await pool.query("select name,aid as id from artists")
    console.table(results.rows)
    console.log(new Date())
    const toDate = new Date();
    const elapsed = toDate.getTime() - fromDate.getTime();

    //send it to the wire
    res.send({"rows": results.rows, "elapsed": elapsed, "method": "pool"})
})
app.post("/add123", async (req, response) => {
    const fromDate = new Date();
    console.log('entering');
    const results = await  pool.query('INSERT INTO songs(song, dor, rate)values($1,$2,$3)',[req.body.song,req.body.dor,req.body.rate], (error, results) => {
        if (error) {
          throw error
        }
        response.status(201).send(`User added`)
      }) 
})
app.get("/newsongsid", async (req, res) => {
  const fromDate = new Date();

  //return all rows
  const results = await pool.query("select(max(sid)) from songs")
  console.table(results.rows)
  console.log(new Date())
  const toDate = new Date();
  const elapsed = toDate.getTime() - fromDate.getTime();

  //send it to the wire
  res.send({"rows": results.rows, "elapsed": elapsed, "method": "pool"})
})
app.post("/addsongartist", async (req, response) => {
  const fromDate = new Date();
  console.log('entering');
  console.log(req.body.ssid);
  console.log(req.body.caid);
  const results = await  pool.query('INSERT INTO art values($1,$2)',[req.body.ssid,req.body.caid], (error, results) => {
      if (error) {
        throw error
      }
      response.status(201).send(`User added`)
    }) 
})
app.listen(4000, () => console.log("Listening on port 4000"));