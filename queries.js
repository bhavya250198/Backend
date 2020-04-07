const Pool = require('pg').Pool
const pool = new Pool({
  user: 'postgres',
  host: '127.0.0.1',
  database: 'Bhavya',
  password: 'postgres',
  port: 5432,
})
const getMerchants = () => {
  return new Promise(function(resolve, reject)  {
  pool.query('select s.sid,s.song,s.dor,s.rate,array_to_string(array_agg(a.name),',')from songs s Left join art ar on s.sid=ar.sid left join artist a on ar.aid=a.aid group by s.sid, s.song order by sid asc', 
  (error, results) => {
    if (error) {
      reject(error) 
    }
    resolve(results.rows);
  })
})
}
const createMerchant = (body) => {
  return new Promise(function(resolve, reject) {
    const { name, email } = body
    pool.query('INSERT INTO merchants (name, email) VALUES ($1, $2) RETURNING *', [name, email], (error, results) => {
      if (error) {
        reject(error)
      }
      resolve(`A new merchant has been added added: ${results.rows[0]}`)
    })
  })
}
const deleteMerchant = () => {
  return new Promise(function(resolve, reject) {
    const id = parseInt(request.params.id)
    pool.query('DELETE FROM merchants WHERE id = $1', [id], (error, results) => {
      if (error) {
        reject(error)
      }
      resolve(`Merchant deleted with ID: ${id}`)
    })
  })
}
module.exports = {
  getMerchants,createMerchant,deleteMerchant}




// const getUsers = (request, response) => {
//     pool.query('select s.sid,s.song,s.dor,s.rate,array_to_string(array_agg(a.name),',')from songs s Left join art ar on s.sid=ar.sid left join artist a on ar.aid=a.aid group by s.sid, s.song order by sid asc', (error, results) => {
//       if (error) {
//         throw error
//       }
//       response.status(200).json(results.rows)
//     })
//   }
  