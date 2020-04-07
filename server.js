const postTableData = (req, res, db) => {
    const { name,dob,rate} = req.body
    const added = new Date()
    db('artist').insert({name,dob,rate})
      .returning('*')
      .then(item => {
        res.json(item)
      })
      .catch(err => res.status(400).json({dbError: 'db error'}))
  }
  module.exports = {
    postTableData
  }