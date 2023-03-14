// import mongodb from "mongodb";

// const mongoClient = mongodb.MongoClient;
// let _db;

// const mongoConnect = (callback) => {
//   mongoClient
//     .connect(
//       "mongodb://adam:Pknqsx123.@ac-4st63nd-shard-00-00.myiaxw1.mongodb.net:27017,ac-4st63nd-shard-00-01.myiaxw1.mongodb.net:27017,ac-4st63nd-shard-00-02.myiaxw1.mongodb.net:27017/?ssl=true&replicaSet=atlas-10elfg-shard-0&authSource=admin&retryWrites=true&w=majority"
//     )
//     .then((client) => {
//       console.log("Succes to connect!");
//       _db = client.db("shop");
//       callback();
//     })
//     .catch((error) => console.log(error));
// };

// const getDb = () => {
//   if (_db) return _db;
//   throw "No database found";
// };

// export { mongoConnect, getDb };
